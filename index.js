const carousell = require('./carousell');
const messaging = require('./messaging');
const async = require('async');
const fs = require('fs');

const main = async () => {
    let usersConfig = fs.readFileSync('./config.json');
    userConfig = JSON.parse(usersConfig)
    const tokens = await carousell.getTokens();
    const searchCollection = []
    for (user of userConfig) {
        const chatId = user.chatId
        for (search of user.searchList) {
            const searchObject = search
            searchObject["chatId"] = chatId
            searchCollection.push(searchObject)
        }
    }

    async.forEach(searchCollection, async (search, callback) => {
        const chatId = search.chatId
        const listings = await carousell.getListings(tokens, chatId, search);
        if (listings.length > 0) {
            messaging.telegram(listings, chatId)
        }
    }).then(() => {
        console.log("All tasks complete!")
    }).catch((err) => {
        console.log(err)
    })
}

main()