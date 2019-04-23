import {Component, Input, OnInit, AfterViewInit} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {Chart} from 'chart.js';
import {stringify} from 'querystring';

let nextId = 0;

class Distribution {
  constructor() {

    const self = this;

    self.distributions = [];

    /*
    * Naming convention
    * [type of distribution][type of output]
    *   Type Of Distribution
    *      Uniform - Roughly equal chance of any given output
    *      Normal  - A normal ditribution, more likely to be a middle value
    *   Type Of Return
    *       [Nothing] - (0, 1) float value
    *       Range     - A float between the min and max, passed through function
    *       Int       - An int between the min and Max, passed through function
    *
     */

    self.uniform = Math.random;

    self.uniformFloat = function(min, max) {
      return (self.uniform() * (max - min)) + min;
    };

    self.uniformInt = function(min, max) {
      return Math.floor(self.uniform() * (max - min) + min);
    };

    // (-Infinity, Infinity), but 99.99% of the time (-3.5, 3.5)
    self.normDevBoxMuller = function() {
      let u = 0, v = 0;
      while (u === 0) { u = Math.random(); } // Converting [0,1) to (0,1)
      while (v === 0) { v = Math.random(); }
      return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    };

    // Bounds standDev to Z = (-4, 4), containing 99.992% of results
    self.normDevLimited = function() {
      let result = self.normDevBoxMuller();
      while (result < -4 || result > 4) { result = self.normDevBoxMuller(); }
      return result;
    };

    // Bounds StandDev to (0, 1)
    self.normDev = function() {
      return (self.normDevLimited() + 4) / 8;
    };

    self.normInt = function(min, max) {
      return Math.floor(self.normDev() * (max - min) + min);
    };

    self.normFloat = function(min, max) {
      return (self.normDev() * (max - min)) + min;
    };

    self.skewNormDev = function(theta) {
      return theta < 0 ? (1 - self.skewNormDev(-theta)) : Math.pow(self.normDev(), theta);
    };

    self.skewNormInt = function(min, max, theta) {
      return Math.floor(self.skewNormDev(theta) * (max - min) + min);
    };


    self.addDistribution = function(distType, returnType, min, max, theta) {
      min = min || 0;
      max = max || 1;
      theta = theta || 1;
      const t = (distType + returnType).toLowerCase();
      switch (t) {
        case 'uniformint':
          self.distributions.push(self.uniformInt.bind({}, min, max));
          break;
        case 'uniformfloat':
          self.distributions.push(self.uniformFloat.bind({}, min, max));
          break;
        case 'normalint':
          self.distributions.push(self.normInt.bind({}, min, max));
          break;
        case 'normalfloat':
          self.distributions.push(self.normFloat.bind({}, min, max));
          break;
        case 'skewnormalint':
          self.distributions.push(self.skewNormInt.bind({}, min, max, theta));
          break;
        default:
          throw new Error('Invalid Distribution Type');
      }
    };

    self.addNestedDistrobution = function(distro) {
      self.distributions.push(distro.next);
    };

    self.next = function() {
      if (self.distributions.length === 0) { throw new Error('No distributions added'); }
      return self.distributions[self.uniformInt(0, self.distributions.length)]();
    };
  }
}

@Component({
  selector: 'app-task-module',
  templateUrl: './task-module.component.html',
  styleUrls: ['./task-module.component.css']
})
export class TaskModuleComponent implements OnInit, AfterViewInit {
  @Input() task: {};
  @Input() id = 'task-module-' + nextId++;

  constructor() { }

  ngOnInit() {
    console.log(this.task);
  }

  ngAfterViewInit() {
    const foundDist = [];
    const dist = new Distribution();
    if (this.task.distribution == 'Normal') {
      dist.addDistribution('skewnormal', 'int', 0, (this.task.points[1] - this.task.points[0]) * 100, this.task.skew);
    } else if (this.task.distribution == 'Binomial') {
      console.log('binomial');
      if (Math.abs(this.task.skew) > 0.01) {
        dist.addDistribution('skewnormal', 'int', 0, ((this.task.points[1] * 2) - (this.task.points[0] * 2)) * 100, this.task.skew);
        dist.addDistribution('skewnormal', 'int', ((this.task.points[2] * 2) - (this.task.points[3])) * 100, ((this.task.points[3]) - (this.task.points[0])) * 100, this.task.skew);
      } else {
        dist.addDistribution('normal', 'int', 0, ((this.task.points[1] * 2) - (this.task.points[0] * 2)) * 100);
        dist.addDistribution('normal', 'int', ((this.task.points[2] * 2) - (this.task.points[3])) * 100, ((this.task.points[3]) - (this.task.points[0])) * 100);
      }
    }

    for (let i = 0; i < 100000; i++) {
      const n = dist.next();
      foundDist['' + n]  = foundDist['' + n] ? foundDist['' + n] + 1 : 1;
    }




    const labels = [];
    for (let i = this.task.points[0] * 100; i < this.task.points[this.task.points.length - 1] * 100; i++) {
      labels.push('l' + i);
    }
    console.log('vals', foundDist);
    console.log('labels', labels);

    const ctx = document.getElementById('chart-' + this.id).childNodes[0];

    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Hours',
          data: foundDist,
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



  genLabel(points) {
    const label = [];
    for (const point in points) {
      label.push('l' + points[point]);
    }
    return label;
  }

}
