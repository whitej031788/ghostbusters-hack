const HiBobModule = require('./Bob.js');
const RekogModule = require('./AwsRekog.js');
const JimpModule = require('./ImageEdit.js');

const HiBob = new HiBobModule();
const Rekog = new RekogModule();
const Jimp = new JimpModule();

const sourceImage = './images/IMG_9085.JPG';
const replacePath = './images/ghost.png';

HiBob.getAvatars(function(avatars) {
    let allFoundFaces = [];
    let allNotFoundFaces = [];
    avatars.forEach(function(element, key, array) {
        Rekog.comparePictures(element, sourceImage, function(data) {
            if (data.found.length > 0)
                allFoundFaces = allFoundFaces.concat(data.found);
            if (data.notfound.length > 0)
                allNotFoundFaces = allNotFoundFaces.concat(data.notfound);
            if (Object.is(array.length - 1, key)) {
                // Dedupe each of the found and notfound arrays of faces
                allNotFoundFaces = allNotFoundFaces.filter((thing, index) => {
                    return index === allNotFoundFaces.findIndex(obj => {
                        return JSON.stringify(obj) === JSON.stringify(thing);
                    });
                });
                allFoundFaces = allFoundFaces.filter((thing, index) => {
                    return index === allFoundFaces.findIndex(obj => {
                        return JSON.stringify(obj) === JSON.stringify(thing);
                    });
                });
                
                // Now we need to remove all instances of found faces from the unfound
                const uniqueArray = allNotFoundFaces.filter(function(element) {
                    return allFoundFaces.indexOf(element) === -1;
                });

                Jimp.editImage(sourceImage, replacePath, uniqueArray);
            }
        });
    });
});
