const promisify = require('es6-promisify');
const fs = require('fs');
const request = require('request');
const truncate = require('truncate');

const requestPromise = promisify(request.get);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

const TWEET_MAX = 139; // 140 - 1 for the truncate symbol …
const SCORE_THRESHOLD = 90;

exports.downloadImage = (url, encoding = 'binary') => {
  const parameters = {
    url,
    encoding
  };
  return requestPromise(parameters);
};

const partialTruncate = (max) => {
  return (str) => {
    return truncate(str, max);
  }
};

const noLabel = () => `Can't say much about this image...`;

const getLabelStatus = (labels) => {
  if(!labels.length){
    return noLabel();
  }
  const ordered = labels.sort((a,b) => a.score < b.score);
  if(ordered[0].score < SCORE_THRESHOLD){
    return noLabel();
  }
  // console.log({ordered});
  return `Nice picture of a ${ordered[0].desc}!`;
};

exports.readFile = readFile;
exports.writeFile = writeFile;
exports.truncate = partialTruncate(TWEET_MAX);
exports.getLabelStatus = getLabelStatus;
exports.getFileExtension = (filename) => filename.split('.').pop();
exports.getFileName = (filename) => filename.split('/').pop();
exports.saveImage = (filename, fileData) => writeFile(filename, fileData, 'binary');
exports.compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));
