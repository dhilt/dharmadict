const passwordHash = require('password-hash');
const elasticClient = require('../db/client.js');
const ApiError = require('./../helper.js').ApiError;
const logger = require('../log/logger');
const config = require('../config.js');
const validator = require('./validators/users.js');

const isAdmin = (user) => {
  if (user.role !== 'admin') {
    return Promise.reject(new ApiError('Admin only', 302));
  }
  Promise.resolve(user);
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

const findAll = () => new Promise((resolve, reject) => {
  logger.info(`Find all users`);
  elasticClient.search({
    index: config.db.index,
    type: 'users',
    body: {}
  }).then(result => {
    let users = result.hits.hits;
    if (!users.length) {
      return reject(new ApiError(`Can't find all users`, 404))
    }
    logger.info('A users was found');
    return resolve(users)
  }, error => {
    logger.error(error.message);
    return reject(new ApiError('Database error'))
  })
})
  .then(users => {  // perfection of data
    users = users.map(elem => {
      let cleanUserInfo = elem._source;
      cleanUserInfo.id = elem._id;
      return getUserInfo(cleanUserInfo)
    });
    return Promise.resolve(users)
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

const updateDescription = data => validator.updateDescription(data)
  .then(() => findById(data.id))
  .then(user => {
    user.description = data.description;
    delete user.id;
    return elasticClient.index({
      index: config.db.index,
      type: 'users',
      id: data.id,
      body: user,
      refresh: true
    }).then(() => {
      logger.info('User description was successfully updated');
      return Promise.resolve(data.id)
    }, error => {
      logger.error(error.message);
      throw new ApiError('DB error')
    })
  })
  .then(id => findById(id));

const getUserInfo = user => ({
  id: user.id,
  name: user.name,
  login: user.login,
  role: user.role,
  description: user.description
});

module.exports = {
  isAdmin,
  getUserInfo,
  canLogin,
  findById,
  findByLogin,
  findAll,
  create,
  updateDescription,
  removeById
};
