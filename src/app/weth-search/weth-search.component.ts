import { Component, OnInit, getModuleFactory, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Address } from '../classes/Address';
import { ToServerService } from '../to-server.service';
import { WeatherCard } from '../classes/WeatherCard'
import { TouchSequence } from 'selenium-webdriver';
import * as CanvasJS from '../../assets/canvasjs.min.js';
import {NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { $ } from 'protractor';
import {ModalElement } from '../classes/ModalElement';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import { on } from 'cluster';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-weth-search',
  templateUrl: './weth-search.component.html',
  styleUrls: ['./weth-search.component.css']
})

export class WethSearchComponent implements OnInit {
  
  data:any = {};
  data2:any = {};
  sealResults: any = {};
  formSubumitted: boolean = false;
  hasError: boolean = false;
  progressBarShow: boolean = false;
  enableSubmit = false;

  addrInput = new Address();
  weatherCardObj = new WeatherCard();
  modalElement = new ModalElement();

  sectionShow: string = "results";
  autocompleteOptions: any[] =[];
  autocompleteJSON: any;

  stateCode: string;
  stateName: string;
  hourlyChartType : string = "Temperature";
  hourlyData: any = {};
  weeklyData: any = {};

  hourlyTemperature: number[]=[];
  hourlyPressure: number[]=[];
  hourlyOzone: number[]=[];
  hourlyHumidity: number[]=[];
  hourlyVisibility: number[]=[];
  hourlyWindSpeed: number[]=[];

  dailyTemperatureLows: number[]=[];
  dailyTemperatureHighs: number[]=[];
  dailyTime: number[]=[];
  dailyTempRange: number[][] = [];
  tempRange: number[] = [];
  dailyDateLabels: string[] = [];
  dailyDataPoints: Array<any> = [];

  favList: Array<any> = [];
  isThisFav: boolean = false;
  twitterText: string = "The current temperature at "
  favIcon: string = "black"
  hasCurrError: boolean = false;

  constructor(private serviceCall:ToServerService, private http: HttpClient) {
   }

  ngOnInit() {

  }

//-----AUTOCOMPLETE-------//
public autocompleteHelper()
{
  if(this.addrInput.city==="")
  {
    this.autocompleteOptions=[];
  }
  else{
    let arr:Array<String>=[];
    this.serviceCall.getAutocomplete(this.addrInput.city).subscribe(
      data=>{this.autocompleteJSON = data} ,
      err => (console.log(err)),
      () => {
        if(this.autocompleteJSON.hasOwnProperty("Error"))
        {
          this.autocompleteOptions = [];
        }
        else{
          for(let i = 0; i<5; i++)
          {
            arr.push(this.autocompleteJSON.predictions[i].structured_formatting.main_text);
          }
          this.autocompleteOptions = arr;
        }
      }
    );
  }

}

//----------------------------FORM VALIDATION-----------------// 
  checkStreet(obj){
    if(!obj.addrInput.street && (this.addrInput.currentLocationChecked != true))
      this.addrInput.isSetStreet = false;
    else 
      this.addrInput.isSetStreet = true;
      if(this.addrInput.isSetCity && this.addrInput.isSetState && this.addrInput.isSetStreet && this.addrInput.city && this.addrInput.state && this.addrInput.street)
      {
        if(this.addrInput.state != "nostate")
        this.enableSubmit = true;
      }
  }

  checkCity(obj){
    if(!obj.addrInput.city && (this.addrInput.currentLocationChecked != true))
    {
      this.addrInput.isSetCity = false;
    }
    else if(obj.addrInput.city){
      this.addrInput.isSetCity = true;
    }
    if(this.addrInput.isSetCity && this.addrInput.isSetState && this.addrInput.isSetStreet && this.addrInput.city && this.addrInput.state && this.addrInput.street)
    {
      if(this.addrInput.state != "nostate")
      this.enableSubmit = true;
    }
  }

  checkState(obj){
    if(((!obj.addrInput.state) || (obj.addrInput.state=="nostate")) && (this.addrInput.currentLocationChecked != true))
      this.addrInput.isSetState = false;
    else if(obj.addrInput.state)
    {
      this.addrInput.isSetState = true;
    }
   if(this.addrInput.isSetCity && this.addrInput.isSetState && this.addrInput.isSetStreet && this.addrInput.city && this.addrInput.state && this.addrInput.street)
    {
      if(this.addrInput.state != "nostate")
      this.enableSubmit = true;
    }
  }

