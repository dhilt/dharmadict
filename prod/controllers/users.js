let elasticsearch = require('elasticsearch');
let passwordHash = require('password-hash');
let logger = require('../log/logger');

let elasticClient = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'info'
});

let findById = userId => new Promise((resolve, reject) => {
  logger.info(`Find user by ID ${userId}`)
  if (!userId) {
    return reject('Invalid ID')
  }
  elasticClient.search({
    index: 'dharmadict',
    type: 'users',
    body: {
      query: {
        ids: {
          values: [userId]
        }
      }
    }
  }, (error, response, status) => {
    if (error) {
      logger.error(error)
      return reject('DB error')
    }
    const result = response.hits.hits[0]
    if (!result || !result._source) {
      return reject('No ID found')
    }
    result._source.id = result._id
    return resolve(getUserInfo(result._source))
  })
})

let findByLogin = userLogin => new Promise((resolve, reject) => {
  logger.info(`Find user by login ${userLogin}`)
  if (!userLogin) {
    return reject('Invalid login')
  }
  elasticClient.search({
    index: 'dharmadict',
    type: 'users',
    body: {
      query: {
        match: {
          login: userLogin
        }
      }
    }
  }, (error, response, status) => {
    if (error) {
      logger.error(error)
      return reject('DB error')
    }
    const result = response.hits.hits[0]
    if (!result || !result._source) {
      return reject('No login found')
    }
    result._source.id = result._id
    return resolve(getUserInfo(result._source))
  })
})

let findAll = () => new Promise((resolve, reject) => {
  elasticClient.search({
    index: 'dharmadict',
    type: 'users',
    body: {}
  }, (error, response, status) => {
    if (error) {
      logger.error('Get all users error')
      return reject(error.message)
    }
    if (!response.hits.hits.length) {
      return reject(`Can't find all users.`)
    }
    let users = response.hits.hits.map(elem => {
      let cleanUserInfo = elem._source
      cleanUserInfo.id = elem._id
      return cleanUserInfo
    })
    logger.info('A users was found')
    return resolve(users)
  })
})

let create = newUser => new Promise((resolve, reject) => {
  // data validation
  if (!newUser) {
    return reject('Error in create user. Invalid data')
  }
  if (!newUser.id) {
    return reject('Error in create user. Invalid id')
  }
  if (!newUser.role) {
    return reject('Error in create user. Invalid role')
  }
  if (!newUser.roleId) {
    return reject('Error in create user. Invalid roleId')
  }
  if (!newUser.login) {
    return reject('Error in create user. Invalid login')
  }
  if (!newUser.name) {
    return reject('Error in create user. Invalid name')
  }
  if (!newUser.password) {
    return reject('Error in create user. Invalid password')
  }
  if (!newUser.description) {
    return reject('Error in create user. Invalid description')
  }
  newUser.hash = passwordHash.generate(newUser.password)
  let userId = newUser.id
  delete newUser.password
  delete newUser.id

  elasticClient.index({
    index: 'dharmadict',
    type: 'users',
    id: userId,
    body: newUser
  }, (error, response, status) => {
    if (error) {
      logger.error('Create user error')
      return reject(error.message)
    }
    logger.info('User was successfully created');
    return resolve({
      success: true
    })
  })
})

let removeById = userId => new Promise((resolve, reject) => {
  if (!userId) {
    return reject('Error in delete user. Invalid id')
  }
  elasticClient.delete({
    index: 'dharmadict',
    type: 'users',
    id: userId
  }, (error, response, status) => {
    if (error) {
      logger.error('Delete user error')
      return reject(error.message)
    }
    logger.info('User was deleted')
    return resolve({
      success: true
    })
  })
})

let getUserInfo = user => ({
  id: user.id,
  name: user.name,
  login: user.login,
  role: user.role,
  roleId: user.roleId,
  description: user.description
})

module.exports = {
  getUserInfo: getUserInfo,
  findById: findById,
  findByLogin: findByLogin,
  findAll: findAll,
  create: create,
  removeById: removeById
}
