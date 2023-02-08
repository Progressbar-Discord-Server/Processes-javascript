const Sequelize = require('sequelize');
const { sqlPass } = require('../config.js')

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

const Cards = sequelize.define('cards', {
  userID: {
    type: Sequelize.TEXT,
    unique: true
  },
  Browns: {
    type: Sequelize.NUMBER,
    defaultValue: 0
  },
  Yellow: {
    type: Sequelize.NUMBER,
    defaultValue: 0
  },
  White: {
    type: Sequelize.NUMBER,
    defaultValue: 0
  },
  Orange: {
    type: Sequelize.NUMBER,
    defaultValue: 0
  },
  Red: {
    type: Sequelize.NUMBER,
    defaultValue: 0
  },
  Black: {
    type: Sequelize.NUMBER,
    defaultValue: 0
  }
})

const Mastodon = sequelize.define('mastodon', {
  MessageId: {
    type: Sequelize.TEXT,
    unique: true
  }
})

module.exports = { Cases, Star, Cards, Reddit, Mastodon }