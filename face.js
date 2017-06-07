const jimp = require('jimp');
const PIXEL_SIZE = 20;

const getBounds = (faces) => {
  return faces
    .map(face => face.bounds.face)
    .map(bounds => {
      return {
        x: bounds[0].x,
        y: bounds[0].y,
        w: bounds[1].x - bounds[0].x,
        h: bounds[2].y - bounds[0].y,
      };
    });
};

async function getBuffer(image){
  return new Promise(function(resolve, reject) {
      image.getBuffer( image.getMIME(), (err, buffer) => {
        if(err){
          reject(err);
        }
        resolve(buffer.toString('base64'));
      });
  });
}

// If we have a saved image to work with...
async function pixelateSave(filename, faces = []){
  if(!filename){
    return;
  }
  try {
    const bounds = getBounds(faces);
    const image = await jimp.read(filename);
    bounds.forEach(face => image.pixelate( PIXEL_SIZE, face.x, face.y, face.w, face.h));
    const saved = await image.write(`images/pixelated_${filename}`);
    return await getBuffer(image);    
  } catch(error) {
    console.log('Error ::: ', error);
    throw error;
  }
  
}

// If we have image data to work with...
// This makes way more sense that multiple writes/reads
async function pixelate(data, faces = []){
  if(!data){
    return;
  }
  try {
    const bounds = getBounds(faces);
    const image = await jimp.read(data);
    bounds.forEach(face => image.pixelate( PIXEL_SIZE, face.x, face.y, face.w, face.h));
    // const saved = await image.write(whatever_name);
    return await getBuffer(image);    
  } catch(error) {
    console.log('Error ::: ', error);
    throw error;
  }
  
}

exports.pixelate = pixelate;
