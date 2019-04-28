import {Component, Input, OnInit, OnChanges} from '@angular/core';
declare var Sim: any;

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit, OnChanges {
  @Input() tasks: {}[];
  constructor() {
  }

  ngOnInit() {
    console.log.bind('Tasks in workspace', this.tasks)();
    setInterval(console.log.bind(this.tasks), 1000);
  }

  ngOnChanges() {
    console.log('Tasks Changed', this.tasks);
  }

  runSimulation(){

  }

}
