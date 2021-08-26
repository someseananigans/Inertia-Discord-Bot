const fetch = require('node-fetch')
const Discord = require('discord.js')
const { openseaEventsUrl } = require('../config.json')

let salesCashe = []
let lastTimeStamp = null

module.exports = {
  name: 'sales',
  description: 'sales bot',
  interval: 20000,

  async execute(client, contract) {
    if (lastTimeStamp == null) lastTimestamp = Math.floor(Date.now() / 1000) - 60
    let newTimeStamp = Math.floor(Date.now() / 1000) - 30

    let offset = 0
    let settings = {
      method: "GET",
      // headers: {
      //   "X-API-KEY": process.env.OPEN_SEA_API_KEY
      // }
    }


    while (1) {
      contract = contract.split(" ").join('-')
      let url = `${openseaEventsUrl}?collection_slug=${contract}&event_type=successful&only_opensea=false&offset=${offset}&limit=50&occurred_after=${lastTimestamp}&occurred_before=${newTimeStamp}`;
      try {
        let res = await fetch(url, settings)

        if (res.status != 200) {
          throw new Error(`Couldn't retrieve events: ${res.statusText}`)
        }

        if (res.status == 403) {
          throw new Error(`Couldn't retrieve events (forbidden): ${res.statusText}`)
        }

        data = await res.json()
        if (data.asset_events.length == 0) {
          console.log(`no events: ${contract}`)
          break
        }

        data.asset_events.forEach((event) => {
          if (event.asset) {
            if (salesCashe.includes(event.id)) {
              return
            } else {
              salesCashe.push(event.id)
              if (salesCashe.length > 20) salesCashe.shift()
            }

            const embedMsg = new Discord.MessageEmbed()
              .setColor('#0099ff')
              .setTitle(event.asset.name)
              .setURL(event.asset.permalink)
              .setDescription(`has just been sold for ${event.total_price / (1e18)}\u039E`)
              .setThumbnail(event.asset.image_url)
              .addFields({ "name": "From", "value": `[${event.seller.user ? event.seller.user.username : event.seller.address.slice(0, 8)}](https://etherscan.io/address/${event.seller.address})`, "inline": true })
              .addFields({ "name": "To", "value": `[${event.winner_account.user ? event.winner_account.user.username : event.winner_account.address.slice(0, 8)}](https://etherscan.io/address/${event.winner_account.address})`, "inline": true });

            client.channels.fetch(process.env.DISCORD_SALES_CHANNEL)
              .then(channel => {
                console.log('pong')
                channel.send(embedMsg)
              })
              .catch(console.error)
          }
        })
      }
      catch (error) {
        console.log(error)
      }

      offset += data.asset_events.length;
    }

    lastTimeStamp = newTimeStamp - 1
  }
}
