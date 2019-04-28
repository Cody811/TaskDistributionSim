import {Component, Input, OnInit, AfterViewInit} from '@angular/core';
import {Distribution} from '../distribution';
import {Chart} from 'chart.js';
import {SingleTask} from '../singleTask';
import {faEdit} from '@fortawesome/free-solid-svg-icons';

let nextId = 0;

@Component({
  selector: 'app-task-module',
  templateUrl: './task-module.component.html',
  styleUrls: ['./task-module.component.css']
})
export class TaskModuleComponent implements OnInit, AfterViewInit {
  @Input() task: SingleTask;
  @Input() id = 'task-module-' + nextId++;

  faEdit = faEdit;
  inEditMode = false;

  constructor() { }

  ngOnInit() {
    console.log(this.task);
  }

  ngAfterViewInit() {
    this.drawChart();
  }

  drawChart() {
    const foundDist = [];
    const labels = [];
    const dist = new Distribution();

    if (this.task.distribution === 'Normal') {

      const difference = this.task.points[1] - this.task.points[0];
      const scaleFactor = (1 / this.task.confidence) - 1;
      const min = Math.floor((Math.max(this.task.points[0] - ((difference * scaleFactor) / 4), 0)) * 100);
      const max = Math.floor((this.task.points[1] + (difference * scaleFactor)) * 100);
      console.log('min', min, 'diff', difference, 'scalefactor', scaleFactor, 'max', (this.task.points[1]) * 100);

      dist.addDistribution('skewnormal',
        'int',
        min,
        max ,
        -(this.task.skew + 1));

      for (let i = 0; i < (max - min); i++) {
        foundDist[i] = 0;
      }
      for (let i = 0; i < 100000; i++) {
        const n = (dist.next() as number) - min;
        foundDist[n]  = foundDist[n] + 1;
      }
      foundDist[this.task.points[0]] = 1;
      foundDist[this.task.points[this.task.points.length - 1]] = 1;


      for (let i = min; i < max; i++) {
        const val = (i / 100);
        labels.push(this.toFixed(val, 2) + ' hrs');
      }

    } else if (this.task.distribution === 'Binomial') {
      if (true) {
        dist.addDistribution('skewnormal',
          'int',
          0,
          ((this.task.points[1] * 2) - (this.task.points[0] * 2)) * 100,
          -(1 + this.task.skew));
        dist.addDistribution('skewnormal',
          'int',
          ((this.task.points[2] * 2) - (this.task.points[3])) * 100,
          ((this.task.points[3]) - (this.task.points[0])) * 100,
          1 + this.task.skew);
      } else {
        dist.addDistribution('normal',
          'int',
          0,
          ((this.task.points[1] * 2) - (this.task.points[0] * 2)) * 100,
          0);
        dist.addDistribution('normal',
          'int',
          ((this.task.points[2] * 2) - (this.task.points[3])) * 100,
          ((this.task.points[3]) - (this.task.points[0])) * 100,
          0);
      }
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


    changeEditMode(); {
    this.inEditMode = !this.inEditMode;
    console.log(this.inEditMode);
  }

    genLabel(points); {
    const label = [];
    for (const point in points) {
      if (points.hasOwnProperty(point)) {
        label.push('l' + points[point]);
      }
    }
    return label;
  }

    skewChanged(event); {
    console.log(event);
    this.task.skew = event.value;
    this.drawChart();
  }

    confidenceChanged(event); {
    this.task.confidence = event.value;
    this.drawChart();
  }

    toFixed(value, precision); {
    const power = Math.pow(10, precision || 0);
    return String(Math.round(value * power) / power);
  }

}
