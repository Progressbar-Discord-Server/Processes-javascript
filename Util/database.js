const Sequelize = require('sequelize');
const { sqlPass } = require('../config.json')

// Once the database system will be changed, even minor change, pls change the 'password' entry to sqlPass
const sequelize = new Sequelize('database', 'user', sqlPass, {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'database.sqlite'
})

const Star = sequelize.define('message', {
  messageId: {
    type: Sequelize.TEXT,
    unique: true,
  },
  messageIdBot: {
    type: Sequelize.TEXT,
    defaultValue: null,
    unique: true,
  },
  StaredItself: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  NumberStar: {
    type: Sequelize.NUMBER,
    defaultValue: 0,
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