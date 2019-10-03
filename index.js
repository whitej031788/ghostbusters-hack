const HiBobModule = require('./Bob.js');
const RekogModule = require('./AwsRekog.js');
const JimpModule = require('./ImageEdit.js');

const HiBob = new HiBobModule();
const Rekog = new RekogModule();
const Jimp = new JimpModule();

const sourceImage = './images/IMG_9085.JPG';
const replacePath = './images/ghost.png';

HiBob.getAvatars(function(avatars) {
    let allCoordsToReplace = [];
    avatars.forEach(function(element, key, array) {
        Rekog.comparePictures(element, sourceImage, function(data) {
            if (data.length > 0)
                allCoordsToReplace = allCoordsToReplace.concat(data);
            if (Object.is(array.length - 1, key)) {
                console.log('Before dedupe: ', JSON.stringify(allCoordsToReplace));
                const uniqueArray = allCoordsToReplace.filter((thing, index) => {
                    return index === allCoordsToReplace.findIndex(obj => {
                        return JSON.stringify(obj) === JSON.stringify(thing);
                    });
                });
                console.log('After dedupe: ', JSON.stringify(uniqueArray));
                Jimp.editImage(sourceImage, replacePath, uniqueArray);
            }
        });
    });
});
