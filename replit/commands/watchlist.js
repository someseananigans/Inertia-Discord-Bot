const fetch = require('node-fetch')

const Discord = require('discord.js')

module.exports = {
  name: "watchlist",
  execute(msg, args, db) {
    db.get("contracts")
      .then(contracts => {

        console.log(contracts)

        const embed = new Discord.MessageEmbed()
          .setColor('ffc0cb')
          .setTitle(`__Contract Watchlist__`)
          .setDescription(`Currently ${Object.keys(contracts).length} contracts in watchlist. \nUse watch command to add more to list.`)
          .setTimestamp()

        for (contract in contracts) {
          embed.addFields({ "name": `${contract.toUpperCase()}`, "value": contracts[contract] })
        }

        msg.channel.send(embed)

      })
      .catch(err => console.log(err))
  }
}