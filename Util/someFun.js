const fs = require('fs')
const Path = require('path')

function CreateAndWrite(path, data) {
  fs.writeFileSync(Path.join(__dirname, '/..', path), data)
}
function ReadFile(path) {
  fs.readFileSync(Path.join(__dirname, '/..', path))
}

module.exports = { CreateAndWrite, ReadFile }