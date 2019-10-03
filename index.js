const HiBobModule = require('./Bob.js');
const JimpModule = require('./ImageEdit.js');

const HiBob = new HiBobModule();
const Jimp = new JimpModule();

HiBob.getAvatars(function(avatars) {
    let allAvatars = avatars;
    console.log(allAvatars);
    let coords = {xAxis: 775, yAxis: 1350};
    let srcImage = './images/test_img.jpg';
    let replacementImage = './images/ghost.png';
    Jimp.editImage(srcImage, replacementImage, coords);
});