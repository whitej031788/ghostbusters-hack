const HiBobModule = require('./Bob.js');
const RekogModule = require('./AwsRekog.js');
const JimpModule = require('./ImageEdit.js');

const HiBob = new HiBobModule();
const Rekog = new RekogModule();
const Jimp = new JimpModule();

HiBob.getAvatars(function(avatars) {
    let allCoordsToReplace = [];
    avatars.forEach(element => {
        Rekog.comparePictures(element, './images/IMG_9085.JPG', function(data) {
            allCoordsToReplace.push(data);
        });
    });

    allCoordsToReplace = allCoordsToReplace.filter((thing, index, self) =>
        index === self.findIndex((t) => (
            t.id === thing.id
        ))
    )

    console.log(allCoordsToReplace);
});
