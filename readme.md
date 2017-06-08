# Twitter Vision Bot

A Twitter bot that uses the Google Vision API to understand the content of an image. Machine learning in bot form. Not a useful bot, it has to be said.
There's 2 different functions of this bot; identification of what the image is of, and face detection.

### Identify Bot

This will wait for an image to be posted and attempt to identify what is in it.

### Pixelate Face Bot

This will wait for an image to be posted and attempt to find faces in the image. Any found will be pixelated and posted back in reply.

```javascript
bots.monitor(@someone/#something, visionId);
bots.monitor(@someone/#something, visionFace);
```

I'd suggest monitoring a user as Twitter does not like bots to go all rampant on them. It could get ugly. And a free heroku account might not last long if you monitor the twitter stream for @bieber

### Live
Monitoring [@b_o_t_1](https://twitter.com/b_o_t_1). Send it a picture of a face. It is only doing the pixelate trick at the moment. Being a bot is tiring work.

## Run Locally
```javascript
node index.js
```
## Requirements &amp; Setup
### Twitter Apps
Create an app at https://apps.twitter.com/
Go to **Keys and Access Tokens**
Note down:
 - Consumer Key (API Key)
 - Consumer Secret (API Secret)
 - Access Token
 - Access Token Secret
 
Copy to the file **.env.sample**, renaming it to **.env**
Double check .env is in .gitignore - you never want these keys in your repo.

### Google Vision API

[Before You Begin](https://cloud.google.com/vision/docs/before-you-begin)

Create a new project or select an existing one at [Google Developers Console](https://console.cloud.google.com)
In the **API Manager**:
  - Turn on the **Google Cloud Vision API**
  - Go to **Credentials** and create a new Service Account. Create and download a json key to authenticate your bot to Google. Keep it **really** safe, really private! Do not add it to github. Ever.

The usual way to use the json keyfile is to provide a path to this file:

```javascript
const vision = require('@google-cloud/vision')({
  projectId: 'your-bot',
  keyFilename: '/path/to/keyfile.json'
});
```
However, for the live version - at least when dealing with 3rd party servers like Heroku - that would mean adding the keyfile to the git repo and pushing to the server. Again - very bad.

The alternative way (which was a nightmare to figure out, thanks docs :-|) is instead to add another environment variable to **.env**. Name it **VISION_KEYFILE_JSON** and set the value to the contents of your keyfile.json. Remove whitespace, paste it in, with no surrounding quotes.

```javascript
CONSUMER_KEY=ABC123
CONSUMER_SECRET=DEF456
ACCESS_TOKEN=123ABC
ACCESS_TOKEN_SECRET=456DEF
VISION_KEYFILE_JSON={"type":"service_account","project_id":"your-bot","and_all":"the_rest_form_keyfile"}
```

You can then init google-cloud/vision with:

```javascript
let credentials;
try {
  credentials = JSON.parse(process.env.VISION_KEYFILE_JSON);
} catch(error) {
  throw error;
}

const vision = require('@google-cloud/vision')({
  projectId: 'your-bot',
  credentials
});
```

For the live version, remember to add all 5 environment variables. In Heroku, do that under **Settings > Config vars**.

You also want the bot running as a worker, not a web app. For Heroku: Add a Procfile, go to Resources and turn on that worker, and off the web app.