const HiBobModule = require('./Bob.js');
const RekogModule = require('./AwsRekog.js');
const JimpModule = require('./ImageEdit.js');

const HiBob = new HiBobModule();
const Rekog = new RekogModule();
const Jimp = new JimpModule();

const sourceImage = './images/IMG_9085.JPG';
const replacePath = './images/ghost.png';

HiBob.getAvatars(function(avatars) {
    let avatarCount = avatars.length;
    let allFoundFaces = [];
    let allNotFoundFaces = [];
    avatars.forEach(function(element, key, array) {
        setTimeout(function() {
            Rekog.comparePictures(element, sourceImage, avatarCount, function(data) {
                if (data.found.length > 0)
                    allFoundFaces = allFoundFaces.concat(data.found);
                if (data.notfound.length > 0)
                    allNotFoundFaces = allNotFoundFaces.concat(data.notfound);

                console.log(avatarCount);
                if (avatarCount == 0 && data.weAreDone) {
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
                    for (let i = allNotFoundFaces.length - 1; i >= 0; i--) {
                        for (let j = 0; j < allFoundFaces.length; j++) {
                            if (allNotFoundFaces[i] && (allNotFoundFaces[i].id === allFoundFaces[j].id)){
                                allNotFoundFaces.splice(i, 1);
                        }
                    }
                    }
                    console.log('My found faces, everyone else will get ghosted: ', allFoundFaces);

                    Jimp.editImage(sourceImage, replacePath, allNotFoundFaces);
                    return;
                } else {
                    avatarCount--;
                }
            })}, 1500);
    });
});
