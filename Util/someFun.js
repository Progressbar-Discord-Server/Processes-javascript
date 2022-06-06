const fs = require('fs')
const Path = require('path')

function CreateAndWrite(path2, data) {
  fs.writeFileSync(Path.join(__dirname, '/..', path2), data)
}
function ReadFile(path2) {
  fs.readFileSync(Path.join(__dirname, '/..', path2))
}

module.exports = { CreateAndWrite, ReadFile }