  clearButton(){
    this.addrInput = new Address();
    this.weatherCardObj = new WeatherCard();
    this.modalElement = new ModalElement();
    this.formSubumitted = false;
    this.sectionShow='results';
    this.hasCurrError = false;
    this.hasError = false;
    this.progressBarShow = false;
    this. enableSubmit = false;
    this.isThisFav = false;
    let element : HTMLInputElement = document.getElementById("inpCurrLoc") as HTMLInputElement;
    element.checked = false;
  }

  //--------------CURRENT LOCATION CHECKED------------------//
  getCurrLocation()
  {
    let element : HTMLInputElement = document.getElementById("inpCurrLoc") as HTMLInputElement;
    if(element.checked)
    {
      this.addrInput.currentLocationChecked = true;
      this.addrInput.isSetCity = true;
      this.addrInput.isSetState = true;
      this.addrInput.isSetStreet = true;
      this.enableSubmit = true;
      console.log("Getting current location...");
      this.http.get("http://ip-api.com/json").subscribe(
      data => {this.data2 = data;},
      err => this.showCurrError(),
      () => this.initialiseAddress(this.data2)
    );
    }
    else
    {
     this.addrInput.city = "";
     this.addrInput.state = "nostate"; 
      this.addrInput.currentLocationChecked = false;
      this.enableSubmit = false;
    }
 }

 initialiseAddress(ipData){
   console.log()
  this.addrInput.city = ipData.city;
  this.addrInput.state = ipData.region + ":" + ipData.regionName;
  this.addrInput.street = "";
  console.log(this.addrInput.city)
  console.log(this.addrInput.state);
 }

  //--------------SERVICE CALL TO THE BACKEND---------------//
  progressBar(){
    console.log("Progress bar...")
    this.progressBarShow = true;
    let element: HTMLElement = document.getElementById('progressBarBar') as HTMLElement;
    setTimeout(function(){
      element.setAttribute("style" , "width:40%")
    }, 300)
    setTimeout(function(){
      element.setAttribute("style" , "width:80%")
    }, 400)
    setTimeout(function(){
      element.setAttribute("style" , "width:100%")
    }, 600)
    setTimeout( ()=>  { this.onSubmit()} , 800)
      
  }

  onSubmit(){
    this.progressBarShow = false;
    this.formSubumitted = true;
    this.sectionShow='results'
    console.log(this.addrInput.street);
    console.log(this.addrInput.city);
    console.log(this.addrInput.state);
    let stateinput = this.addrInput.state.trim().split(":");
    this.stateCode = stateinput[0];
    this.stateName = stateinput[1];

    this.serviceCall.callGeocode(this.addrInput.street, this.addrInput.city, this.stateCode).subscribe(
      data=>{this.data = data},
      err=> this.showError(),
      ()=> this.processData(this.data)
      );
    
    this.serviceCall.getStateImage(this.stateName).subscribe(
      data=>{this.sealResults = data},
      err=>this.showError(),
      ()=>this.setSealImage(this.sealResults)
    );
      
  }

  processData(dataInp)
  {
    console.log("Weather data from forecast API...")
    console.log(dataInp)
    this.addrInput.latitude = dataInp.latitude;
    this.addrInput.longitude = dataInp.longitude;
    this.weatherCardObj.crdTimezone = dataInp.timezone;
    this.weatherCardObj.crdTemperature = dataInp.currently.temperature;
    this.weatherCardObj.crdSummary = dataInp.currently.summary;
    this.weatherCardObj.crdHumidity = dataInp.currently.humidity;
    this.weatherCardObj.crdPressure = dataInp.currently.pressure;
    this.weatherCardObj.crdWindSpeed = dataInp.currently.windSpeed;
    this.weatherCardObj.crdVisibility = dataInp.currently.visibility;
    this.weatherCardObj.crdCloudCover = dataInp.currently.cloudCover;
    this.weatherCardObj.crdOzone = dataInp.currently.ozone;
    this.formSubumitted=true;
    this.hourlyData = dataInp.hourly.data;
    this.getHourlyData(this.hourlyData);
    this.weeklyData = dataInp.daily.data;
    this.getWeeklyData(this.weeklyData);
    this.twitterText += this.addrInput.city + " is " + this.weatherCardObj.crdTemperature + " F. The weather conditions are " + this.weatherCardObj.crdSummary + "#CSCI571WeatherSearch";
    this.twitterText = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(this.twitterText);
    let element: HTMLElement = document.getElementById('twitter') as HTMLElement;
    element.setAttribute("href" , this.twitterText)
    console.log("Twitter text is set...")
    this.favList = localStorage.getItem('favoriteCities') ? JSON.parse(localStorage.getItem('favoriteCities')) : [];  
    this.addrInput.currentLocationChecked = true;
    this.enableSubmit = false;
  }

