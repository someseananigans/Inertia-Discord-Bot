const fetch = require('node-fetch')

const Discord = require('discord.js')

module.exports = {
  name: "commands",
  execute(msg, args, db) {
    const cmnds = [
      {
        "name": "commands",
        "expl": "returns all available bot commands",
        "ie": "!commands"
      },
      {
        "name": "watchlist",
        "expl": "returns contracts in watchlist",
        "ie": "!watchlist"
      },
      {
        "name": "watch",
        "expl": "add contracts by [token] to watchlist",
        "ie": "!watch 0x06012c8cf97bead5deae237070f9587f8e7a266d"
      },
      {
        "name": "asset",
        "expl": "returns asset details using [name] and [key]",
        "ie": "!asset cryptokitties 11"
      },
      // {
      //   "name": "respond",
      //   "expl": "turn on or off bot interactions",
      //   "ie": "!respond on"
      // },
    ]

    const embed = new Discord.MessageEmbed()
      .setColor('ffc0cb')
      .setTitle(`Command List`)
      .setDescription(`All commands are implemented with an exclemation mark **!**`)
      .setTimestamp()

    cmnds.map(command => {
      embed.addFields({ "name": `${command.name}`, "value": `- ${command.expl} \n${('`').toString()}${command.ie}${('`').toString()}` })
    })

    msg.channel.send(embed)
    // needs styling
  }
}