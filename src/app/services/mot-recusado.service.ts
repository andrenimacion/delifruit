import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MotRecusadoService {
  public port: string = environment.port;
  constructor(private http:HttpClient) { }
  private apiURL = `https://alp-cloud.com:${this.port}/api`;
  loaddata(tok:string, order:string){
    return this.http.get(this.apiURL + `/Motiv/getMotiv/`+tok+`/`+ order );
  }
  senddata(model:any){
    return this.http.post( this.apiURL + '/Motiv/save_motiv', model )
  }
  updatedata(model:any, id:number, tok:string){
    return this.http.put( this.apiURL + `/Motiv/putMotiv/`+id+`/`+ tok, model )
  }
  deletedata(id:number, token: string){
    console.log(token);
    return this.http.get( this.apiURL + '/Motiv/DelMotiv/'+ id +'/'+ token )
  }
  deleteitemhis(id:number, token: string){
    console.log(token);
    return this.http.get( this.apiURL + '/RecuData01/delRecuData01/'+ token +'/'+ id )
  }
}