  setSealImage(sealRes)
  {
    this.weatherCardObj.sealLink = sealRes.items[0].link;
    this.addrInput.sealLink = this.weatherCardObj.sealLink;
  }

  getHourlyData(hourData){
    this.hourlyTemperature = [];
    this.hourlyPressure = [];
    this.hourlyHumidity = [];
    this.hourlyOzone = [];
    this.hourlyVisibility = [];
    this.hourlyWindSpeed = [];

    for(let i=0; i<24; i++)
    {
        this.hourlyTemperature.push(hourData[i].temperature);
        this.hourlyPressure.push(hourData[i].pressure);
        this.hourlyHumidity.push(hourData[i].humidity);
        this.hourlyOzone.push(hourData[i].ozone);
        this.hourlyVisibility.push(hourData[i].visibility);
        this.hourlyWindSpeed.push(hourData[i].windSpeed);
    }
    console.log("Hourly Data populated....")
    this.updateHourlyChart();
  }

  getWeeklyData(weekData){
    this.dailyTemperatureHighs = [];
    this.dailyTemperatureLows = [];
    this.dailyDateLabels = [];
    this.dailyDataPoints = [];
    for(let i=0;i<7;i++)
    {
      this.dailyTemperatureHighs.push(weekData[i].temperatureHigh);
      this.dailyTemperatureLows.push(weekData[i].temperatureLow);
      this.dailyTime.push(weekData[i].time);
    }

    for(let j=0; j<7; j ++)
    {

      this.tempRange = [];
      this.tempRange.push(Math.ceil(this.dailyTemperatureLows[j]));
      this.tempRange.push(Math.ceil(this.dailyTemperatureHighs[j]));

      //date
      let tempDate: string = "";
      let date = new Date(this.dailyTime[j] * 1000).getDate();
      let month = new Date(this.dailyTime[j] * 1000).getMonth() + 1; 
      let year = new Date(this.dailyTime[j] * 1000).getFullYear();
      tempDate = date.toString() + "/" + month.toString() + "/" + year.toString();
      this.dailyDateLabels.push(tempDate);

      //datapoint object
      let currentObj : object = {};
      currentObj = {
        "y" : this.tempRange,
        "label": tempDate
      }
      this.dailyDataPoints.push(currentObj);
    }
    console.log("Weekly Data populated....")
  }


/*----------Toggle between results and favorites------------------- */
toggleSection(from){
  if(from.toLowerCase() == 'results')
  {
    this.sectionShow = 'results';
  }
  else
  {
    this.sectionShow = 'favorites'
    this.loadFavorites();
  }
}

//-------------FAVORITES IMPLEMENTATION-----------//
favoritesStarClicked()
{
  this.loadFavorites();
  console.log("Inside the favoritesStar function. Printing localstorage...")
  console.log(this.favList);
  
  let foundResults: string = this.findFav(this.favList, this.addrInput.city, this.addrInput.state);
  console.log("Find results are.... " + foundResults);
  
  this.processFavorite(foundResults);
}

processFavorite(foundResults)
{
  let operations = foundResults.split("/");
  if(operations[0] == "found")
  {
    console.log("Favorite was found! Deleting...")
    this.toggleFavIcon("black");
    this.favList.splice(Number(operations[1]));
    localStorage.setItem("favoriteCities" , JSON.stringify(this.favList));
    console.log(JSON.parse(localStorage.getItem('favoriteCities')));
  }
  else
  {
    console.log("Favorite not present. Adding...")
    this.toggleFavIcon("gold");
    let addFav: object = {};
    addFav = {
      "city": this.addrInput.city,
      "state": this.stateName,
      "sealLink": this.addrInput.sealLink,
      "latitude": this.addrInput.latitude,
      "longitude": this.addrInput.longitude,
    }
    this.favList.push(addFav);
    localStorage.setItem("favoriteCities", JSON.stringify(this.favList));
  }
  
}

toggleFavIcon(color){
  switch(color){
    case "gold":
      this.favIcon = "gold"
      break;
    case "black":
      this.favIcon = "black"
      break;
  }
}

findFav(list, city, state) : string
{
  let result : string = "";
  let index: number= 0;
  for(let favListItem of list)
  {
    if(favListItem.city == city && favListItem.state == state)
    {
      result += "found/" + index;
      break;
    }
    index++;
  }
  if(result == "")
    result= "notfound/"
  return result;
}

loadFavorites(){
  console.log("Loading favorites...")
  this.favList = localStorage.getItem('favoriteCities') ? JSON.parse(localStorage.getItem('favoriteCities')) : [];  
}

deleteFavorite(city, state){
  console.log("Deleting fav..")
  let index = this.findFav(this.favList , city, state);
  console.log("Results from find..." + index);
  this.processFavorite(index);
}

fetchClickedCity(favCity){
  console.log("Generating weather card for...");
  this.toggleFavIcon("gold");
  console.log(favCity)
  this.sectionShow = 'results';
  this.addrInput.city = favCity.city;
  this.addrInput.state = favCity.state;
  this.addrInput.sealLink = favCity.sealLink;
  this.addrInput.latitude = favCity.latitude;
  this.addrInput.longitude = favCity.longitude;
  this.weatherCardObj.sealLink = this.addrInput.sealLink 
  this.serviceCall.getFavWeather(this.addrInput.latitude , this.addrInput.longitude).subscribe(
    data=>{this.data = data},
    err=> this.showError(),
    ()=> this.processData(this.data)
    );
}
/*----------Hourly Bar Chart Implementation-------------*/
public hourChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: "Time Difference from Current Hour"
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: "Farenheit"
        }
      }]
    }   
  };
  public hourChartLabels = ['0', '1', '2', '3', '4', '5', '6', '7' , '8' ,'9', '10', '11', '12', '13', '14', '15', '16' , '17', '18', '19' , '20', '21', '22', '23'];
  public hourChartType = 'bar';
  public hourChartLegend = true;
  public hourChartData = [{data: this.hourlyTemperature, label: 'Temperature', backgroundColor: "#a5d0ee"}];

  getYAxisLabel() : string{
    switch(this.hourlyChartType.toLowerCase())
    {
      case "temperaure":
          return "Farenheit"
      case "pressure":
          return "Milibars"
      case "humidity":
        return "% Humidity"
      case "visibility":
        return "Miles (Maximum 10)"
      case "ozone":
        return "Dobson units"
      case "wind speed":
          return "Miles per hour"
      default:
          return "Farenheit"
    }
  }

  updateHourlyChart()
  {
    let yaxisLbl = this.getYAxisLabel()
    console.log("Updating hourly chart..");
    this.hourChartLabels = ['0', '1', '2', '3', '4', '5', '6', '7' , '8' ,'9', '10', '11', '12', '13', '14', '15', '16' , '17', '18', '19' , '20', '21', '22', '23'];
    this.hourChartType = 'bar';
    this.hourChartLegend = true;
     
    this.hourChartOptions = {
      scaleShowVerticalLines: false,
      responsive: true,
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: "Time Difference from Current Hour"
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: yaxisLbl
          }
        }]
      }  
    };
    switch(this.hourlyChartType.toLowerCase())
    {
      case "temperaure":
          this.hourChartData = [{data: this.hourlyTemperature, label: 'Temperature', backgroundColor: "#a5d0ee"}];
          break;
      case "pressure":
           this.hourChartData = [{data: this.hourlyPressure, label: 'Pressure', backgroundColor: "#a5d0ee"}];
          break;
      case "humidity":
          this.hourChartData = [{data: this.hourlyHumidity, label: 'Humidity', backgroundColor: "#a5d0ee"}];
          break;
      case "visibility":
          this.hourChartData = [{data: this.hourlyVisibility, label: 'Visibility', backgroundColor: "#a5d0ee"}];
          break;
      case "ozone":
          this.hourChartData = [{data: this.hourlyOzone, label: 'Ozone', backgroundColor: "#a5d0ee"}];
          break;
      case "wind speed":
          this.hourChartData = [{data: this.hourlyWindSpeed, label: 'Wind Speed', backgroundColor: "#a5d0ee"}];
          break;
      default:
          this.hourChartData = [{data: this.hourlyTemperature, label: 'Temperature', backgroundColor: "#a5d0ee"}];
          break;
    }
  }

