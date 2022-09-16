const Sequelize = require('sequelize');
const { sqlPass } = require('../config.json')

const sequelize = new Sequelize('database', 'user', sqlPass, {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'database.sqlite'
})

const Star = sequelize.define('message', {
  messageId: {
    type: Sequelize.TEXT,
  },
  messageIdBot: {
    type: Sequelize.TEXT,
    defaultValue: null,
    unique: true,
  },
  emoji: {
    type: Sequelize.TEXT,
  }
})

const Cases = sequelize.define('cases', {
  userID: {
    type: Sequelize.NUMBER,
  },
  reason: {
    type: Sequelize.TEXT,
    defaultValue: "No reason provided",
  },
  Executor: {
    type: Sequelize.NUMBER,
  },
  type: {
    type: Sequelize.STRING,
  }
});

module.exports = { Cases, Star }