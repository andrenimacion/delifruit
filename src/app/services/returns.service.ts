import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ReturnsService {
  public  port: string = environment.port;
  private apiURL = `https://alp-cloud.com:${this.port}/api`;

  constructor( private http: HttpClient ) { }

  saveSobDevs( model: any ) {
    return this.http.post( this.apiURL + '/c_devsob/SaveDevSob', model );
  }
  //hISTORIAL
  getSobDevs(state:string, codLot: string, prop:string, order:string ) {
    return this.http.get( this.apiURL + '/c_devsob/getC_DEVSOB/'+ state + '/' + codLot + '/'+ prop + '/' + order );
  }

  putSobDevs( lotePK: string, model: any , lote:string ) {
    return this.http.put( this.apiURL + '/c_devsob/puttransprod/' + lotePK + '/'+ lote, model );
  }
  //lOTES
  getLoteUnit( codec_lotes_master: string,lot:string, state:number) {
    return this.http.get( this.apiURL + '/AuditPrint/GetLotes/' + codec_lotes_master + '/'  + lot + '/' + state + '/ASC')
  }
  deletehistunit(token:string, codec_master:string, lote:string){
    return this.http.get( this.apiURL + '/c_devsob/delC_DEVSOB/' + token + '/' + codec_master  + '/' + lote )
  }

}
