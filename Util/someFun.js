const fs = require('fs')

async function CreateAndWrite(path2, data) {
  fs.writeFile(`${__dirname}/..${path2}`, data, err => {
    if (err) throw err
  })
}

module.exports = { CreateAndWrite }