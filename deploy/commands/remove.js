const Discord = require('discord.js')
const fetch = require('node-fetch')


module.exports = {
  name: "remove",
  execute(msg, args, db) {

    const getKeyByValue = (object, value) => {
      return Object.keys(object).find(key => object[key] === value)
    }

    const settings = [
      {
        method: 'DELETE',
        headers: { "Content-Type": "application/json" }
      },
      {
        method: 'GET',
        headers: { "Content-Type": "application/json" }
      }
    ]

    fetch('http://localhost:3000/api/watchlist', settings[1])
      .then(response => response.json())
      .then(watchlist => {
        if (!args.length) {
          return msg.channel.send(`Please provide collection you wish to remove ${JSON.stringify(contracts)}`)
        }
        args = args.join(' ')
        if (watchlist[args]) {
          fetch(`http://localhost:3000/api/removeByName/${args}`, settings[0])
            .then(response => response.json())
            .then(res => {
              console.log(res)
              return msg.channel.send(`**${args}** has been removed from the watchlist`)
            })
        }
        else {
          fetch(`http://localhost:3000/api/removeByKey/${args}`, settings[0])
            .then(response => response.json())
            .then(res => {
              console.log(res)
              let item = getKeyByValue(watchlist, args)
              return item ? msg.channel.send(`**${item}** has been removed from the watchlist`) : msg.channel.send(`**${args}** is not present in watchlist`)
            })
        }
      })
      .catch(err => console.log(err))

  }
}
