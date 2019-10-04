const Jimp = require('jimp');

function JimpModule() {
    // For editImage, you simply need to pass the source file you want edited, 
    // the image you want to use for replacements, and the coordinates you want replaced
    this.editImage = function(sourceFilePath, replacePath, editCoords) {
        Jimp.read(replacePath, (err, ghostImage) => {
            if (err) throw err;
            Jimp.read(sourceFilePath, (err, finalImage) => {
                if (err) throw err;
                let myWidth = finalImage.bitmap.width;
                let myHeight = finalImage.bitmap.height;

                for (let i = 0; i < editCoords.length; i++) {
                    let newImgObj = ghostImage.resize(Math.round(editCoords[i].width * myWidth) * 10, Math.round(editCoords[i].height * myHeight) * 10);
                    finalImage.composite(newImgObj, Math.round(editCoords[i].left * myWidth), Math.round(editCoords[i].top * myHeight)); // put ghost face on                    
                }

                finalImage.write(sourceFilePath); // save, probably overwrite original sourceFilePath eventually
            });
        });
    }

    this.makeAvatarSmaller = function(buffer) {
        Jimp.read(buffer)
        .then(image => {
            return image
            .resize(256, 256) // resize
            .quality(60) // set JPEG quality
        })
        .catch(err => {
            // Handle an exception.
        });
    }
}

module.exports = JimpModule;