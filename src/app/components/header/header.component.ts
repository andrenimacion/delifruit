import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public data_head: any = '';

  constructor() { }

  ngOnInit(): void {
  }

  ghead() {
    this.data_head = localStorage.getItem('name_module');
  }


}
