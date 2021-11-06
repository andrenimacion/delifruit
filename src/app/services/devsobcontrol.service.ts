import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DevsobcontrolService {

  public  port: string = environment.port;
  private apiURL = `https://alp-cloud.com:${this.port}/api`;

  constructor( private http: HttpClient ) { }

  saveSobDevs( model: any [] ) {
    return this.http.post( this.apiURL + '/c_devsob/SaveDevSob', model );
  }

  getSobDevs( token: string, codLot: string ) {
    return this.http.get( this.apiURL + '/c_devsob/getC_DEVSOB/' + token + '/' + codLot );
  }

  putSobDevs( lotePK: string, model: any [] ) {
    return this.http.put( this.apiURL + '/c_devsob/puttransprod/' + lotePK, model );
  }

}
