'use strict'
const http = require('http'),
	cheerio  = require('cheerio')

let argv = require('optimist')
	.usage('Usage: $0 -l "San Diego, CA" -s "Lawyers"')
	.demand(['l','s'])
	.alias('l','location')
	.describe('l','city and state')
	.alias('s','search')
	.describe('s','search term')
	.argv

let locale = argv.l,
	search = argv.s

let url = "http://www.yellowpages.com/search?search_terms="
	+ encodeURIComponent(search) + "&geo_location_terms="
	+ encodeURIComponent(locale)

http.get(url,parse)

function parse(res) {
	if (res.statusCode !== 200) {
		return console.log(http.STATUS_CODES[res.statusCode])
	}
	let html = ''
	res.on('data',(chunk) => html+=chunk)
	res.on('end',() => scrapeData(html))
	res.on('error',(err) => console.log(err))
}

function scrapeData(html) {

	let $ = cheerio.load(html),
		organic = $('.organic'),
		listings = organic.children()

	listings.each((i,e) => {
		console.log($(e).find('.business-name').text())
	})

}
