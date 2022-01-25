import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class HarvestService {

  public port: string = environment.port;
  private apiURL = `https://alp-cloud.com:${this.port}/api`;
 
 
 
   constructor(private http: HttpClient) { }
   getLoteUnit( codec_lotes_master: string,lot:string, state:number) {
    return this.http.get( this.apiURL + '/AuditPrint/GetLotes/' + codec_lotes_master + '/'  + lot + '/' + state + '/ASC')
  }
  gcosecha(top: string, order: string) {
    return this.http.get( this.apiURL + '/cosecha/getCosecha/' + top + '/' + order );
  }
  scosecha( model: any ) {
    return this.http.post( this.apiURL + '/cosecha/saveCosecha', model )
  }
  dcsecha(id: number) {
    return this.http.get( this.apiURL + '/cosecha/delCosecha/' + id);
  }
 }
 