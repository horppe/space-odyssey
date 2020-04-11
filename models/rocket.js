 const uuid = require('uuid').v4;

 class Rocket {
    constructor(name, worth = 1){
        this.id = uuid();
        this.name = name;
        this.worth = worth;
    }
}

module.exports = Rocket;