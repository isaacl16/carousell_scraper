# Carousell-Scraper

This repo contains an application that scrapes carousell listings and messages the results on telegram using a telegram bot.

The application makes use of `Puppeteer` (Headless Chrome API Node Library) for retrieving tokens and cookies and `node-telegram-bot-api` (Telegram API Node Library)
to send messages to a user on Telegram.
## Requirements
---
* [Telegram bot created](https://telegram.me/BotFather)
* [NodeJS 16.x installed](https://nodejs.org/en/download/)
* [Chrome](https://www.google.com/chrome/?brand=BNSD&gclid=CjwKCAjwh4ObBhAzEiwAHzZYU_MDBMAH7kptpH0b1YhWMrSc62EH0Mcb_JxHxSjwCVSjVuLIPuVSqBoCa6EQAvD_BwE&gclsrc=aw.ds) or [Chromium](https://www.chromium.org/getting-involved/download-chromium/) installed

## Installation Instructions
---
1. Clone the repository:
```
git clone -b aws-lambda --single-branch git@github.com:isaacl16/carousell_scraper.git
```
2. Install the pacakages
```
npm install
```
3. Edit config.json
```
[
  {
    "chatId": "<Telegram Chat Id>",
    "searchList": [
      {
        "searchString": "<Search>",
        "priceRange": {
          "min": <Min Value>,
          "max": <Max Value>
        }
      },
    ]
  },
]
```
> To find out how get a Telegram chat id, click [here](https://www.alphr.com/find-chat-id-telegram/)

> The price range, min and max value are optional
4. Create a .env file and add in the Telegram bot token
```
TELEGRAM_BOT_TOKEN = '<Telegram Bot Token>'
```
5. Run the application
```
npm start
```

## Explanation
---
Carousell requires the use of a `csrf-token` and `cookies` when making HTTP requests. Making HTTP requests without them will result in  `HTTPS Error 403`. Thus, the work around is to use a `Puppeteer` to intercept requests when accessing their website to look for the `csrf-token` and `cookies`, and use them in future HTTP requests to Carousell.

## Addition 
---
Using crontab, the application can be scheduled to run on intervals. Follow this tutorial [here](https://www.geeksforgeeks.org/crontab-in-linux-with-examples/) for Linux or [here](https://stackoverflow.com/questions/7195503/setting-up-a-cron-job-in-windows) for windows.
