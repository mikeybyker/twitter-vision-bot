// silent dotenv...(no logs in heroku etc. for missing .env file)
(require('dotenv').config({ silent: process.env.NODE_ENV === 'production' }))
const bots = require('./bots');
const vision = require('./vision');
const { pixelate } = require('./face');
const { 
  compose, 
  truncate,
  getLabelStatus, 
  downloadImage
} = require('./utilities');

const bot = bots.init({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000
});

function filterTweet(tweet){  
  if(tweet.entities && tweet.entities.media){
    const url = tweet.entities.media[0].media_url;
    const { user:{screen_name}, id_str } = tweet;
    return { url, screen_name, id_str };
  }
  return {};
}

async function identify({url, screen_name, id_str:in_reply_to_status_id} = {}){
  if(!url){
    return;
  }
  const opts = {
    verbose: true
  };
  try {
    const labels = await vision.detectLabels(url, opts);
    const labelStatus = getLabelStatus(labels);
    const status = truncate(`@${screen_name} ${labelStatus}`);
    const response = await bots.statusUpdate({status, in_reply_to_status_id});
    if(response.data.errors && response.data.errors.length){
      throw new Error(response.data.errors[0].message);
    }
    console.log(`Yey - bot has tweeted ${status}`);
  } catch(error) {
    console.log('identify Error ::: ', error);
  }
}

async function pixelateFaces({url, screen_name, id_str:in_reply_to_status_id} = {}){
  if(!url){
    return;
  }

  try {
    const data = await downloadImage(url, null); // null for Buffer
    if(!data.body || data.statusCode !== 200){
      throw new Error(data ? data.statusMessage : 'Something bad...');
    }
    const faces = await vision.detectFaces(url);
    const base64data = await pixelate(data.body, faces);
    const status = truncate(`@${screen_name} Hate faces`);
    const tweet = await bots.postMedia({status, in_reply_to_status_id}, base64data);
    console.log('Complete: Replied to', in_reply_to_status_id);
  } catch(error) {
    console.log('pixelateFaces Error ::: ', error);
  }
  
}

const visionId = compose(identify, filterTweet);
const visionFace = compose(pixelateFaces, filterTweet);

// bots.monitor('@b_o_t_1', visionId); // Id what is in the image
bots.monitor('@b_o_t_1', visionFace); // blank out the faces. Urggh.
