const puppeteer = require('puppeteer')
const firebase = require('firebase');
const crypto = require('crypto')

var firebaseConfig = {
  // apiKey: "api-key",
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
  await page.goto(`https://www.express.co.uk/${process.argv[2]}`)
  let subheading = process.argv[2] == undefined ? "default" : `${process.argv[2].replace('/', '-')}`;
  let headlines = await page.$$eval("h4", elements=> elements.map(item=>item.textContent.trim()))
  headlines = [...new Set(headlines)]

  const fs = require('fs');
  let file = fs.createWriteStream('headlines.txt');
  headlines.forEach(async (value) => await file.write(`${value}\n`));
  file.end();
  
  for (const headline of headlines) {
    let hash = crypto.createHash('sha1')
    database.ref(`headlines/${subheading}`).child(hash.update(headline).digest('hex').toString()).set(headline);
  }
  await browser.close()
}

main()
