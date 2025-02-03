const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

let wait = async (delay) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, delay)
    })
}

let generatePuppeteerParameters = (obj) => {

    let response = {};
    response.deviceScaleFactor = typeof obj.devicePixelRatio != 'undefined' ? obj.devicePixelRatio : 1;
    response.width = obj.width;
    response.height = obj.height;
    response.url = obj.url;

    return response;
}

let main = async (obj) => {
    let browser;
    try {
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        });
        let page = await browser.newPage();
        await page.setViewport({
            width: obj.width,
            height: obj.height,
            deviceScaleFactor: obj.deviceScaleFactor
        });
        await page.goto(obj.url, {
            waitUntil: ['load', 'networkidle0']
        });
        //await wait('500');
        let image = await page.screenshot({
            quality: 85,
            type: 'jpeg',
            encoding: 'base64'
        });
        await browser.close();
        let res = {
            image: image
        }
        return {
            statusCode: 200,
            isBase64Encoded: false,
            headers: {
                'Access-Control-Allow-Origin':'*'
            },
            body: JSON.stringify(res)
        };
    } catch (e) {
        return {
            statusCode: 502,
            isBase64Encoded: false,
            headers: {
                'Access-Control-Allow-Origin':'*'
            },
            body: JSON.stringify({message: e})
        }
    }
}



module.exports.handler = async (event) => {
    let body = JSON.parse(event.body);

    if (typeof body.url == 'undefined' || typeof body.width == 'undefined'  || typeof body.height == 'undefined') {
        return {
            statusCode: 501,
            isBase64Encoded: false,
            headers: {
                'Access-Control-Allow-Origin':'*'
            },
            body: JSON.stringify({message: 'Missing parameters'})
        }
    }
    // to restrict usage to specific domain
    /*if (!body.url.includes('http://example.com')) {
        return {
            statusCode: 501,
            isBase64Encoded: false,
            headers: {
                'Access-Control-Allow-Origin':'*'
            },
            body: JSON.stringify({message: 'Wrong URL'})
        }
    }*/
  
    let pupObj;
    
    pupObj = generatePuppeteerParameters(body);

    return await main(pupObj);
}
