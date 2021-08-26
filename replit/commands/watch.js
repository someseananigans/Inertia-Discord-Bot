const fetch = require('node-fetch')
const Discord = require('discord.js')
const { openseaContractsUrl } = require('../config.json')

module.exports = {
  name: "watch",
  execute(msg, args, db) {
    if (!args.length) {
      return msg.channel.send(`Invalid Token Entered. Unable to add to Contract Watch List`)
    }

    let url = `${openseaContractsUrl}/${args[0]}`

    const settings = {
      method: 'GET',
      headers: { "Content-Type": "application/json" }
    }

    fetch(url, settings)
      .then(res => {
        if (res.status == 404 || res.status == 400) {
          throw new Error("Token id doesn't exist")
        }
        if (res.status != 200) {
          throw new Error(`Couldn't retrieve metadata: ${res.statusText}`)
        }
        return res.json()
      })
      .then((metadata) => {
        return db.get("contracts")
          .then(contracts => {
            if (contracts[metadata.name.toLowerCase()]) {
              return msg.channel.send(`Token already added: ${metadata.name}`)
            } else {
              contracts[metadata.name.toLowerCase()] = args[0]
              db.set("contracts", contracts)
              return msg.channel.send(`**${metadata.name}** colelction added to watchlist`)
            }
          })
      })
      .catch(err => {
        console.log(err)
        msg.channel.send(err.message)
      })
  }
}