/*-----------WEEKLY BAR CHART IMPLEMENTATION----------------*/
getModal(index){
  console.log("Fething details for modal....");
  console.log(this.dailyDateLabels[index])
  this.modalElement.modalDate = this.dailyDateLabels[index];
  let forDate = this.dailyTime[index];
  this.serviceCall.getModalDetails(this.addrInput.latitude, this.addrInput.longitude, forDate).subscribe(
    data=>{this.data = data},
    err=> this.showError(),
    ()=> this.initialiseModal(this.data)
    );
}

initialiseModal(modalData){
  console.log("Got modal data. Initializing...");
  console.log(modalData);
  this.modalElement.modalCity = this.addrInput.city;
  this.modalElement.modalTemperature = modalData.currently.temperature;
  this.modalElement.modalSummary = modalData.currently.summary;
  this.modalElement.modalIconString = modalData.currently.icon;
  this.modalElement.modalPrecipitation = modalData.currently.precipIntensity;
  this.modalElement.modalChanceOfRain = modalData.currently.precipProbability;
  this.modalElement.modalWindSpeed = modalData.currently.windSpeed;
  this.modalElement.modalVisibility = modalData.currently.visibility;
  this.modalElement.modalHumidity = modalData.currently.humidity;
  switch(this.modalElement.modalIconString){
  case "clear-day":
    this.modalElement.modalIcon  = "https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png";
    break;
  case "clear-night":
    this.modalElement.modalIcon  = "https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png";
    break;
  case "rain":
    this.modalElement.modalIcon  = "https://cdn3.iconfinder.com/data/icons/weather-344/142/rain-512.png";
    break;
  case "snow":
    this.modalElement.modalIcon  = "https://cdn3.iconfinder.com/data/icons/weather-344/142/snow-512.png";
    break;
  case "sleet":
    this.modalElement.modalIcon  = "https://cdn3.iconfinder.com/data/icons/weather-344/142/lightning-512.png"
    break;
  case "wind":
    this.modalElement.modalIcon  = "https://cdn4.iconfinder.com/data/icons/the-weather-is-nice-today/64/weather_10-512.png";
    break;
  case "fog": 
    this.modalElement.modalIcon  = "https://cdn3.iconfinder.com/data/icons/weather-344/142/cloudy-512.png";
    break;
  case "cloudy":
    this.modalElement.modalIcon  = "https://cdn3.iconfinder.com/data/icons/weather-344/142/cloud-512.png"
    break;
  case "partly-cloudy-day":
    this.modalElement.modalIcon  = "https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png";
    break;
  case "partly-cloudy-night":
    this.modalElement.modalIcon  = "https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png";
    break;
  default:
    this.modalElement.modalIcon  = "https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png";
    break;
    }
    this.open();
}

