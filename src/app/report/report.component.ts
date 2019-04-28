import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {SingleTask} from '../singleTask';
import {Chart} from 'chart.js';

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

    let vals = this.runSimulation();

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
    console.log(this.chart);
  }

  runSimulation(): number[] {
    
    return [1, 2, 3];
  }

}
