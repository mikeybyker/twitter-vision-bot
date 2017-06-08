/*const vision = require('@google-cloud/vision')({
  projectId: 'tweet-bot-1',
  keyFilename: './keyfile.json'
});*/
/*const vision = require('@google-cloud/vision')({
  projectId: 'tweet-bot-1',
  credentials: {
    private_key: process.env.PRIVATE_KEY,
    client_email: process.env.CLIENT_EMAIL
  }
});*/
// https://stackoverflow.com/questions/42937145/google-vision-api-authentication-on-heroku
const vision = require('@google-cloud/vision')({
  projectId: 'tweet-bot-1',
  credentials: process.env.VISION_KEYFILE_JSON,
  VISION_KEYFILE_JSON: process.env.VISION_KEYFILE_JSON
});
const promisify = require('es6-promisify');

const faceEmotions = (face) => ['joy', 'anger', 'sorrow', 'surprise'].filter(emotion => face[emotion]);

exports.getEmotions = (faces) => {
  const everyEmotion = faces.reduce((acc, curr) => [...acc,...faceEmotions(curr)], []);
  return Array.from(new Set(everyEmotion));
};

exports.detectFaces = promisify(vision.detectFaces, vision);
exports.detectLabels = promisify(vision.detectLabels, vision);
