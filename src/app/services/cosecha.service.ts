import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CosechaService {


  public port: string = environment.port;
  private apiURL = `https://alp-cloud.com:${this.port}/api`;

  constructor(private http: HttpClient) { }

  pcsecha(model: any [], id: number) {
    return this.http.put( this.apiURL + '/cosecha/putCosecha/' + id, model);
  }
  getDp08acal(order: string) {
    return this.http.get( this.apiURL + '/dp08acal/getDp08acal/' + order );
  }
  gcosecha(top: number, order: string) {
    return this.http.get( this.apiURL + '/cosecha/getCosecha/' + top + '/' + order );
  }
  getMaster(nomtag: string, properties: string, order: string) {  
    return this.http.get( this.apiURL + '/control_alp_master_tabla/geMaster/' + nomtag + '/' + properties + '/' + order );
  }
  scosecha( model: any [] ) {
    return this.http.post( this.apiURL + '/cosecha/saveCosecha', model )
  }
  dcsecha(id: number) {
    return this.http.get( this.apiURL + '/cosecha/delCosecha/' + id);
  }

}
