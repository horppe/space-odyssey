const uuid = require('uuid').v4;

class Station {
    constructor(name, type, orbit){
        this.id = uuid();
        this.name = name;
        this.type = type;
        this.orbit = orbit;
    }
}

module.exports = Station;