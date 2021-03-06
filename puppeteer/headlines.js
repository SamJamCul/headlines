require('dotenv').config()
const puppeteer = require('puppeteer')
const firebase = require('firebase');
const crypto = require('crypto')

var firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "headlines-fa045.firebaseapp.com",
  projectId: "headlines-fa045",
  databaseURL: "https://headlines-fa045.firebaseio.com",
  storageBucket: "headlines-fa045.appspot.com",
};

const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let hash = crypto.createHash('sha1')

const main = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  page.setDefaultNavigationTimeout(0)
  await page.goto(`https://www.express.co.uk/${process.env.URL_PATH}`)
  let subheading = process.env.URL_PATH == undefined ? "default" : `${process.env.URL_PATH.replace('/', '-')}`;
  console.log(subheading)
  let headlines = await page.$$eval("h4", elements=> elements.map(item=>item.textContent.trim()))
  headlines = [...new Set(headlines)]

  const fs = require('fs');
  let file = fs.createWriteStream('headlines.txt');
  headlines.forEach(async (value) => await file.write(`${value}\n`));
  file.end();
  let i = 0

  for (const headline of headlines) {
    let hash = crypto.createHash('sha1')
    console.log(`${i}/${headlines.length - 1}`, headline)
    i++
    await database.ref(`headlines/${subheading}`).child(hash.update(headline).digest('hex').toString()).set(headline);
  }
  process.exit()
}


main()
