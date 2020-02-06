
import {
    Component,
    ContentChildren,
    QueryList,
    AfterContentInit,
    ViewChild,
    ComponentFactoryResolver,
    ViewContainerRef
  } from '@angular/core';
  
  import { TabComponent } from './tab.component';
  //import { DynamicTabsDirective } from './dynamic-tabs.directive';
  
  @Component({
    selector: 'tabs-holder',
    template: `
      <ul class="nav nav-tabs">
        <li *ngFor="let tab of tabs" (click)="selectTab(tab)" [class.active]="tab.active">
          <a>{{tab.title}}</a>
        </li>
      </ul>
      <div id="iconicon"></div>
      <ng-content></ng-content>
    `,
    styles: [
      `
      .tab-close {
        color: gray;
        text-align: right;
        cursor: pointer;
      }

      .funcIcon{
        float:right;
        margin-top: -4%;
      }
      #iconicon{
        float: right;
        margin-top: -4%
      }
      `
    ]
  })
  export class TabsComponent implements AfterContentInit {
    
    @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
    twitterText: string = "";
    //favoritesStarClicked: any;
    
    // contentChildren are set
    public ngAfterContentInit() {
      // get all active tabs
      let activeTabs = this.tabs.filter((tab)=>tab.active);
      
      // if there is no active tab set, activate the first
      if(activeTabs.length === 0) {
        this.selectTab(this.tabs.first);
      }
    }
    
    selectTab(tab: any){
      this.tabs.toArray().forEach(tab => tab.active = false);
      
      // activate the tab the user has clicked on.
      tab.active = true;
    }
  }
  