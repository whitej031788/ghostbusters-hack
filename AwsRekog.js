const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-2'});

const rekognition = new AWS.Rekognition();
const request = require('request').defaults({ encoding: null });

const JimpModule = require('./ImageEdit.js');
const Jimp = new JimpModule();

var fs = require('fs');

function AwsRekogModule() {
    this.comparePictures = function(sourceImage, targetImage, topCallback) {
        this.buildAwsParams(sourceImage, targetImage, function(params) {
            let myParams = params;
            rekognition.compareFaces(myParams, function (err, data) {
                if (err) {
                    console.log("AWS Err: ", sourceImage);
                    topCallback([]);
                    //console.log(err, err.stack); // an error occurred
                } else {
                    let replacementCoords = [];
                    data.UnmatchedFaces.forEach(function(face) {
                        let tmpObj = {
                            id: (face.BoundingBox.Left.toFixed(5) * face.BoundingBox.Top.toFixed(5)) * 100,
                            width: face.BoundingBox.Width,
                            height: face.BoundingBox.Height,
                            left: face.BoundingBox.Left,
                            top: face.BoundingBox.Top
                        }
                        replacementCoords.push(tmpObj);
                    });

                    topCallback(replacementCoords);
                }
            });
        });
    }

    this.buildAwsParams = function(source, target, callback) {
        var self = this;
        request.get(source, function (err, res, body) {
            let retObj = {
                SourceImage: {
                    Bytes: body
                },
                TargetImage: {
                    Bytes: self.base64Encode(target)
                },
                SimilarityThreshold: '70'
            };

            callback(retObj);
        });
    }

    this.base64Encode = function(file) {
        var bitmap = fs.readFileSync(file);
        // convert binary data to base64 encoded string
        return new Buffer.from(bitmap);
    }
}

module.exports = AwsRekogModule;