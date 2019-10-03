const Jimp = require('jimp');

function JimpModule() {
    // For editImage, you simply need to pass the source file you want edited, 
    // the image you want to use for replacements, and the coordinates you want replaced
    this.editImage = function(sourceFilePath, replacePath, editCoords) {
        Jimp.read(replacePath, (err, ghostImage) => {
            Jimp.read(sourceFilePath, (err, finalImage) => {
                if (err) throw err;
                let myWidth = finalImage.bitmap.width;
                let myHeight = finalImage.bitmap.height;

                for (let i = 0; i < editCoords.length; i++) {
                    let newImgObj = ghostImage.resize(Math.round(editCoords[i].width * myWidth), Math.round(editCoords[i].height * myHeight));
                    finalImage.composite(newImgObj, Math.round(editCoords[i].left * myWidth), Math.round(editCoords[i].top * myHeight)) // put ghost face on                    
                }

                finalImage.write('./images/product-output.jpg'); // save, probably overwrite original sourceFilePath eventually
            });
        });
    }
}

module.exports = JimpModule;