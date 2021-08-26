const fetch = require('node-fetch')
const Discord = require('discord.js')
const { openseaContractsUrl } = require('../config.json')

module.exports = {
  name: "watch",
  execute(msg, args) {
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
        return fetch('http://localhost:3000/api/watchlist', settings)
          .then(response => response.json())
          .then(watchlist => {
            if (watchlist[metadata.name.toLowerCase()]) {
              return msg.channel.send(`Token already added: ${metadata.name}`)
            } else {
              let data = {
                name: metadata.name.toLowerCase(),
                key: args[0]
              }
              fetch('http://localhost:3000/api/watch', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
              })
                .then(res => msg.channel.send(`**${metadata.name}** collection added to watchlist`))
                .catch(err => console.log(err))
            }
          })
      })
      .catch(err => {
        console.log(err)
        msg.channel.send(err.message)
      })
  }
}