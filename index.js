const carousell = require('./carousell');
const messaging = require('./messaging');
const fs = require('fs');

const main = async () => {

    let usersConfig = fs.readFileSync('./config.json', { flag: 'r' });
    userConfig = JSON.parse(usersConfig)
    const tokens = await carousell.getTokens();
    for (user of userConfig) {
        const chatId = user.chatId
        for (search of user.searchList) {
            console.log(chatId + " " + search.searchString);
            const listings = await carousell.getListings(tokens, chatId, search);
            console.log(listings)
            messaging.telegram(listings, chatId)
        }
    }

}

main()