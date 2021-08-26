const fetch = require('node-fetch')
const Discord = require('discord.js')
const { openseaAssetsUrl } = require('../config.json')

module.exports = {
  name: "asset",
  execute(msg, args, db) {
    let contractName = args[0]
    const search = args[1]
    const settings = {
      method: 'GET',
      headers: { "Content-Type": "application/json" }
    }

    db.get("contracts")
      .then(contracts => {
        if (!search) {
          return msg.channel.send(`No project name was provided. \nPlease use an existing contract name from the watch list. \n**Example:** *!asset cryptokitties 11*`)
        }
        let contract = contracts[contractName]

        if (!contract) {
          return msg.channel.send(`Contract (name: ${contractName}) not in watch list`)
        }

        const url = `${openseaAssetsUrl}/${contract}/${search}`

        fetch(url, settings)
          .then(res => {
            if (res.status == 404 || res.status == 400) {
              throw new Error("Asset Number doesn't exist")
            }
            if (res.status != 200) {
              throw new Error(`Couldn't retrieve metadata: ${res.statusText}`)
            }
            return res.json()
          })
          .then(metadata => {
            const currentPrice = `${metadata.orders[0].current_price / 1000000000000000000}`
            const lastPrice = `${metadata.last_sale.total_price / 1000000000000000000}`
            const traitCount = metadata['collection']['stats']['count']
            const traits = metadata.traits.map(trait => {
              return ({ "name": trait.trait_type, "value": `${trait.value} (${((trait.trait_count / traitCount) * 100).toFixed(2)}%)`, "inline": true })
            })

            const assetEmbed = new Discord.MessageEmbed()
              .setColor('#0099ff')
              .setTitle(`${metadata.name} [${metadata.token_id}]`)
              .setURL(metadata.permalink)
              .addFields({ "name": "Price (ETH)", "value": currentPrice })
              .addFields({ "name": "Last Transaction", "value": lastPrice })
              .addFields(traits)
              .setImage(metadata.image_preview_url)
              .setTimestamp()
            msg.channel.send(assetEmbed)
          })
          .catch(err => {
            msg.channel.send(err.message)
            console.log(err)
          })

      })
      .catch(err => console.log(err))
  }
}