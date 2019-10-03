const HiBobModule = require('./Bob.js');
const HiBob = new HiBobModule();

HiBob.getAvatars(function(avatars) {
    let allAvatars = avatars;
    console.log(allAvatars);
});