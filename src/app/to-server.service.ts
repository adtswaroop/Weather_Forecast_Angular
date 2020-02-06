import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import { TouchSequence } from 'selenium-webdriver';

@Injectable({
  providedIn: 'root'
})
export class ToServerService {
  private DataSource = new BehaviorSubject({});
  public data = this.DataSource.asObservable();
  public sealData = this.DataSource.asObservable();

  constructor(private http: HttpClient) { }

  public callGeocode(street, city, state)
  {
      console.log("Getting weather forecast...");
      if(!(street == ""))
      this.data = this.http.get("weatherforecastadtswrp.us-east-2.elasticbeanstalk.com /getGeoLocation/"+ encodeURIComponent(street) + "/" + encodeURIComponent(city) + "/" 
                               + encodeURIComponent(state));
      else
      this.data = this.http.get("weatherforecastadtswrp.us-east-2.elasticbeanstalk.com /getGeoLocation/street" + "/" + encodeURIComponent(city) + "/" 
                               + encodeURIComponent(state));
      return this.data;
  }

  public getStateImage(state)
  {
    state = "Seal of " +state;
    console.log("Getting state image...");
    this.sealData = this.http.get("weatherforecastadtswrp.us-east-2.elasticbeanstalk.com /getStateSeal/"+ encodeURIComponent(state));
    return this.sealData;
  }

  public getAutocomplete(city){
    this.data = this.http.get("weatherforecastadtswrp.us-east-2.elasticbeanstalk.com /autocomplete/"+city);
    return this.data;
  }

  public getModalDetails(lat, lng, date)
  { 
    this.data = this.http.get("weatherforecastadtswrp.us-east-2.elasticbeanstalk.com /modalDetails/"+lat+"/"+lng+"/"+date);
    return this.data;
  }

  public getFavWeather(lat, lon){
    this.data = this.http.get("weatherforecastadtswrp.us-east-2.elasticbeanstalk.com /getWeather/"+lat+"/"+lon);
    return this.data;
  }
}
