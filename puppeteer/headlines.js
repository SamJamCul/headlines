const puppeteer = require('puppeteer')

const main = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(`https://www.express.co.uk/${process.argv[2]}`)
  let headlines = await page.$$eval("h4", elements=> elements.map(item=>item.textContent.trim()))
  headlines = [...new Set(headlines)]
  const fs = require('fs');
  let file = fs.createWriteStream('headlines.txt');
  headlines.forEach(async (value) => await file.write(`${value}\n`));
  file.end();
  await browser.close()
}

main()
