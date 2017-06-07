const Twit = require('twit');
const promisify = require('es6-promisify');

let post;
let get;
let bot;
exports.init = (options) => {
  bot = new Twit(options);
  get = promisify(bot.get, bot);
  post = promisify(bot.post, bot);
  return bot;
};

const tweet = (endPoint, options = {}) => post(endPoint, options);
const statusUpdate = (params) =>  tweet('statuses/update', params);

// track: what/who to track on the stream
exports.monitor = function(track, callback){

  if(!track){
    throw new Error(`Let's have something to monitor...`);
  }
  if(!callback){
    throw new Error(`You'll be needing a callback function to monitor a stream...`);
  }

  const stream = bot.stream('statuses/filter', {track});
  stream.on('connected', response => {
    console.log(`connected to stream...waiting to hear ${track}`);
  });
  
  stream.on('error', err => {
    console.log(err);
  });

  // Only want first hand (for now)
  stream.on('tweet', tweet => {    
    if(!tweet.in_reply_to_status_id)
    {
      console.log('tweet...');
      callback(tweet);
    }    
  }); 
}

// follow who on the stream...
exports.follow = function(follow, callback){
  if(!follow){
    throw new Error(`Let's have someone to follow...`);
  }
  if(!callback){
    throw new Error(`You'll be needing a callback funtion to follow someone in a stream...`);
  }

  const stream = bot.stream('statuses/filter', {follow}); // also when mentioned...
  stream.on('connected', response => {
    console.log(`connected to stream...waiting to hear from ${follow}`);
  });
  
  stream.on('error', err => {
    console.log(err);
  });

  stream.on('tweet', tweet => {
    // must be a way so only tweets *BY* this user come in...
    // until then...
    if(tweet.user.id === follow){
      console.log('incoming tweet...');
      callback(tweet);
    }    
  }); 
}

function upload(b64data){
  return post('media/upload', { media_data: b64data });
}

function meta(data, text = 'I hate face'){
  const media_id = data.media_id_string;
  const params = { media_id, alt_text: { text } };
  return post('media/metadata/create', params);
}

async function postMedia(options, b64data){
  try {
    // Upload the image to twitter
    const response = await upload(b64data);
    // Add the meta (?)
    const added = await meta(response.data);
    const media_ids = [response.data.media_id_string] ;
    const params = Object.assign({}, options, { media_ids });
    // Post
    return await statusUpdate(params);
  } catch (error) {
    throw error;
  }
}

exports.postMedia = postMedia;
exports.statusUpdate = statusUpdate;