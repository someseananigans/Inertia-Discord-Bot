const Discord = require("discord.js")
const fetch = require("node-fetch")
const keepAlive = require('./server.js')

const Database = require("@replit/database")
const { prefix } = require('./config.json')
const fs = require('fs');
const db = new Database()

const client = new Discord.Client()
client.commands = new Discord.Collection()
client.cronJobs = new Discord.Collection()

const starterContracts = { "mindds": "0x1cda6ba9bbaeade9078a1cf60afccce0343261a2" }

// setting up contracts in database
db.get("contracts").then(contracts => {
  if (!contracts || contracts.length < 1) {
    db.set("contracts", starterContracts)
  }
})

// setting up responding status
db.get("respond").then(value => {
  if (value == null) {
    db.set("respond", true)
  }
})

// load all commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.name, command)
}

// load all cronJobs
const cronFiles = fs.readdirSync('./cronJobs').filter(file => file.endsWith('.js'))
for (const file of cronFiles) {
  const job = require(`./cronJobs/${file}`)
  client.cronJobs.set(job.name, job)
}


// interaction on start of bot
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`)
  client.cronJobs.forEach((value, key) => {
    setInterval(() => {
      let counter = 0
      db.get("contracts")
        .then(contracts => {
          let inter = setInterval(() => {
            if (counter < Object.keys(contracts).length) {
              value.execute(client, Object.values(contracts)[counter], Object.keys(contracts)[counter])
            }
            else {
              clearInterval(inter)
            }
            counter++
          }, 1000)
        })
    }, value.interval)
  })
})


// interaction triggered by message commands
client.on("message", async msg => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return

  const args = msg.content.toLowerCase().slice(prefix.length).trim().split(' ')
  const commandName = args.shift()
  // console.log(args, commandName)

  if (!client.commands.has(commandName)) return

  const command = client.commands.get(commandName)

  db.get("respond")
    .then(respond => {
      if (respond == false) {
        if (commandName == 'respond') {
          try {
            command.execute(msg, args, db)
          } catch (error) {
            console.error(error)
            msg.reply('there was an error trying to execute command!')
          }
        } else {
          console.log(commandName)
          return
        }
      } else {
        try {
          command.execute(msg, args, db)
        } catch (error) {
          console.error(error)
          msg.reply('there was an error trying to execute command!')
        }
      }
    })



})

keepAlive()

client.login(process.env.TOKEN)