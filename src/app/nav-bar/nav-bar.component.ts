import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  @Output() onTabPicked: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }
  title = "Task Distribution";

  navtabs = ["Home", "Work"]

  onTabSelected = function(tab){
    this.selectedTab = tab;
    this.onTabPicked.emit(this.selectedTab);
  }
}
