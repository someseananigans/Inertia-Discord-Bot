# Inertia-Discord-Bot

## Description
Inertia is discord bot for ERC721 NFT collections, all token metadata is currently retrieved through opensea's API.

## Interacting with Inertia
Users can interact with innertia using the following commands and features:

### User Commands
All commands start with and exclamation mark '!' followed by a corresponding keyword.

***!commands***

Returns all available commands

***!watchlist***


Returns contracts in the watchlist

***!watch [tokenId]***

Adds a contract to watch list. Contract must not already be in the watchlist with the correct [tokenId].

***!asset***

Retrieves asset details of a contract in a watchlist using the contracts [name] and [key]

![asset command example screenshot](https://i.imgur.com/xVqH0Wk.png)

### Automatic Posts
**Sales**

Inertia will look up sales events on OpenSea every 15 seconds for all contracts in the watchlist. All newly closed sales will be posted to the configured Discord channel.

![Sales bot example](https://i.imgur.com/xsDDqy8.png)

## Configuration

Configurations are done via environment variables:
| Env Var      | Description |
| ----------- | ----------- |
| TOKEN   | Discord bot token        |
| DISCORD_SALES_CHANNEL   | The discord channel id where sales events should be posted to, should look like a long number       |
| OPEN_SEA_API_KEY | Contact OpenSea to request an API key at https://docs.opensea.io/reference#request-an-api-key.  The bot will work without it, but heavy use may result in being blocked. |


# Deployment
## Locally
Clone repository and run:   
`npm install`

followed by

`npm start`

## Heroku
You can also deploy directly to Heroku in just a few minutes.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

If you use the free dynos in Heroku, they go to sleep every 30 minutes unless there's a request on the endpoint, you can set up a free cron job online to poll your app every 20 minutes or so to keep it alive. https://cron-job.org/

## Replit
Transfer contents of replit folder to your replit and run

Replit should know to install necessary packages. Below are packages needed in the case manual installation is needed.
- @replit/database
- discord.js
- express
- node-fetch

Using availale url when script is ran, you can continue to have bot running using [uptimerobot](https://uptimerobot.com/).

# Pending
## CronJobs (non-replit)
Currently sales event updates are only available for replit deployment. Eventually, this sales cronjob will be available for normal deployment