const HiBobModule = require('./Bob.js');
const RekogModule = require('./AwsRekog.js');
const JimpModule = require('./ImageEdit.js');

const HiBob = new HiBobModule();
const Rekog = new RekogModule();
const Jimp = new JimpModule();

//const sourceImage = './images/legit_test.jpg';
const sourceImage = './images/IMG_9085.JPG';
const replacePath = './images/ed_long.png';

HiBob.getAvatars(function(avatars) {
    console.log('There are ' + avatars.length + ' active employees in HiBob.');
    console.log('Beginning face rekognition analysis...');
    let avatarsWeHaveScanned  = [];
    let allFoundFaces = [];
    let allNotFoundFaces = [];
    avatars.forEach(function(element, key, array) {
        if (!avatarsWeHaveScanned.includes(element)) {
            setTimeout(function() {
                Rekog.comparePictures(element, sourceImage, function(data) {
                    if (data.found.length > 0)
                        allFoundFaces = allFoundFaces.concat(data.found);
                    if (data.notfound.length > 0)
                        allNotFoundFaces = allNotFoundFaces.concat(data.notfound);

                    avatarsWeHaveScanned.push(element);
                    
                    if (avatarsWeHaveScanned.length == avatars.length) {
                        setTimeout(function() {
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
                                    if (allNotFoundFaces[i] && (allNotFoundFaces[i].id === allFoundFaces[j].id)) {
                                        allNotFoundFaces.splice(i, 1);
                                    }
                                }
                            }
                            console.log('We have found ' + allFoundFaces.length + ' Paddle employees in this picture; everyone else is getting GHOSTED! 👻👻👻');
                            //console.log(allNotFoundFaces);
                            Jimp.editImage(sourceImage, replacePath, allNotFoundFaces);
                            return;
                        }, 5000);
                    } else {
                        if (avatarsWeHaveScanned.length <= avatars.length)
                            console.log('Scanning HiBob avatar #: ', avatarsWeHaveScanned.length);
                    }
            })}, 500);
        }
    });
});
