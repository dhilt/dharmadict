const passwordHash = require('password-hash');
const elasticClient = require('./helpers/db.js');
const logger = require('../log/logger');
const config = require('../config.js');

let isAdmin = (user) => {
  if (user.role !== 'admin') {
    return Promise.reject('Admin only');
  }
  Promise.resolve(user);
};

let canLogin = (login, password) => {
  logger.info(`Check if user ${login} can login`);
  if (!login || !password) {
    throw 'Invalid params'
  }
  return findByLogin(login)
    .then(user => {
      if (!passwordHash.verify(password, user.hash)) {
        throw 'Wrong credentials'
      }
      return Promise.resolve(user)
    })
    .catch(error => {
      throw error
    })
};

let _findById = userId => new Promise((resolve, reject) => {
  logger.info(`Find user by ID ${userId}`);
  if (!userId) {
    return reject('Invalid ID')
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
        return reject('No ID found')
      }
      result._source.id = result._id;
      return resolve(result._source)
    },
    error => {
      logger.error(error);
      return reject('Database error')
    })
});

let findByLogin = userLogin => new Promise((resolve, reject) => {
  logger.info(`Find user by login ${userLogin}`);
  if (!userLogin) {
    return reject('Invalid login')
  }
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
  }).then(response => {
    const result = response.hits.hits[0];
    if (!result || !result._source) {
      return reject('No user found')
    }
    result._source.id = result._id;
    return resolve(result._source)
  }, error => {
    logger.error(error.message);
    return reject('Database error')
  })
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

let create = newUser => new Promise((resolve, reject) => {
  // data validation
  if (!newUser) {
    return reject('Invalid data')
  }
  if (!newUser.id) {
    return reject('Invalid id')
  }
  if (!newUser.role) {
    return reject('Invalid role')
  }
  if (!newUser.roleId) {
    return reject('Invalid roleId')
  }
  if (!newUser.login) {
    return reject('Invalid login')
  }
  if (!newUser.name) {
    return reject('Invalid name')
  }
  if (!newUser.password) {
    return reject('Invalid password')
  }
  if (!newUser.description) {
    return reject('Invalid description')
  }
  newUser.hash = passwordHash.generate(newUser.password);
  let userId = newUser.id;
  delete newUser.password;
  delete newUser.id;
  return resolve({newUser, userId})
})
  .then(data =>  // check login uniqueness
    findByLogin(data.newUser.login).then(
      result => {
        throw `Login not unique`
      },
      error => {
        // The error should mean the absence of data.
        // And correspond to the message about this error in the method findByLogin.
        if (error == 'No login found') {
          return Promise.resolve(data)
        }
      }
    )
  )
  .then(data =>  // check id uniqueness)
    _findById(data.userId).then(
      result => {
        throw `Id not unique`
      },
      error => {
        // The error should mean the absence of data.
        // And correspond to the message about this error in the method _findById.
        if (error == 'No ID found') {
          return Promise.resolve(data)
        }
      }
    )
  )
  .then(data =>  // Adding new user
    elasticClient.index({
      index: config.db.index,
      type: 'users',
      id: data.userId,
      body: data.newUser
    }).then(result => {
      logger.info('User was successfully created');
      return Promise.resolve({
        success: true
      })
    }, error => {
      logger.error(error.message);
      throw `Create user error`
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
