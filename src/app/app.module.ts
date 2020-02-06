import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
// import { Routes, RouterModule } from '@angular/router';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WethSearchComponent } from './weth-search/weth-search.component';
import { TabsComponent } from './tabs/tabs.component';
import { TabComponent } from './tabs/tab.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { TabModule } from 'angular-tabs-component';
 

@NgModule({
   declarations: [
      AppComponent,
      WethSearchComponent,
      TabsComponent,
      TabComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      FormsModule,
      HttpClientModule,
      ChartsModule,
      MatAutocompleteModule,
      //TabModule,
      NgbModule,
      BrowserAnimationsModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
