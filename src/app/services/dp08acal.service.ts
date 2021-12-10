import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class Dp08acalService {

  public port: string = environment.port;
  private apiURL = `https://alp-cloud.com:${this.port}/api`;

  constructor(private http: HttpClient) { }

  getDp08acal(order: string) {
    return this.http.get( this.apiURL + '/dp08acal/getDp08acal/' + order );
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
