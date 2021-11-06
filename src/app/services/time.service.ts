import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  constructor() { }

  timeSetformatSQL( name: string, property: string ) {
    
    const date = new Date();

    let y   = date.getFullYear(); 
    let m   = date.getMonth();  
    let d   = date.getDay();  
    let h   = date.getHours();  
    let min = date.getMinutes();  
    let sec = date.getSeconds();  

    localStorage.setItem( `audit_mod_${name}-${property}`, `${y}-${m}-${d} ${h}:${min}:${sec}` );

  }

}
