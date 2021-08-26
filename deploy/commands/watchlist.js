const fetch = require('node-fetch')

const Discord = require('discord.js')

module.exports = {
  name: "watchlist",
  execute(msg, args, db) {
    const settings = {
      method: 'GET',
      headers: { "Content-Type": "application/json" }
    }

    fetch('api/watchlist', settings)
      .then(watchlist => {
        const embed = new Discord.MessageEmbed()
          .setColor('ffc0cb')
          .setTitle(`__Contract Watchlist__`)
          .setDescription(`Currently ${Object.keys(watchlist).length} contracts in watchlist. \nUse watch command to add more to list.`)
          .setTimestamp()

        for (watch in watchlist) {
          embed.addFields({ "name": `${watch.toUpperCase()}`, "value": watchlist[watch] })
        }

        msg.channel.send(embed)
      })
      .catch(err => console.log(err))
  }
}