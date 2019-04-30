import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {SingleTask} from '../singleTask';
import {Chart} from 'chart.js';
declare var Sim: any;

let nextId = 0;

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit, AfterViewInit {
  @Input() tasks: SingleTask[];
  @Input() id = 'report-module-' + nextId++;

  chart = undefined;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.drawChart();
  }

  drawChart() {
    const ctx = document.getElementById('chart-' + this.id).childNodes[0];

    const vals = this.runSimulation();

    if (this.chart !== undefined) {
      this.chart.destroy();
    }
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        label: ['one', 'two', 'three'],
        datasets: [{
          label: 'Hours',
          data: vals,
          borderWidth: 1,
          backgroundColor: '#84A9C0'
        }]
      },
      options: {
        responsive: false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: false
            }
          }]
        }
      }
    });
  }

  runSimulation(): number[] {
    const taskEvents = [];
    const employee = new Sim.Facility('Employee');
    const stats = new Sim.Population('Performmed Tasks');
    const curRunVals = [];
    const simTask = {
      start() {
        this.beginTask();
        if (curRunVals.length) {
          this.start();
        }
      },
      beginTask() {

        stats.enter(this.time());

        const timeForTask = curRunVals.pop();
        this.useFacility(employee, timeForTask).done(function() {
          stats.leave(this.callbackData, this.time());
          console.log("Finished Using Resource At: ", this.time())
        }).setData(this.callbackData);
      }
    };

    let max = 0;
    let min = 0;
    for (const task of this.tasks) {
      max += task.getActualMax() as number;
      min += task.getActualMin() as number;
    }

    const results = [];
    for (let i = 0; i < (max - min); i++) {
      results[i] = 0;
    }
    // Run a single simulation, to be run on each frame to populate sim
    const runOnFrame = function(tasks, iterations) {
      //console.log("Params Found: ", a, b, c, d, e, f, this)
      //console.log("Building Sim");
      for(var i = 0; i < 10; i++){
        const sim = new Sim();
        for (const task of tasks) {
          taskEvents.push(new Sim.Event(task.title));
        }

        for (const task of tasks) {
          curRunVals.push(task.actualDistro.next());
        }
        //console.log("Running With Vals: ", curRunVals)

        sim.addEntity(simTask as any);
        //console.log("Running sim");
        sim.simulate(100000);
        //console.log("Finish Time: ", sim.time());
        results[sim.time() - min]++;
      }
      //console.log(sim.time());
      if (iterations++ < 10000) {
        //console.log('Running');
        window.requestAnimationFrame(runOnFrame.bind(null, tasks, iterations));
      } else {
        console.log(results);
      }
    };
    window.requestAnimationFrame(runOnFrame.bind(null, this.tasks, 0));
    //console.log(results);
    console.log("stats", stats);
    return [1, 2, 3];
  }

}
