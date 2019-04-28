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
  chart = undefined;

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


    if (this.task.distribution === 'Normal') {
      const min = this.task.getActualMin() as number;
      const max = this.task.getActualMax() as number;

      console.log("min", min, "max", max, "skew", this.task.skew);

      for (let i = 0; i < (max - min); i++) {
        foundDist[i] = 0;
      }
      this.task.refreshActualDistro();
      for (let i = 0; i < 100000; i++) {
        const n = (this.task.actualDistro.next() as number) - min;
        foundDist[n]  = foundDist[n] + 1;
      }
      foundDist[this.task.points[0]] = 1;
      foundDist[this.task.points[this.task.points.length - 1]] = 1;


      for (let i = min; i < max; i++) {
        const val = (i / 100);
        labels.push(this.toFixed(val, 2) + ' hrs');
      }

    } else if (this.task.distribution === 'Bimodal') {
      const min = this.task.getActualMin() as number;
      const max = this.task.getActualMax() as number;

      for (let i = 0; i < (max - min); i++) {
        foundDist[i] = 0;
      }
      this.task.refreshActualDistro();
      for (let i = 0; i < 100000; i++) {
        const n = (this.task.actualDistro.next() as number) - min;
        foundDist[n]  = foundDist[n] + 1;
      }
      foundDist[this.task.points[0]] = 1;
      foundDist[this.task.points[this.task.points.length - 1]] = 1;


      for (let i = min; i < max; i++) {
        const val = (i / 100);
        labels.push(this.toFixed(val, 2) + ' hrs');
      }
    }


    console.log('vals', foundDist);
    console.log('labels', labels);

    const ctx = document.getElementById('chart-' + this.id).childNodes[0];


    if(this.chart != undefined){
      this.chart.destroy();
    }
    this.chart = new Chart(ctx, {
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


  changeEditMode() {
    this.inEditMode = !this.inEditMode;
    console.log(this.inEditMode);
  }

  genLabel(points) {
    const label = [];
    for (const point in points) {
      if (points.hasOwnProperty(point)) {
        label.push('l' + points[point]);
      }
    }
    return label;
  }

  skewChanged(event) {
    console.log(event);
    this.task.setSkew(event.value);
    this.drawChart();
  }

  confidenceChanged(event) {
    this.task.setConfidence(event.value);
    this.drawChart();
  }

  toFixed(value, precision) {
    const power = Math.pow(10, precision || 0);
    return String(Math.round(value * power) / power);
  }

}
