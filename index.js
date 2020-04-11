 const Rocket = require("./models/rocket");
 const Station = require("./models/station");
 const readlineSync = require('readline-sync');

 let profile = {
     wallet: 0.0,
     location: null, // User is at home
 };

 const inOrbitFare = 50;
 const outOrbitFare = 250;
 const royalty = 200;
 const stations = [
    new Station("Abuja", "Natural", "Earth"),
    new Station("Spock", "Natural", "Mars"),
    new Station("International Space Station", "Manmade", "Earth"),
    new Station("Moon", "Natural", "Earth"),
];

const rockets = [
    new Rocket("Falcon 1"),
    new Rocket("Falcon 2", 2) // Worth 2 times falcon1's value
];


function printBalance(){
    console.log("\nYour wallet balance is: " + profile.wallet + " BTC\n")
}

function viewLocation(){
    const location = profile.location;
    if(location == null)
        console.log("\nYou are at home :)\n");
    else 
        console.log("\nYou are in " + location.name + 
        "\nLocation Type: " + location.type + 
        "\nLocation Orbit: " + location.orbit);
}

const printMenu = function(){
    const response = readlineSync.question('\n"1" to view balance\n"2" to view your location\n"3" to Recharge balance\n"4" to take a trip\n"exit" or "q" to quit\n');

    if(response === "1"){
       printBalance();
       printMenu();
    } else if(response == "2"){
        viewLocation();
        printMenu();
    } else if(response == "3"){
        recharge();
        printMenu();
    } else if(response == "4") {
        takeTrip();
        // printMenu();
    } else if(response == "exit") {
        return process.exit();
    } else if(response == "q") {
        return process.exit();
    } else {
        console.log("\nInput not valid. Try again...\n");
        return printMenu();
    }
}

const recharge = function(){
    const amount = getAmount();
    profile.wallet += amount;
    console.log("\nRecharge was successful :)")
    printBalance();
}

const getAmount = function(){
   let rechargeAmount = readlineSync.question('How much BTC do you want to recharge? ');
    rechargeAmount = rechargeAmount.split(",").join("").split(" ").join("");
    const amount = parseFloat(rechargeAmount.trim());
    if(amount.toString() == 'NaN' || amount < 1){
        console.log("\nInvalid amount entered. Pleas enter a valid non negative floating point number e.g 200.0\n");
        return getAmount();
    } else if(amount > 50000){
        console.log("\nAmount can not be more than 50000 BTC. Don't be greedy :)\n");
        return getAmount();
    } else {
        return amount;
    }
}

const takeTrip = function() {
    if(profile.wallet < 50){
        console.log("\nWallet balance is not sufficient for a trip. Please recharge a minimum of 50 BTC");
        return printMenu();
    }

    console.log("\nPick a rocket to use: ");
    rockets.forEach(function(rocket, index){
        console.log("\"" + (index + 1) + "\" to use " + rocket.name)
    });

    const getRocket = function(){
       console.log("");
       const input = readlineSync.prompt();
        const index = parseFloat(input.trim());
        if(index.toString() == 'NaN' || index <= 0 || index > rockets.length){
            console.log("\nInvalid value entered. Try again...");
            return takeTrip();
        } 

        const rocket = rockets[index - 1];
        const actualFare = (inOrbitFare * rocket.worth);
        if(profile.wallet < actualFare){
            console.log("\nWallet balance is not sufficient for " + rocket.name + ". Please recharge a minimum of " + actualFare + " BTC to use" + rocket.name);
            return takeTrip(); 
        }
       
        return rocket;
    }

    const rocket = getRocket();
    if(!rocket) return;
    
    const getStation = function(){
        const curretStations = stations.filter(function(station){ 
            if(profile.location)
                return station.id !== profile.location.id;
            else
                return station.id !== "";
        });
        console.log("\nPick a destination: ");
        curretStations.forEach(function(station, index){
            console.log("\"" + (index + 1) + "\" to goto " + station.name)
        });
        const input = readlineSync.prompt();
        const index = parseFloat(input.trim());
        if(index.toString() == 'NaN' || index <= 0 || index > curretStations.length){
            console.log("\nInvalid value entered. Try again...");
            return getStation();
        }

        return curretStations[index - 1];
    }

    const station = getStation();
    // check location
    // calculate fare based on current location and destination
    // change current location

    calculateFare(station, rocket, profile)
    .then(function(fare){
        if(fare){
            profile.wallet -= fare;
            profile.location = Object.assign({}, station);
            console.log("Welcome to " + station.name);
            console.log("Your trip cost you a total of " + fare + " BTC. You balance is now: " + profile.wallet + " BTC");
        }
        printMenu()
    }).catch(function(err){
        printMenu();
    })
}

const calculateFare = function(station, rocket, profile){
   
    return new Promise(function(resolve, reject){
        
        let actualFare;
        if(profile.location == null) // First Trip
            actualFare = (station.orbit == "Earth" ? inOrbitFare : outOrbitFare) * rocket.worth;
        else // Subsequent trips
            actualFare = (station.orbit == profile.location.orbit  ? inOrbitFare : outOrbitFare) * rocket.worth;
        
        if(station.type == "Manmade"){
            actualFare += royalty;
        }
        
        if(profile.wallet < actualFare){
            console.log("\nWallet balance insufficient for this trip. This trip requires a minimum of " + actualFare + " BTC. \nPlease Recharge...");
            return reject(new Error("Wallet balance insufficient for this trip. This trip requires a minimum of " + actualFare + " BTC. \nPlease Recharge..."));
        }
        
        resolve(actualFare);
    });
        
}


 module.exports = {
    printMenu,
    calculateFare,
 };