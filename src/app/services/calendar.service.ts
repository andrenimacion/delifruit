import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  public port: string = environment.port;
 private apiURL = `https://alp-cloud.com:${this.port}/api`;
 //private apiURL = `https://alp-cloud.com:8430/api`;




  constructor(private http: HttpClient) { }

  gettable(tabla:string){
    return this.http.get( this.apiURL + '/tabs/GETHEADS/' + tabla);
  }
  getDp08acal(order: string, anio:string, prop:string) {
    return this.http.get( this.apiURL + '/dp08acal/getDp08acal/' + order +'/'+ anio +'/'+ prop );
  }

  saveDp08acal( model: any [] ) {
    return this.http.post( this.apiURL + '/dp08acal/save_dp08acal/', model );
  }

  deleteDp08acal( anio: string, peri: string, sema: string ) {
    return this.http.get( this.apiURL + '/dp08acal/DelDp08acal/' + anio + '/' + peri + '/' + sema );
  }
  deleteqrlote(lotes:string, prop:string){
    return this.http.get( this.apiURL + '/AuditPrint/delLotes/' + prop  + '/' + lotes );
  }
}
