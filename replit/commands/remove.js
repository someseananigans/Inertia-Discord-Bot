const Discord = require('discord.js')


module.exports = {
  name: "remove",
  execute(msg, args, db) {
    const getKeyByValue = (object, value) => {
      console.log(object, value)
      return Object.keys(object).find(key => object[key] === value)
    }

    db.get('contracts')
      .then(contracts => {
        if (!args.length) {
          return msg.channel.send(`Please provide collection you wish to remove ${JSON.stringify(contracts)}`)
        }

        if (contracts[args]) {
          console.log('ping')
          delete contracts[args]
          db.set('contracts', contracts)
          return msg.channel.send(`**${args[0]}** has been removed from the watchlsit`)
        }
        else {
          let position = getKeyByValue(contracts, args[0])
          delete contracts[position]
          db.set('contracts', contracts)
          return position ? msg.channel.send(`**${position}** has been removed from the watchlist`) : msg.channel.send(`**${args}** is not present in watchlist`)
        }
      })
      .catch(err => console.log(err))



    // db.get("contracts").then(contracts => {
    //   if (!contracts || contracts.length < 1) {
    //     db.set("contracts", starterContracts)
    //   }
    // })

  }
}
