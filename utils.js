const fs = require('fs');
const https = require('https');

const saveImageFromURL = (url, filename, dir) => {
	const pathDir = 'images/' + dir;
	!fs.existsSync(pathDir) && fs.mkdirSync(pathDir)

	const filenamePath = `${pathDir}/${filename}`
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filenamePath))
                    .on('error', reject)
                    .once('close', () => resolve(filenamePath));
            } else {
                res.resume();
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
            }
        });
    });
}

const saveFile = (filepath, text) => {
	fs.writeFileSync(filepath, text, {encoding: 'utf-8'});
}

module.exports = {
	saveImageFromURL,
	saveFile
}