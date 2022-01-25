import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { InfoComponent } from '../info/info.component';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.css']
})
export class ModulesComponent implements OnInit {

  constructor(private dashboardsvc:DashboardService, private router:Router, public dialog: MatDialog) { }
  exit = false
  items:any = []
  ngOnInit(): void {
    this.dashboardsvc.modules$.subscribe((x)=>{
      this.items = x
    })
    this.dashboardsvc.info$.subscribe((x)=>{
      const dialogRef = this.dialog.open(InfoComponent, {
        width: '350px',
        data: {version: x.version, date:x.date},
      });
    })
  }
  selectitem(arr:any){
    this.exit = true
    setTimeout(() => {
      this.router.navigate(['../'+arr.icon_module]);
    }, 300);
  }
  
}
