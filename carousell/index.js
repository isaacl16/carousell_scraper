require('dotenv').config();
const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs')
const utils = require('../utils')

let searchSize = 5


exports.getTokens = async () => {
    let csrfToken = ""
    let cookie = ""
    const browser = await puppeteer.launch({
        headless: true,
        timeout: 20000,
        ignoreHTTPSErrors: true,
        slowMo: 0,
        args: [
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--disable-setuid-sandbox',
            '--no-first-run',
            '--no-sandbox',
            '--no-zygote',
            '--window-size=1280,720',
        ],
    });

    try {
        const page = await browser.newPage();

        await page.setViewport({ width: 1280, height: 720 });

        // Block images, videos, fonts from downloading
        await page.setRequestInterception(true);
        page.on('request', (interceptedRequest) => {
            const blockResources = ['stylesheet', 'image', 'media', 'font'];
            if (blockResources.includes(interceptedRequest.resourceType())) {
                interceptedRequest.abort();
            } else {
                if (interceptedRequest.headers()['csrf-token']) {
                    const headers = interceptedRequest.headers()
                    csrfToken = headers['csrf-token']
                    cookie = headers['cookie']
                }
                interceptedRequest.continue();
            }
        });
        await page.setUserAgent(
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36'
        );
        await page.goto('https://www.carousell.com/');

    } catch (err) {
        console.log(err.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }

    return {
        csrfToken: csrfToken,
        cookie: cookie,
    };
};

exports.getListings = async (tokens, chatId, search) => {
    const searchString = search.searchString
    const fileName = chatId + "_" + searchString + ".json"

    let filters = [{
        fieldName: "price",
    }]
    let prefill = {
        "prefill_sort_by": "3"
    }
    let jsonData = {}

    jsonData = utils.readData(fileName)
    // await fs.readFile(`./data/${fileName}`, (err, data) => {
    //     if (err) {
    //         console.log(fileName + ' not found')
    //     } else {
    //         jsonData = JSON.parse(data)
    //     }
    // });


    if (search.priceRange) {
        const min = search.priceRange.min ? search.priceRange.min : null
        const max = search.priceRange.max ? search.priceRange.max : null
        const rangedFloat = {}
        if (min) {
            rangedFloat['start'] = { value: min }
            prefill['prefill_price_start'] = min
        }
        if (max) {
            rangedFloat['end'] = { value: max }
            prefill['prefill_price_end'] = max
        }
        filters[0][rangedFloat] = rangedFloat
    }

    const options = {
        method: 'POST',
        url: 'https://www.carousell.sg/ds/filter/cf/4.0/search/',
        params: { _path: '/cf/4.0/search/' },
        headers: {
            'content-type': 'application/json',
            'csrf-token': tokens.csrfToken,
            'Cookie': tokens.cookie,
        },
        data: {
            bestMatchEnabled: true,
            canChangeKeyword: true,
            count: searchSize,
            countryCode: 'SG',
            countryId: '1880251',
            filters: filters,
            includeEducationBanner: true,
            includeSuggestions: true,
            locale: 'en',
            prefill: prefill,
            query: searchString,
            sortParam: {
                fieldName: '3'
            }
        }
    };


    return await axios.request(options).then((res) => {
        let data = res.data.data.results
        const processedListing = processListings(jsonData, data)
        utils.writeData(fileName, processedListing.updatedJsonData)
        return processedListing.result
    }).catch((err) => {
        console.error(err.message);
    });


}

const processListings = (jsonData, data) => {
    const updatedJsonData = jsonData
    const listings = data
    const result = []
    for (const listing of data) {
        const id = listing.listingCard.id
        const title = listing.listingCard.title
        if (!(id in jsonData)) {
            result.push({
                title: title,
                url: "https://www.carousell.sg/p/" + id
            })
            updatedJsonData[id] = 0
        }
    }
    return { result: result, updatedJsonData: updatedJsonData }
}