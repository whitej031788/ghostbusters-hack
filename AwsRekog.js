const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-2'});

const rekognition = new AWS.Rekognition();
const request = require('request').defaults({ encoding: null });

const JimpModule = require('./ImageEdit.js');
const Jimp = new JimpModule();

var fs = require('fs');

function AwsRekogModule() {
    this.comparePictures = function(sourceImage, targetImage, avatarCount, topCallback) {
        this.buildAwsParams(sourceImage, targetImage, function(params) {
            let myParams = params;
            rekognition.compareFaces(myParams, function (err, data) {
                let retObj = {
                    found: [],
                    notfound: []
                };
                if (avatarCount == 0) {
                    retObj.weAreDone = true;
                } else {
                    retObj.weAreDone = false;
                }
                if (err) {
                    console.log("AWS Err: ", sourceImage);
                    topCallback(retObj);
                    //console.log(err, err.stack); // an error occurred
                } else {
                    data.UnmatchedFaces.forEach(function(face) {
                        let tmpObj = {
                            id: (face.BoundingBox.Left.toFixed(6) * face.BoundingBox.Top.toFixed(6)) * 100,
                            width: face.BoundingBox.Width,
                            height: face.BoundingBox.Height,
                            left: face.BoundingBox.Left,
                            top: face.BoundingBox.Top
                        }
                        retObj.notfound.push(tmpObj);
                    });

                    data.FaceMatches.forEach(function(face) {
                        let tmpObj = {
                            id: (face.Face.BoundingBox.Left.toFixed(6) * face.Face.BoundingBox.Top.toFixed(6)) * 100,
                            width: face.Face.BoundingBox.Width,
                            height: face.Face.BoundingBox.Height,
                            left: face.Face.BoundingBox.Left,
                            top: face.Face.BoundingBox.Top
                        }
                        retObj.found.push(tmpObj);
                    });

                    topCallback(retObj);
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