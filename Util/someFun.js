const fs = require('fs')
const Path = require('path')

function CreateAndWrite(path2, data) {
  fs.writeFile(Path.join(__dirname, '/..', path2), data, err => {
    if (err) throw err
  })
}

function ReadFile(path2) {
  fs.readFile(Path.join(__dirname, '/..', path2), err => {
    if (err) throw err
  })
}

module.exports = { CreateAndWrite, ReadFile }