const fs = require('node:fs')
const readline = require('readline');
const { basename } = require('path');

async function ProcessDOS(client) {
  const cmd = readline.createInterface(process.stdin, process.stdout);

  let drive = "S"
  let dir = ["\\"]
  let drvlabel = "SERVERS"
  let depth = 0
  let curServer = null
  let curC = null 
  let drvS = {}
  let drvC = {}
  let inRepl = false
  drvS.rootdirs = client.guilds.cache
  drvS.subdirs = null
  drvC.rootdirs = fs.readdirSync(`${__dirname}/../commands`);
  drvC.subdirs = null
  //console.log(paths)
  cmd.setPrompt(`${drive}:${dir.join("")}>`)
  cmd.prompt();

  cmd.on('line', async line => {
    if (inRepl) return
    switch (line.trim().split(" ")[0]) {
      case 'exit': {
        cmd.close()
        process.exit(0)
      }
      case 'eval': {
        try {
          console.log(eval(line.substring(4)))
        } catch (error) {
          console.error(error)
        }
        break
      }
      case 'help': case 'man': {
        console.log("Process DOS help")
        console.log("Commands:\n")
        console.log("eval <code>                                   Evaluates code")
        console.log("status <status> <activity> <description>      Changes the status of the bot")
        console.log("send <channel-id> <message>                   Sends a message on the specified channel")
        console.log("dir                                           Lists the current directory")
        console.log("type <file>                                   Show the contents of a file")
        console.log("cd [directory]                                Change directory")
        console.log("cls                                           Clears the screen")
        console.log("echo <text>                                   Displays text on the screen")
        console.log("help                                          Displays this help")
        console.log("exit                                          Terminates the bot and console")
        break
      }
      case 'status': {
        if (line.trim() == "status") { client.user.setActivity() }
        try {
          let status = line.split(" ")[1]
          let activity = line.split(" ")[2].toUpperCase()
          let description = line.split(" ").slice(3).join(" ")
          client.user.setActivity(description, { type: activity });
          client.user.setStatus(status);
        } catch (error) {
          console.log("Invalid status")
          console.error(error)
        }
        break
      }
      case 'dir': case 'ls': {
        console.log(`\n Volume in drive ${drive} is ${drvlabel}`)
        console.log(` Volume Serial Number is 298A-E8CC`)
        console.log(` Directory of ${drive}:${dir.join("")}\n`)
        switch (drive) {
          case 'S': {
            if (depth == 0) {
              drvS.rootdirs.forEach(i => {
                console.log(i.name.padEnd(20) + "<DIR>      ")
              })
            } else {
              drvS.subdirs = client.guilds.cache.get(`${curServer}`)
              drvS.subdirs.channels.cache.forEach(c => console.log(`${c.id} ${c.name.substring(0, 15).padEnd(16)} CHN`))
            }
          }
            break
          case 'C': {
            if (depth == 0) {
              drvC.rootdirs.forEach(i => {
                console.log(i.padEnd(20) + "<DIR>      ")
              })
            } else {
              drvC.subdirs = fs.readdirSync(`${__dirname}/../commands/${curC}`);
              drvC.subdirs.forEach(c => console.log(`${c.substring(0, 15).padEnd(16)} FILE`))
            }
          }
        }
        break
      }
      case 'cd': case 'cd..': {
        let newDir = line.split(" ").slice(1).join(" ")
        if (newDir == ".." || line.split(" ")[0] == "cd..") {
          if (depth == 0) break
          depth--
          dir.pop()
          curServer = null
          curC = null
          break
        }
        switch (drive) {
          case 'S': {
            if (drvS.rootdirs.find(i => i.name === newDir)) {
              dir.push(newDir)
              depth++
              curServer = client.guilds.cache.find(guild => guild.name === newDir).id
            } else {
              console.log("Invalid directory")
            }
            break
          }
          case 'C': {
            if (drvC.rootdirs.find(i => i === newDir)) {
              dir.push(newDir)
              depth++
              curC = newDir
            } else {
              console.log("Invalid directory")
            }
          }
        }
        break
      }
      case 'cls': {
        console.log('\033c');
        break
      }
      case 'send': {
        client.channels.cache.get(line.split(" ")[1]).send(line.split(" ").slice(2).join(" "))
        break
      }
      case 'echo': {
        console.log(line.split(" ").slice(1).join(""))
        break
      }
      case 'type': {
        let file = line.split(" ").slice(1).join(" ")
        if (!file) { console.log('Required parameter missing'); break }
        cmd.setPrompt(" ")
        switch (drive) {
          case 'S': {
            console.log('General failure reading drive S:')
            console.log('Abort, Retry, Fail?a')
            break
          }
          case 'C':
            fs.readFile(`${__dirname}/../commands/${curC}/${file.toLowerCase()}`, 'utf8', (err, data) => {
              if (err) { console.log(`File not found - ${file.toLowerCase()}`); return }
              console.log(data)

            })
        }
        console.log()
        break
      }
      case 'c:': case 'C:': {
        drive = 'C'
        drvlabel = 'COMMANDS'
        depth = 0
        dir = ["\\"]
        break
      }
      case 'S:': case 's:': {
        drive = 'S'
        drvlabel = 'SERVERS'
        depth = 0
        dir = ["\\"]
        break
      }
      case '': break
      default: console.log("Bad command or file name")
    }
    cmd.setPrompt(`${drive}:${dir.join("")}>`)
    cmd.prompt();
  })
  cmd.on("SIGINT", () => {
    cmd.prompt()
  });
};

module.exports = { ProcessDOS }