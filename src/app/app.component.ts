import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  selectedTab = "Work";

  tabPicked = function(event){
    console.log(event);
    this.selectedTab = event;
  }
}
