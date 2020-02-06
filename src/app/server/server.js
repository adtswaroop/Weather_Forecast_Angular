const express = require('express');
const request = require('request-promise');
const cors = require('cors');
var path = require('path');
const app = express();


app.use(express.static(path.join(__dirname, 'dist/hw8-poc')))


var corOPtions = {
  origin: '*',
  optionsSuccessState : '200'
}

app.use(cors(corOPtions));
app.listen(8081, () => {
  console.log('Server started!')
});

app.get( '/', (req,res)=> res.send("Server is running!"));

app.route('/getGeoLocation/:street/:city/:state').get((req,res)=>{
  const options = {
    method: "GET",
    url: "https://maps.googleapis.com/maps/api/geocode/json?address="+ req.params['street'] + ",+"+ req.params['city']+",+"+req.params['state']+"&key=AIzaSyBrBr9aAaxmyFGIoSsXAY0giluT4TL5DrQ",
    json: true
  }

  request(options)
  .then(function(response){
    // res.send(response);
    let lati = response.results[0].geometry.location;

    const darkOptions = {
      method: "GET",
      url: "https://api.forecast.io/forecast/10d21b84c3e1da9fb0df0600d59e2440/"+ lati['lat'].toString() +"," + lati['lng'].toString() + "?exclude=",
      json: true
    }

    request(darkOptions)
    .then(function(response){
      res.send(response)
    }).catch(function (err) {
      res.send("Error")
      })
  }).catch(function (err) {
    res.send("Error")
    })
})

app.route('/getWeather/:lat/:lon').get((req, res)=>{
  const darkOptions = {
    method: "GET",
    url: "https://api.forecast.io/forecast/10d21b84c3e1da9fb0df0600d59e2440/"+ req.params['lat'].toString() +"," + req.params['lon'].toString() + "?exclude=",
    json: true
  }

  request(darkOptions).then(function(response){
      res.send(response)
  })
});

app.route('/modalDetails/:lat/:lng/:date').get((req,res)=>{
  const options = {
    method: "GET",
    url: "https://api.darksky.net/forecast/10d21b84c3e1da9fb0df0600d59e2440/"+req.params['lat'] + "," + req.params['lng'] + "," + req.params['date'],
    json: true
  }

  request(options)
  .then(function(response){
    res.send(response)
  })
});
 
app.route('/getCurrLocation/:lat/:lng').get((req,res)=>{
    let lati = req.params['lat']
    let longi = req.params['lng'];

    const darkOptions = {
      method: "GET",
      url: "https://api.forecast.io/forecast/10d21b84c3e1da9fb0df0600d59e2440/"+ lati.toString() +"," + longi.toString() + "?exclude=",
      json: true
    }

    request(darkOptions)
    .then(function(response){
      res.send(response)
    })
  });

app.route('/getStateSeal/:state').get((req, res)=>{
  const options = {
    method: "GET",
    url: "https://www.googleapis.com/customsearch/v1?q="+req.params['state']+"&cx=017340365001405824579:lssvxe9eo42&num=1&searchType=image&key=AIzaSyBrBr9aAaxmyFGIoSsXAY0giluT4TL5DrQ",
    json: true
  }

  request(options)
  .then(function(response){
    res.send(response)
  })
})

app.route('/autocomplete/:city').get((req,res)=>{
  var autocomplete_url_start="https://maps.googleapis.com/maps/api/place/autocomplete/json?input=";
  var input=req.params['city'];
  var autocomplete_url_end="&types=(cities)&language=en&key=AIzaSyBzGOyLCiDCGasxbaOwd2A9HS0RaUP6DNI";
  var autocomplete_url=autocomplete_url_start+input+autocomplete_url_end;
  
  
    const autocomplete_options = {
    method: 'GET',
    url: autocomplete_url,
    json: true
  }
  
  request(autocomplete_options)
    .then(function (response)
    {
  if(response.status==="ZERO_RESULTS")
  {
   res.send({Error:"error"});
  }
  else
  {
  res.send(response);
  }
  
  })
  .catch(function (err) {
  res.send("Error")
  })
  });
  

