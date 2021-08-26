const fetch = require('node-fetch')

const Discord = require('discord.js')

module.exports = {
  name: "respond",
  execute(msg, args, db) {
    if (args[0] == 'true' || args[0] == 'on') {
      db.set('respond', true)
      msg.channel.send('Bot Responses On')
    } else {
      db.set('respond', false)
      msg.channel.send('Bot Responses Off')
    }

  }
}