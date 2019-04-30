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
  sampledNTimes = 0;
  curSimRun = 0;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.drawChart();
  }

  drawChart() {
    const ctx = document.getElementById('chart-' + this.id).childNodes[0];

    const vals = this.runSimulation(this.tasks, ++this.curSimRun);
    const labels = [];
    this.sampledNTimes = 0;
    let max = 0;
    let min = 0;
    for (const task of this.tasks) {
      max += task.getActualMax() as number;
      min += task.getActualMin() as number;
    }
    max = Math.floor(max / 10);
    min = Math.floor(min / 10);
    for (let i = min; i < max; i++) {
      const val = (i / 10); //Divide by 10 instead of 100 because vals are in 6 minute increments (1/10 of hour)
      labels.push(this.toFixed(val, 2) + ' hrs');
    }
    console.log(labels);

    const results = [];
    for (let i = 0; i < (max - min); i++) {
      results[i] = 0;
    }

    if (this.chart === undefined) {
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Hours',
            data: results,
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
  };

  runSimulation(tasks, thisSimRun) {
    //This is all pretty trash, but it's not in budget to figure out 'this'  :(
    const self = this;
    var curSim =  new Promise(function(resolve, reject) {
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
            //console.log('Finished Using Resource At: ', this.time());
          }).setData(this.callbackData);
        }
      };

      let max = 0;
      let min = 0;
      for (const task of tasks) {
        max += task.getActualMax() as number;
        min += task.getActualMin() as number;
      }
      max = Math.floor(max / 10);
      min = Math.floor(min / 10);

      const results = [];
      for (let i = 0; i < (max - min); i++) {
        results[i] = 0;
      }

      // Run a single simulation, to be run on each frame to populate sim
      const runOnFrame = function(iterations) {
        // console.log("Params Found: ", a, b, c, d, e, f, this)
        // console.log("Building Sim");
        for (let i = 0; i < 10; i++) {
          const sim = new Sim();
          for (const task of tasks) {
            taskEvents.push(new Sim.Event(task.title));
          }

          for (const task of tasks) {
            curRunVals.push(Math.floor(task.actualDistro.next() / 10));
          }
          // console.log("Running With Vals: ", curRunVals)

          sim.addEntity(simTask as any);
          // console.log("Running sim");
          sim.simulate(100000);
          // console.log("Finish Time: ", sim.time());
          results[sim.time() - min]++;
        }
        if(iterations !== 0 && iterations % 200 === 0) {
          //Draw shart every 500 runs
          self.chart.data.datasets[0].data.length = 0; //force empty
          results.forEach(function(el){
            self.chart.data.datasets[0].data.push(el);
          })
          if(thisSimRun !== self.curSimRun){
            return;
          }
          self.chart.update();
          self.sampledNTimes = iterations;
        }
        // console.log(sim.time());
        if (iterations++ < 2000) {
          // console.log('Running');
          window.requestAnimationFrame(runOnFrame.bind(null, iterations));
        } else {
          console.log(results);
          resolve(results);
        }
      };
      window.requestAnimationFrame(runOnFrame.bind(null, 0));
    });
  }

  toFixed(value, precision) {
    const power = Math.pow(10, precision || 0);
    return String(Math.round(value * power) / power);
  }

}
