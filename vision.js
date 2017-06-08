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
// A
// The incoming JSON object does not contain a client_email field
/*const vision = require('@google-cloud/vision')({
  projectId: 'tweet-bot-1',
  credentials: process.env.VISION_KEYFILE_JSON,
  VISION_KEYFILE_JSON: process.env.VISION_KEYFILE_JSON
});*/

// B. WORKS!
// Which is it: credentials or VISION_KEYFILE_JSON?
const vision = require('@google-cloud/vision')({
  projectId: 'tweet-bot-1',
  credentials: JSON.parse(process.env.VISION_KEYFILE_JSON)
});
/*const vision = require('@google-cloud/vision')({
  projectId: 'tweet-bot-1',
  credentials: JSON.parse(process.env.VISION_KEYFILE_JSON),
  VISION_KEYFILE_JSON: JSON.parse(process.env.VISION_KEYFILE_JSON)
});*/
const o = JSON.parse(process.env.VISION_KEYFILE_JSON);
console.log('NEW o.client_email : ', o.client_email); // OK - can see this! 
// Could not load the default credentials
// So need to specify somewhere...
// const vision = require('@google-cloud/vision')({
//   projectId: 'tweet-bot-1'
// });
const promisify = require('es6-promisify');

const faceEmotions = (face) => ['joy', 'anger', 'sorrow', 'surprise'].filter(emotion => face[emotion]);

exports.getEmotions = (faces) => {
  const everyEmotion = faces.reduce((acc, curr) => [...acc,...faceEmotions(curr)], []);
  return Array.from(new Set(everyEmotion));
};

exports.detectFaces = promisify(vision.detectFaces, vision);
exports.detectLabels = promisify(vision.detectLabels, vision);


