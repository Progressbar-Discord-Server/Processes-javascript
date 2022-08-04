const fs = require('fs')
const Path = require('path')

async function CreateAndWrite(path2, data) {
  fs.writeFile(Path.join(__dirname, '/..', path2), data, err => {
    if (err) throw err
  })
}

module.exports = { CreateAndWrite }