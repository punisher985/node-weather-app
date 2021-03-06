var yargs = require("yargs");
const axios = require("axios");


const argv = yargs
    .options({
        a: {
            demand : true,
            alias : "address",
            describe : "Address to fetch weather for",
            string : true //tells yargs to always parse address as a string
        } 
    })
    .help()
    .alias("help", "h")
    .argv;
// ***************************************************************************** end yargs
var encodedAddress = encodeURIComponent(argv.address);
var geocodeUrl = `http://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;
axios.get(geocodeUrl).then((response)=>{
    //trhow error if status property is set to 0 results
    if(response.data.status==="ZERO_RESULTS"){
        //TO THROW ERROR  our promise can catch // to create error from result that we know is erronus but promise doesnt
        throw new Error("Unable to find that address.")
    }
    var lat = response.data.results[0].geometry.location.lat;
    var lon = response.data.results[0].geometry.location.lng;
    var weatherUrl = `https://api.darksky.net/forecast/c1c79c93374cb0e0b5e2439d84fd12f5/${lat},${lon}`;
    console.log(response.data.results[0].formatted_address);
    return axios.get(weatherUrl);

}).then((response)=>{ //chained call ****************************** see axios.get(weatherUrl) above
    // console.log(response)
    var temperature = response.data.currently.temperature;
    var apparentTemperature = response.data.currently.apparentTemperature;
    console.log(`It's currently ${temperature}, but it feels like  ${apparentTemperature}`)
}).catch((error) => {
    if(error.code==="ENOTFOUND"){
        console.log("unable to connect to api servers")
    }
    else {console.log(error.message)}
    // console.log(error)
}); 
//axios knows how to automatically parse json data
//what get returns is actually a promise -> we can use  .then to run some code when a promise is fulfilled or rejected
//success case: axios library recommends you calll it response
//add catch after try to catch all the errors  axios.get(url).then((response)=>{}).catch((error)=>{})

//TO THROW ERROR  our promise can catch // to create error from result that we know is erronus but promise doesnt
//throw new Error("error message here")
//console.log(error.message) to print error above, console should be in catch

//promise
// can chain multiple then and have one catch at the end   axios.get().then().then().then().catch() 
//one reason why people like promises over callbacks is instead of nesting, you chain // no crazy indentation