/*

A: and B:
using
VISION_KEYFILE_JSON :

'{"type":"service_account","project_id":"tweet-bot-1","private_key_id":"2f638f0c43231ab9b2f62b4ab6c5f184e1acfac0","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDUc2BjPdSwyjVm\naQesmooz3LpQQlDBj5vOx66DFywo8GV4Adao4Zo5A/Rcb7qjXKYR3yjqT6atMfUy\nfZWPFZ/BnVi/S3+49O+G5XWCl+fKN6SYqDNcR6mlGYyoAHgnDcqZzzrHnUGT05mL\nAENamNP4PCEoJi3PenibK4tmdVgX74PEtsLTx22Fzyi+icxBQyMRi8RgkcOKqcVD\nfBt6mapucwUJI5I/amQUr0BYUaAvEH2hrvdtXbhv2L/5ds33dfkzAtP6UYbA07TL\nbG9s380GM1gFzghWsqtIWeI6PRxPyB7fSn6C9INdDVsDFzNQZPspoDi9aCAof/qa\nFRpOUX3NAgMBAAECggEAQtV9CBtmcqtaOzplYKZJPeF9d0w1bX8JC/cDblf223Ys\n5aDmb8BxLOiSkhXQCB5YXBzxGS0viSLDOTwKtbWeyWD/j0ZoCr57L9u1qPyyvYnd\nrOyVI72jn7224w8qvVZ4WwS3QB63h5K0pebSSYj0fg4kfCXumWu0z1PWicf2i6iJ\n7Pr+uvIbDFqPHAXQo+Orz76HT5MSVXNz3aSrv+hvWmteOILtqlX3ci0YD+KNQbZH\nW76XbDKouaYn1/5lwbq5GQynp2Q0D3wpPwQQHiSVOsmdcJlPVVbw096RYvyz8WkW\nMRvm9voVMiopQDvUV/VmCVPchnb/yWqUUplhxi/PnQKBgQDurp7k9wm8JseUmueh\n5fkp4m5230p4HeqVQmdvLfG1nyXi3l1Jw0Q2a8LyfFXqoznZgJxdvvKYn8qGe54t\nbiLMriZUyEaThdJwLrqjgq2AqnLbExgzYnnnrHe8ZANtrNy398ydM+ze/mBTzucs\nB5y2sA3+aN0docVZc4VvsrBDKwKBgQDj3YXMIbG8RH/eQtaRsatzNmlRjTgF3vw8\n15bPYeyLUTkiXgRz2qJZtp/phK8+cJBvVQNpjk6nNzEvPuoGvRj6VSI4vb9c0/dp\njN8asp86OZ6i/a1zhctkxU0nXp/P9klXTmCWb6LaBTUZpojAsleFkWAwffJtayV+\nLqxR8aWm5wKBgBql6l2b6z1TgxLnXJcpyvDPNBAXjAPvKyKxAEVcdtEVTLCQrQ+w\nOmxtCZ3zHdCNmsba4hphWEqMBJuRL67Yzg/WHbd3iNGtrjoSLYpV67Mi1KH69se9\n5ehkzBV/gRZ8p0Pu6axfgMHA2tZgklTLIMcQzu8pnA5T4mnDSRGYfK9zAoGAYL+D\nuaJsxpUG/aW/WOjo9OgbW4bsTIHa8zJOVAst1hFMgu0MUux3lkPWLd4qUgaVLNAZ\nvM2xU4o5lefOkcHkQxW2jAT0pUNSfzxS1hEVTjF8y5ON+8jJDSZAlgC1NiVKCom6\ntOT9bjhbzWJKGhce1hVdk/lF33No3eSPQdOqE+0CgYEAu9lNdU7lyrqmO3R/dF1V\nz1FkUe5MWzIHnt7otuSR8hCgPA+HgwHjV4ZOi4Grul8MSek69gv9Vn78kfbjhXPk\nJAf/gFV+pmQW21DByfz4zxOYZo1utTAE3/QYtivY3XszNwlIVh1Nw7+9dc+BVZ1E\n9Kgn5veOW5zonJw+uduryWk=\n-----END PRIVATE KEY-----\n","client_email":"vision-tweeter@tweet-bot-1.iam.gserviceaccount.com","client_id":"109895844995568791545","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://accounts.google.com/o/oauth2/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/vision-tweeter%40tweet-bot-1.iam.gserviceaccount.com"}'


B:
{"type":"service_account","project_id":"tweet-bot-1","private_key_id":"2f638f0c43231ab9b2f62b4ab6c5f184e1acfac0","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDUc2BjPdSwyjVm\naQesmooz3LpQQlDBj5vOx66DFywo8GV4Adao4Zo5A/Rcb7qjXKYR3yjqT6atMfUy\nfZWPFZ/BnVi/S3+49O+G5XWCl+fKN6SYqDNcR6mlGYyoAHgnDcqZzzrHnUGT05mL\nAENamNP4PCEoJi3PenibK4tmdVgX74PEtsLTx22Fzyi+icxBQyMRi8RgkcOKqcVD\nfBt6mapucwUJI5I/amQUr0BYUaAvEH2hrvdtXbhv2L/5ds33dfkzAtP6UYbA07TL\nbG9s380GM1gFzghWsqtIWeI6PRxPyB7fSn6C9INdDVsDFzNQZPspoDi9aCAof/qa\nFRpOUX3NAgMBAAECggEAQtV9CBtmcqtaOzplYKZJPeF9d0w1bX8JC/cDblf223Ys\n5aDmb8BxLOiSkhXQCB5YXBzxGS0viSLDOTwKtbWeyWD/j0ZoCr57L9u1qPyyvYnd\nrOyVI72jn7224w8qvVZ4WwS3QB63h5K0pebSSYj0fg4kfCXumWu0z1PWicf2i6iJ\n7Pr+uvIbDFqPHAXQo+Orz76HT5MSVXNz3aSrv+hvWmteOILtqlX3ci0YD+KNQbZH\nW76XbDKouaYn1/5lwbq5GQynp2Q0D3wpPwQQHiSVOsmdcJlPVVbw096RYvyz8WkW\nMRvm9voVMiopQDvUV/VmCVPchnb/yWqUUplhxi/PnQKBgQDurp7k9wm8JseUmueh\n5fkp4m5230p4HeqVQmdvLfG1nyXi3l1Jw0Q2a8LyfFXqoznZgJxdvvKYn8qGe54t\nbiLMriZUyEaThdJwLrqjgq2AqnLbExgzYnnnrHe8ZANtrNy398ydM+ze/mBTzucs\nB5y2sA3+aN0docVZc4VvsrBDKwKBgQDj3YXMIbG8RH/eQtaRsatzNmlRjTgF3vw8\n15bPYeyLUTkiXgRz2qJZtp/phK8+cJBvVQNpjk6nNzEvPuoGvRj6VSI4vb9c0/dp\njN8asp86OZ6i/a1zhctkxU0nXp/P9klXTmCWb6LaBTUZpojAsleFkWAwffJtayV+\nLqxR8aWm5wKBgBql6l2b6z1TgxLnXJcpyvDPNBAXjAPvKyKxAEVcdtEVTLCQrQ+w\nOmxtCZ3zHdCNmsba4hphWEqMBJuRL67Yzg/WHbd3iNGtrjoSLYpV67Mi1KH69se9\n5ehkzBV/gRZ8p0Pu6axfgMHA2tZgklTLIMcQzu8pnA5T4mnDSRGYfK9zAoGAYL+D\nuaJsxpUG/aW/WOjo9OgbW4bsTIHa8zJOVAst1hFMgu0MUux3lkPWLd4qUgaVLNAZ\nvM2xU4o5lefOkcHkQxW2jAT0pUNSfzxS1hEVTjF8y5ON+8jJDSZAlgC1NiVKCom6\ntOT9bjhbzWJKGhce1hVdk/lF33No3eSPQdOqE+0CgYEAu9lNdU7lyrqmO3R/dF1V\nz1FkUe5MWzIHnt7otuSR8hCgPA+HgwHjV4ZOi4Grul8MSek69gv9Vn78kfbjhXPk\nJAf/gFV+pmQW21DByfz4zxOYZo1utTAE3/QYtivY3XszNwlIVh1Nw7+9dc+BVZ1E\n9Kgn5veOW5zonJw+uduryWk=\n-----END PRIVATE KEY-----\n","client_email":"vision-tweeter@tweet-bot-1.iam.gserviceaccount.com","client_id":"109895844995568791545","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://accounts.google.com/o/oauth2/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/vision-tweeter%40tweet-bot-1.iam.gserviceaccount.com"}
*/