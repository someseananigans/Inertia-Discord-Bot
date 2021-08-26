const fetch = require('node-fetch')

const Discord = require('discord.js')
const { watch } = require('../models/Watch')

module.exports = {
  name: "watchlist",
  execute(msg, args) {
    const settings = {
      method: 'GET',
      headers: { "Content-Type": "application/json" }
    }

    fetch('http://localhost:3000/api/watchlist', settings)
      .then(response => response.json())
      .then(watchlist => {
        let fields = []
        for (const watch in watchlist) {
          fields.push({ name: watch.toUpperCase(), value: watchlist[watch] })
        }

        const embed = new Discord.MessageEmbed()
          .setColor('ffc0cb')
          .setTitle('__Contract Watchlist__')
          .setDescription(`Currently ${Object.keys(watchlist).length} contracts in watchlist. \nUse watch command to add more to list.`)
          .setTimestamp()
          .addFields(fields)

        msg.channel.send({ embeds: [embed] })
      })
      .catch(err => console.log(err))
  }
}