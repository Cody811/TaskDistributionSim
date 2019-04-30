import { Component } from '@angular/core';
import {SingleTask} from "./singleTask";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  selectedTab = "Work";
  private Taskssss: SingleTask[];

  constructor() {
    this.Taskssss = [];
    var task = new SingleTask(undefined);
    task.randomize();
    this.Taskssss.push(task);
    task = new SingleTask(undefined);
    task.randomize();
    this.Taskssss.push(task);
    task = new SingleTask(undefined);
    task.randomize();
    this.Taskssss.push(task);
    task = new SingleTask(undefined);
    task.randomize();
    this.Taskssss.push(task);


  }

  tabPicked = function(event){
    this.selectedTab = event;
  }
}
