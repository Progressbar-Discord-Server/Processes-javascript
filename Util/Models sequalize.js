const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'database.sqlite'
})

const Ban = sequelize.define('ban', {
  userID:{
    type: Sequelize.NUMBER,
  },
  raison: {
    type: Sequelize.TEXT,
    defaultValue: "No raison provided"
  },
  Executor: Sequelize.STRING,
  type: {
    type: Sequelize.STRING,
  },
  ID: Sequelize.NUMBER
});