const rp = require('request-promise')
const cheerio = require('cheerio');

(async () => {
  const options = {
    url: 'https://play.google.com/store/apps/details?id=com.attofficeathand.android',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
      'Accept-Language': 'en-US',
      'Accept-Charset': 'iso-8859-1'
    }
  }

  const body = await rp(options)
  const $ = cheerio.load(body)
  console.log($('div.id-app-title').text().trim())
  console.log($('div[itemprop="datePublished"]').text().trim())
  console.log($('div[itemprop="softwareVersion"]').text().trim())
})()
