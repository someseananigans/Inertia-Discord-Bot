const Discord = require('discord.js')


module.exports = {
  name: "remove",
  execute(msg, args, db) {

    const getKeyByValue = (object, value) => {
      return Object.keys(object).find(key => object[key] === value)
    }

    const settings = {
      method: 'DELETE',
      headers: { "Content-Type": "application/json" }
    },
      {
        method: 'DELETE',
        headers: { "Content-Type": "application/json" }
      }

    fetch('/api/watchlist', settings)
      .then(watchlist => {
        if (!args.length) {
          return msg.channel.send(`Please provide collection you wish to remove ${JSON.stringify(contracts)}`)
        }
        args = args.join(' ')
        if (watchlist[args]) {
          fetch(`/api/removeByName/${args}`, settings[0])
            .then(res => {
              return msg.channel.send(`**${args}** has been removed from the watchlist`)
            })
        }
        else {
          fetch(`/api/removeByKey/${args}`)
            .then(res => {
              let item = getKeyByValue(watchlist, args)
              return msg.channel.send(`**${item}** has been removed from the watchlist`)
            })
        }
      })
      .catch(err => console.log(err))

  }
}
