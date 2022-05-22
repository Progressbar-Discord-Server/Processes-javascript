const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'database.sqlite'
})

const Bans = sequelize.define('bans', {
  userID:{
    type: Sequelize.NUMBER,
  },
  reason: {
    type: Sequelize.TEXT,
    defaultValue: "No reason provided"
  },
  Executor: Sequelize.STRING,
  type: {
    type: Sequelize.STRING,
  },
  ID: Sequelize.NUMBER
});

const Warns = sequelize.define('warns', {
  userID:{
    type: Sequelize.NUMBER,
  },
  reason: {
    type: Sequelize.TEXT,
    defaultValue: "No reason provided"
  },
  Executor: Sequelize.STRING,
  ID: Sequelize.NUMBER
});

module.exports = { Bans, Warns }