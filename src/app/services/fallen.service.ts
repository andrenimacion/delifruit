import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class FallenService {

  public port: string = environment.port;
 private apiURL = `https://alp-cloud.com:${this.port}/api`;

 constructor(private http: HttpClient) { }
  getLoteUnit( codec_lotes_master: string, lote:string, state:string, order:string) {
    return this.http.get( this.apiURL + '/AuditPrint/GetLotes/' + codec_lotes_master +'/' + lote +'/' + state+'/' + order )
  }
  savedata(model: any ){
    return this.http.post( this.apiURL + '/RecuData01/SaveRecuData01', model);
  }
  loaddata( data: string, prop:string ){
    return this.http.get( this.apiURL + '/RecuData01/getRecuData01/' + data + '/' + prop);
  }

  loaddata_mot(tok:string, order:string){
    return this.http.get(this.apiURL + `/Motiv/getMotiv/`+tok+`/`+ order );
  }
  deleteitemhis(id:number){
    return this.http.get( this.apiURL + '/RecuData01/delRecuData01/'+ id )
  }
  senddata(model:any){
    return this.http.post( this.apiURL + '/Motiv/save_motiv', model )
  }
  updatedata(model:any, id:number, tok:string){
    return this.http.put( this.apiURL + `/Motiv/putMotiv/`+id+`/`+ tok, model )
  }
  deletedata(id:number, token: string){
    return this.http.get( this.apiURL + '/Motiv/DelMotiv/'+ id +'/'+ token )
  }
}
