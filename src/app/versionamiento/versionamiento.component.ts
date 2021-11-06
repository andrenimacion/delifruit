import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-versionamiento',
  templateUrl: './versionamiento.component.html',
  styleUrls: ['./versionamiento.component.css']
})
export class VersionamientoComponent implements OnInit {

  // public date: any = new Date();
  public _time_log: string = '';

  constructor() { }

  ngOnInit(): void {
    
    setInterval( () => {
      this.timezone();
    },1000)

  }

  // retorna mi hora actual en el siguiente formato >> hh:mm:ss >>
  timezone(): string {
    const a = new Date();
    let hor = a.getHours();
    let min = a.getMinutes();
    let sec = a.getSeconds();
    this._time_log = hor + ':' + min + ':' + sec;
    return this._time_log;
  }

}