open() {
  console.log("Open Modal...")
  let element: HTMLElement = document.getElementById('modalButton') as HTMLElement;
  element.click();
 
}


dailygraph(){
  console.log("Drawing weekly chart...");
  if(chart)
    chart.destroy();
  
  var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    title: {
      text: "Weekly Weather"
    },
    axisX: {
      title: "Days"
    },
    axisY: {
      includeZero: false,
      title: "Temperature in Farenheit",
      gridThickness: 0,
    }, 
    data: [{
      type: "rangeBar",
      color: "#a5d0ee",
      click: (e) => {
       console.log(e.dataPoint.label);
       this.getModal(e.dataPointIndex);
      },
      showInLegend: true,
      indexLabel: "{y[#index]}",
      legendText: "Day wise temperature range",
      toolTipContent: "<b>{label}</b>: {y[0]} to {y[1]}",
      dataPoints: this.dailyDataPoints
    }]
  });
  
  chart.render();
}


showError()
{
  this.hasError = true;
  this.sectionShow = 'results';
  this.formSubumitted = false;
  this.enableSubmit = false;
}

showCurrError(){
  this.hasCurrError = true;
  this.sectionShow = 'results';
  this.formSubumitted = false;
  this.enableSubmit = false;
}

//-------------TWITTER----------------------//

}

