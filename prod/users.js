  var passwordHash = require('password-hash');

  var Roles = [{
    id: 1,
    name: 'admin'
  }, {
    id: 2,
    name: 'user'
  }, {
    id: 3,
    name: 'translator'
  }];

  var getRoleId = function (token) {
    for(var i = 0; i < Roles.length; i++) {
      if(Roles[i].name === token) {
        return Roles[i].id;
      }
    }
    return null;
  };

  var Users = [{
    id: 1,
    role: 'admin',
    roleId: getRoleId('admin'),
    code: 'ADMIN',
    login: 'admin',
    name: 'Администратор',
    hash: passwordHash.generate('pass')
  }, {
    id: 2,
    role: 'user',
    roleId: getRoleId('user'),
    code: 'USER',
    login: 'user',
    name: 'Пользователь',
    hash: passwordHash.generate('password')
  }, {
    id: 3,
    role: 'translator',
    roleId: getRoleId('translator'),
    code: 'MK',
    login: 'mk',
    name: 'М.Н. Кожевникова',
    hash: passwordHash.generate('mkpass')
  }, {
    id: 4,
    role: 'translator',
    roleId: getRoleId('translator'),
    code: 'AKT',
    login: 'akt',
    name: 'А. Кугявичус - А.А. Терентьев',
    hash: passwordHash.generate('aktpass')
  }, {
    id: 5,
    role: 'translator',
    roleId: getRoleId('translator'),
    code: 'ZAG',
    login: 'zag',
    name: 'Б.И. Загуменнов',
    hash: passwordHash.generate('zagpass')
  }, {
    id: 6,
    role: 'translator',
    roleId: getRoleId('translator'),
    code: 'DON',
    login: 'don',
    name: 'А.М. Донец',
    hash: passwordHash.generate('donpass')
  }, {
    id: 7,
    role: 'translator',
    roleId: getRoleId('translator'),
    code: 'HOP',
    login: 'hop',
    name: 'J. Hopkins',
    hash: passwordHash.generate('hoppass')
  }, {
    id: 8,
    role: 'translator',
    roleId: getRoleId('translator'),
    code: 'BRZ',
    login: 'brz',
    name: 'A. Berzin',
    hash: passwordHash.generate('brzpass')
  }];

module.exports = {
  Users: Users,
  Roles: Roles
}
