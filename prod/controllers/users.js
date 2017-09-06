const passwordHash = require('password-hash');
const elasticClient = require('./helpers/db.js');
const ApiError = require('./helpers/serverHelper.js').ApiError;
const logger = require('../log/logger');
const config = require('../config.js');

let isAdmin = (user) => {
  if (user.role !== 'admin') {
    return Promise.reject('Admin only');
  }
  Promise.resolve(user);
};

let canLogin = (login, password) => new Promise(resolve => {
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
  })
  .catch(error => {
    throw error
  });

let _findById = userId => new Promise((resolve, reject) => {
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

let findByLogin = userLogin => new Promise((resolve, reject) => {
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
          match: {
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

let findAll = () => new Promise((resolve, reject) => {
  logger.info(`Find all users`);
  elasticClient.search({
    index: config.db.index,
    type: 'users',
    body: {}
  }).then(result => {
    let users = result.hits.hits;
    if (!users.length) {
      return reject(`Can't find all users`)
    }
    logger.info('A users was found');
    return resolve(users)
  }, error => {
    logger.error(error.message);
    return reject('Database error')
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

const create = newUser => new Promise(resolve => {
  // data validation
  if (!newUser) {
    throw new ApiError('Invalid data')
  }
  if (!newUser.id) {
    throw new ApiError('Invalid id')
  }
  if (!newUser.role) {
    throw new ApiError('Invalid role')
  }
  if (!newUser.login) {
    throw new ApiError('Invalid login')
  }
  if (!newUser.name) {
    throw new ApiError('Invalid name')
  }
  if (!newUser.password) {
    throw new ApiError('Invalid password')
  }
  if (!newUser.description) {
    throw new ApiError('Invalid description')
  }
  newUser.hash = passwordHash.generate(newUser.password);
  const userId = newUser.id;
  delete newUser.password;
  delete newUser.id;
  return resolve({newUser, userId})
})
  .then(data =>  // check login uniqueness
    findByLogin(data.newUser.login).then(() => {
      throw new ApiError('Login not unique')
    }, error => {
      if (error.code === 404) {
        return Promise.resolve(data)
      }
      throw error
    })
  )
  .then(data => // check id uniqueness
    _findById(data.userId).then(() => {
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
      body: data.newUser
    }).then(() => {
      logger.info('User was successfully created');
      return Promise.resolve({
        success: true
      })
    }, error => {
      logger.error(error.message);
      throw new ApiError('DB error')
    })
  );

let removeById = userId => new Promise((resolve, reject) => {
  if (!userId) {
    return reject('Error in delete user. Invalid id')
  }
  elasticClient.delete({
    index: config.db.index,
    type: 'users',
    id: userId
  }).then(response => {
    logger.info('User was deleted');
    return resolve({
      success: true
    })
  }, error => {
    logger.error(error.message);
    return reject('Delete user error')
  })
});

let getUserInfo = user => ({
  id: user.id,
  name: user.name,
  login: user.login,
  role: user.role,
  roleId: user.roleId,
  description: user.description
});

module.exports = {
  isAdmin,
  getUserInfo,
  canLogin,
  findByLogin,
  findAll,
  create,
  removeById
};