import {Component, Input, OnInit} from '@angular/core';
import {SingleTask} from '../singleTask';


@Component({
  selector: 'app-task-input',
  templateUrl: './task-input.component.html',
  styleUrls: ['./task-input.component.css']
})
export class TaskInputComponent implements OnInit {
  @Input() tasks: SingleTask[];

  private genARandomTask: () => {};
  private addRandomTask: () => {};
  private addBlankTask: () => {};
  private clearTasks: () => {};

  constructor() {
    console.log('Tasks in task niput', this.tasks);
  }

  ngOnInit() {
    console.log('Tasks in task niput init', this.tasks);

    const blankTask = {
      distribution : 'Normal',
      skew : 0,
      points : [0, 10],
      confidence: 1,
      title: 'Blank SingleTask',
      id : 0
    };

    this.genARandomTask = (): SingleTask => {
      const task = new SingleTask();

      task.randomize();

      return task;
    };

    this.addRandomTask = (): any => {
      this.tasks.push(this.genARandomTask() as SingleTask);
    };

    this.addBlankTask = (): any => {
      this.tasks.push(Object.create(blankTask));
    };

    this.clearTasks = (): any => {
      while (this.tasks.length) {
        this.tasks.pop();
      }
    };
  }

}
