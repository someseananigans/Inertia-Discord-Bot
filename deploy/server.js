require('dotenv').config()
const express = require('express')
const app = express()
const PORT = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(require('./controllers'))

const { Client, Intents, Collection } = require('discord.js')
const fetch = require('node-fetch')
const { prefix } = require('./config.json')
const fs = require('fs')

const client = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGES] })
client.commands = new Collection()
client.cronJobs = new Collection()

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


client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`)
  client.cronJobs.forEach((value, key) => {
    setInterval(() => {
      let counter = 0
      db.get("contracts")
        .then(contracts => {
          let inter = setInterval(() => {
            if (counter < Object.keys(contracts).length) {
              value.execute(client, Object.keys(contracts)[counter])
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

client.on("message", async msg => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return

  const args = msg.content.toLowerCase().slice(prefix.length).trim().split(' ')
  const commandName = args.shift()

  if (!client.commands.has(commandName)) return

  const command = client.commands.get(commandName)

  // assumes that bot is always on respond mode

  try {
    command.execute(msg, args)
  } catch (error) {
    console.error(error)
    msg.reply('there was an error trying to execute command!')
  }

})



require('./db')
  .then(() => app.listen(process.env.PORT || PORT, () => {
    console.log(`Inertia Bot listening at http://localhost:${PORT}`)
  }))
  .catch(err => console.log(err))

client.login(process.env.TOKEN)
