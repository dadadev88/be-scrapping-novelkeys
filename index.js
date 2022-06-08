const { log } = require('console');
const path = require('path');
const puppeteer = require('puppeteer');
const { saveImageFromURL, saveFile } = require('./utils');



(async () => {

	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	try {
		const url = 'https://novelkeys.com/collections/keyboards';
		const collections = url.split('/').pop();
		await page.goto(url);
	
		const elementsToHandle = await page.$$('.nav-gradient .grid-view-item.product-card');
		
		const productsPromises = elementsToHandle.map(async (eh) => {
			const imgElement = await eh.$('img');
			const priceElement = await eh.$('.price__regular');
			const nameElement = await eh.$('.visually-hidden');
			const detailLinkElement = await eh.$('.grid-view-item__link');
			
			const imgURL = await page.evaluate(el => el.src, imgElement),
				name = await page.evaluate(el => el.innerText, nameElement),
				detailURL = await page.evaluate(el => el.href, detailLinkElement),
				price = await page.evaluate(el => el.innerText, priceElement);

			const imgPath = await saveImageFromURL(imgURL, name + '.jpg', collections);
			return {
				name,
				detailURL,
				price: price.includes('\n') ? price.split('\n')[0] : price,
				imgURL: imgURL.includes('?') ? imgURL.split('?')[0] : imgURL,
				imgPath
			};
		});

		const result = await Promise.all(productsPromises);
		
		saveFile(collections + '.json', JSON.stringify(result, null, 4))
		console.log('RESULT ========>', result);
		browser.close();
	} catch (error) {
		console.error('ERROR', error);
	}
})();