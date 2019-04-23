import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @Input() selectedTab:string;
  @Output() onTabPicked: EventEmitter<any> = new EventEmitter<any>();
  private onTabSelected: (tab) => void;

  constructor() {

  }

  ngOnInit() {
    this.onTabSelected = function(tab){
      this.selectedTab = tab;
      this.onTabPicked.emit(this.selectedTab);
    }
  }


}
