const Jimp = require('jimp');

function JimpModule() {
    // For editImage, you simply need to pass the source file you want edited, 
    // the image you want to use for replacements, and the coordinates you want replaced
    this.editImage = function(sourceFilePath, replacePath, editCoords) {
        Jimp.read(replacePath, (err, ghostImage) => {
            if (err) throw err;
            Jimp.read(sourceFilePath, (err, finalImage) => {
                if (err) throw err;
                try {
                    let myWidth = finalImage.bitmap.width;
                    let myHeight = finalImage.bitmap.height;

                    for (let i = 0; i < editCoords.length; i++) {
                        let newImgObj = ghostImage.resize(Math.round(editCoords[i].width * 1.35 * myWidth), Math.round(editCoords[i].height * 1.35 * myHeight));
                        finalImage.composite(newImgObj, Math.round(editCoords[i].left * 1.1 * myWidth), Math.round(editCoords[i].top * 1.1 * myHeight)); // put ghost face on                    
                    }
                    finalImage.write('./images/output.jpg'); // save, probably overwrite original sourceFilePath eventually
                } catch(error) {
                    console.error(error);
                }
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