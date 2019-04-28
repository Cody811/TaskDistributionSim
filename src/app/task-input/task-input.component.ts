import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-task-input',
  templateUrl: './task-input.component.html',
  styleUrls: ['./task-input.component.css']
})
export class TaskInputComponent implements OnInit {
  private genARandomTask: () => {};
  private addRandomTask: () => {};
  private addBlankTask: () => {};
  private clearTasks: () => {};
  private tasks: {}[];

  constructor() { }

  ngOnInit() {

    this.tasks = [];

    const blankTask = {
      distribution : 'Normal',
      skew : 0,
      points : [0, 10],
      confidence: 1,
      title: 'Blank Task',
      id : 0
    };

    this.genARandomTask = () => {

      let task = Object.create(blankTask);

      task.distribution = Math.random() > 0.5 ? 'Normal' : 'Binomial';
      task.skew = Math.round((Math.random() - 0.5) * 100) / 100 ;
      task.points = task.distribution === 'Normal' ? [1, 5] : [1, 5, 9, 12];
      task.confidence = Math.random();
      task.title = Math.random() > 0.5 ? 'Make app' : 'Do CSS';
      task.id = Math.floor(Math.random() * 10000);

      return task;
    };

    this.addRandomTask = () => {
      this.tasks.push(this.genARandomTask());
    };

    this.addBlankTask = () => {
      this.tasks.push(Object.create(blankTask));
    };

    this.clearTasks = () => {
      while(this.tasks.length)
        this.tasks.pop()
    }

    for (let i = 0; i < 10; i++) {
      this.addRandomTask();
    }
  }

}
