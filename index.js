const carousell = require('./carousell');
const messaging = require('./messaging');
const fs = require('fs');

const main = async () => {

    let usersConfig = fs.readFileSync('./config.json');
    userConfig = JSON.parse(usersConfig)
    const tokens = await carousell.getTokens();
    for (user of userConfig) {
        const chatId = user.chatId
        for (search of user.searchList) {
            const listings = await carousell.getListings(tokens, chatId, search);
            if (listings.length > 0)
                messaging.telegram(listings, chatId)
        }
    }

}

main()