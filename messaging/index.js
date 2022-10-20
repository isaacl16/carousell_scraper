const TelegramBot = require('node-telegram-bot-api')
const token = process.env.TELEGRAM_BOT_TOKEN


exports.telegram = (data, chatId) => {
    const urls = data
    const bot = new TelegramBot(token)
    for (const url of urls) {
        bot.sendMessage(chatId, url.title + '\n' + url.url).catch((err) => {
            console.log(err)
        })
    }
}