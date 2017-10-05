const passwordHash = require('password-hash');
const elasticClient = require('../db/client');
const ApiError = require('./../helper').ApiError;
const languages = require('./../helper').languages;
const logger = require('../log/logger');
const config = require('../config');
const validator = require('./validators/users');

const getUserInfo = (user, isPublic = true) => {
 const result = {
    id: user.id,
    name: user.name,
    login: user.login,
    role: user.role,
    description: user.description,
    language: languages.getLang(user.language).id
  };
  if (isPublic) {
    delete result.login
  }
  return result
};

const isAdmin = (user) => {
  if (user.role !== 'admin') {
    return Promise.reject(new ApiError('Admin only', 302));
  }
  return Promise.resolve(user);
};

const canLogin = (login, password) => new Promise(resolve => {
  logger.info(`Check if user ${login} can login`);
  if (!login || !password) {
    throw new ApiError('Invalid params')
  }
  resolve(true)
})
  .then(() => findByLogin(login))
  .then(user => {
    if (!passwordHash.verify(password, user.hash)) {
      throw new ApiError('Wrong credentials')
    }
    return Promise.resolve(user)
  });

const findById = userId => new Promise((resolve, reject) => {
  logger.info(`Find user by ID ${userId}`);
  if (!userId) {
    return reject(new ApiError('Invalid ID'))
  }
  elasticClient.search({
    index: config.db.index,
    type: 'users',
    body: {
      query: {
        ids: {
          values: [userId]
        }
      }
    }
  }).then(response => {
      const result = response.hits.hits[0];
      if (!result || !result._source) {
        return reject(new ApiError('No user found', 404))
      }
      result._source.id = result._id;
      resolve(result._source)
    },
    error => {
      logger.error(error);
      reject(new ApiError('Database error'))
    })
});

const findByLogin = userLogin => new Promise((resolve, reject) => {
  logger.info(`Find user by login ${userLogin}`);
  if (!userLogin) {
    return reject(new ApiError('Invalid login'))
  }
  return resolve(true)
})
  .then(() =>
    elasticClient.search({
      index: config.db.index,
      type: 'users',
      body: {
        query: {
          term: {
            login: userLogin
          }
        }
      }
    })
  )
  .then(response => {
    const result = response.hits.hits[0];
    if (!result || !result._source) {
      throw new ApiError('No user found', 404)
    }
    result._source.id = result._id;
    return Promise.resolve(result._source)
  }, error => {
    logger.error(error.message);
    throw new ApiError('Database error')
  });

const findAll = (role) => new Promise((resolve, reject) => {
  logger.info('Find users' + (role ? ` with "${role}" role` : ''));
  const body = !role ? {} : {
    query: {
      term: {
        role
      }
    }
  };
  elasticClient.search({
    index: config.db.index,
    type: 'users',
    body
  }).then(result => {
    let users = result.hits.hits;
    if (!users.length) {
      throw new ApiError(`No users found`, 404)
    }
    logger.info(`${users.length} users were found`);
    users = users.map(user => {
      let cleanUserInfo = user._source;
      cleanUserInfo.id = user._id;
      return getUserInfo(cleanUserInfo)
    });
    return resolve(users)
  }, error => {
    logger.error(error.message);
    throw new ApiError('Database error')
  })
});

const create = user => validator.create(user)
  .then(user => {
    let newUser = Object.assign({}, user);
    newUser.hash = passwordHash.generate(user.password);
    const userId = newUser.id;
    delete newUser.password;
    delete newUser.id;
    return Promise.resolve({user: newUser, userId})
  })
  .then(data =>  // check login uniqueness
    findByLogin(data.user.login).then(() => {
      throw new ApiError('Login not unique')
    }, error => {
      if (error.code === 404) {
        return Promise.resolve(data)
      }
      throw error
    })
  )
  .then(data => // check id uniqueness
    findById(data.userId).then(() => {
      throw new ApiError('Id not unique')
    }, error => {
      if (error.code === 404) {
        return Promise.resolve(data)
      }
      throw error
    })
  )
  .then(data =>  // Adding new user
    elasticClient.index({
      index: config.db.index,
      type: 'users',
      id: data.userId,
      body: data.user,
      refresh: true
    }).then(() => {
      logger.info('User was successfully created');
      return Promise.resolve({
        success: true
      })
    }, error => {
      logger.error(error.message);
      throw new ApiError('Database error')
    })
  );

const update = (userId, payload) => validator.update(userId, payload)
  .then(() => findById(userId))
  .then(user => {
    let body = Object.assign({}, user, payload);
    body.hash = passwordHash.generate(body.password);
    delete body.id;
    delete body.password;
    delete body.confirmPassword;
    return elasticClient.index({
      index: config.db.index,
      type: 'users',
      id: userId,
      body,
      refresh: true
    }).then(() => {
      logger.info('User description was successfully updated');
      return Promise.resolve(userId)
    }, error => {
      logger.error(error.message);
      throw new ApiError('DB error')
    })
  })
  .then(findById);

const removeById = userId => new Promise(resolve => {
  if (!userId || typeof userId !== 'string') {
    throw new ApiError('Invalid id')
  }
  resolve()
})
  .then(() => findById(userId))
  .then(() =>
    elasticClient.delete({
      index: config.db.index,
      type: 'users',
      id: userId,
      refresh: true
    }).then(() => {
      logger.info('User was successfully deleted');
      return Promise.resolve({
        success: true
      })
    }, error => {
      logger.error(error.message);
      throw new ApiError('DB error')
    })
  );

module.exports = {
  getUserInfo,
  isAdmin,
  canLogin,
  findById,
  findByLogin,
  findAll,
  create,
  update,
  removeById
};
