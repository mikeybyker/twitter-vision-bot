# Twitter Vision Bot

A twitter bot that uses the Google Vision API to understand the content of an image. Machine learning in bot form. Not a useful bot, it has to be said.
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

## Run
```javascript
node index.js
```

### Twitter Apps
Create an app at https://apps.twitter.com/
Go to **Keys and Access Tokens**
You want:
 - Consumer Key (API Key)
 - Consumer Secret (API Secret)
 - Access Token
 - Access Token Secret
 
Copy to the file **.env.sample**, renaming it to **.env**

### Google Vision API
https://cloud.google.com/vision/docs/before-you-begin

Create a new project or select an existing one at [Google Developers Console](https://console.cloud.google.com)
In the **API Manager**:
  - Turn on the **Google Cloud Vision API**
  - Go to **Credentials** and create a new Service Account. Create and download a json key to authenticate your bot to Google. Keep it **really** safe, really private! Do not add it to github. Ever.
