const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'database.sqlite'
})

const Cases = sequelize.define('cases', {
  userID:{
    type: Sequelize.NUMBER,
  },
  reason: {
    type: Sequelize.TEXT,
    defaultValue: "No reason provided"
  },
  Executor: Sequelize.NUMBER,
  type: {
    type: Sequelize.STRING,
  }
});

module.exports = { Cases }