import { Component, OnInit, } from '@angular/core';
import {SingleTask} from "./singleTask";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  selectedTab = 'Work';
  private Taskssss: SingleTask[];

  constructor() {
    this.Taskssss = [];
    const task = new SingleTask();
    this.Taskssss.push(task);
  }

  ngOnInit() {

  }

  tabPicked = function(event) {
    console.log(event);
    this.selectedTab = event;
  };
}
