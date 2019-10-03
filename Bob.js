function HiBobModule() {
    this.apiKey = 'asdas';
    this.getAvatars = function() {
        console.log('hello world' + this.apiKey);    
    }
}

module.exports = HiBobModule;