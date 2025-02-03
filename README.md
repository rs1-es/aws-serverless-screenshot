# aws-serverless-screenshot
## Website screenshot API with AWS, Puppeteer, and Serverless Framework

Simple screenshot utility using Puppeteer on AWS Lambda, API Gateway with Serverless Framework.

## Steps

Prerequisites:
- Serverless Framework installed and configured with your AWS keys (tested with v3.38).
- Node.js (tested with v20.18)

1. Init a Node project:
  ```
npm init
  ```
2. Install `puppeteer-core`:
  ```
npm i puppeteer-core
  ```
3. Edit `serverless.yml` to add a project name, project tag and AWS region.
4. Add the appropriate `chrome-aws-lambda` layer based on your preferred AWS region (check <https://github.com/shelfio/chrome-aws-lambda-layer>):
  ```
# serverless.yml
layers:
      - arn:aws:lambda:eu-west-1:764866452798:layer:chrome-aws-lambda:50
  ```
5. Edit `takeScreenshot.js` if you need it.
6. Run `serverless deploy` to deploy the project on AWS. Copy the API endpoint.
7. After that, you can run `serverless deploy function --function takeScreenshot` wherever you update `takeScreenshot.js`.
8. API endpoint requires the following parameters (using a POST request):
 - url: the website URL.
 - width: desired width.
 - height: desired height.
 - (optional) devicePixelRatio: add your device 'devicePixelRatio' property (`window.devicePixelRatio`). [More info on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio). This property is used by Puppeteer with its 'deviceScaleFactor' property ([Info on Puppeteer](https://pptr.dev/api/puppeteer.viewport)).

  For example (using vanilla Javascript):
  ```
  let getScreenshot = async (url) => {
    let fetchRes = await fetch(API_ENDPOINT + '/screenshot', {
      method: 'POST',
      body: JSON.stringify({
        url: 'http://example.com',
        width: window.screen.width,
        height: window.screen.height
    });
    if (fetchRes.ok) {
      let obj = await fetchRes.json();
      let screenshotDiv = document.getElementById('screenshotDiv');
      let image = document.createElement('img');
      image.src = 'data:image/jpeg;base64,' + obj.image;
      let aImg = document.createElement('a');
      aImg.download = 'screenshot.jpg';
      aImg.href = image.src;
      aImg.appendChild(image);
      screenshotDiv.appendChild(aImg);
    }
  }
  ```

## Notes

- `wait` function is optional, use it if pages don't load completely before screenshot.
