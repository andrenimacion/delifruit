import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.css']
})
export class MaintenanceComponent implements OnInit {

  date = new Date()
  constructor() { }

  ngOnInit(): void {
    this.change()
  }
  change(){
    this.date = new Date()
    setTimeout(() => {
      this.change()
    }, 1000);
  }
}
