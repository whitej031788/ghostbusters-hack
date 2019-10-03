const request = require("request");

function HiBobModule() {
    // Jamie's HiBob API key
    this.apiKey = 'kUCLIv4NUUEZDMDvPZsqjhG1gGuI0nl5U71lCa0F';
    this.getAvatars = function(callback) {
        let options = { method: 'GET', url: 'https://api.hibob.com/v1/people', headers : {
            "Authorization" : this.apiKey
        }};

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            let responseBody = JSON.parse(body);
            let avatars = [];
            responseBody.employees.forEach(function(employee) {
                avatars.push(employee.about.avatar);
            });

            return callback(avatars);
        });
    }
}

module.exports = HiBobModule;