const assert = require('assert');
const Rocket = require("./models/rocket");
const Station = require("./models/station");

const calculateFare = require('./index').calculateFare;



const testCalcalateFare = function(rocket, location, destination, expectedFare, profile){
  describe("Going from " + location.name +" to " + destination.name, function(){
    it('should return fare amount of ' + expectedFare, function(done) {
      
      calculateFare(destination, rocket, profile)
      .then(function(value){
        assert.equal(value, expectedFare)
        done();
      }).catch(function(err){
        done(err)
      })
    });
  });
}


describe('Testing calcalateFare function', function() {
  describe('Calling with mock data', function() {
  const location = new Station("Abuja", "Natural", "Earth");
  const destination = new Station("Moon", "Natural", "Earth");
  const rocket = new Rocket("Falcon 1");
  const expectedFare = 50;
  const profile = {
    wallet: 600,
    location
  };

  testCalcalateFare(rocket, location, destination, expectedFare, profile);

  });
});


describe('Testing calcalateFare function', function() {
  describe('Calling with mock data', function() {
  const location = new Station("Abuja", "Natural", "Earth");
  const destination = new Station("International Space Station", "Manmade", "Earth");
  const rocket = new Rocket("Falcon 2", 2);
  const expectedFare = 300;
  const profile = {
    wallet: 600,
    location
  };
  testCalcalateFare(rocket, location, destination, expectedFare, profile);

  });
});


describe('Testing calcalateFare function', function() {
  describe('Calling with mock data', function() {
  const location = new Station("Abuja", "Natural", "Earth");
  const destination = new Station("Spock", "Natural", "Mars");
  const rocket = new Rocket("Falcon 2", 2);
  const expectedFare = 500;
  const profile = {
    wallet: 600,
    location
  };

  testCalcalateFare(rocket, location, destination, expectedFare, profile);

  });
});


describe('Testing calcalateFare function', function() {
  describe('Calling with mock data', function() {
  const location = new Station("Spock", "Natural", "Mars");
  const destination = new Station("International Space Station", "Manmade", "Earth");
  const rocket = new Rocket("Falcon 2", 2);
  const expectedFare = 700;
  const profile = {
    wallet: 1000,
    location
  };

  testCalcalateFare(rocket, location, destination, expectedFare, profile);

  });
});

