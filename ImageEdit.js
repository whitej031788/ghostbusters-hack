const Jimp = require('jimp');

function JimpModule() {
    // For editImage, you simply need to pass the source file you want edited, 
    // the image you want to use for replacements, and the coordinates you want replaced
    this.editImage = function(sourceFilePath, replacePath, editCoords) {
        Jimp.read(replacePath, (err, ghostImage) => {
            Jimp.read(sourceFilePath, (err, finalImage) => {
                if (err) throw err;
                finalImage
                .composite(ghostImage, editCoords.xAxis, editCoords.yAxis) // put ghost face on
                .write('./images/new-image.jpg'); // save, probably overwrite original sourceFilePath eventually
            });
        });
    }
}

module.exports = JimpModule;