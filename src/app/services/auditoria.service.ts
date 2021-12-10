import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {

  
  public port: string = environment.port;
  private apiURL = `https://alp-cloud.com:${this.port}/api`;

  constructor(private http: HttpClient, public router: Router) { }
  
  savedata(model: any ){
    return this.http.post( this.apiURL + '/RecuData01/SaveRecuData01', model);
  }

  editdata(id:number, model: any ){
    return this.http.post( this.apiURL + '/RecuData01/PutRecuData01/' + id, model);
  }

  loaddata( token: string, tipe:string ){
    return this.http.get( this.apiURL + '/RecuData01/getRecuData01/' + token + '/' + tipe);
  }

  deletedata( token: string, id:number ){
    return this.http.get( this.apiURL + '/RecuData01/delRecuData01/' + token + '/' + id);
  }

  saveAuditPrint(model: any []) {
    return this.http.post( this.apiURL + '/AuditPrint/Save_audit_print_lote', model);
  }
  
  // exec AR_audit @User, @codec
  getAuditPrint( user: string, codec: string ) {
    return this.http.get( this.apiURL + '/AuditPrint/getAudit/'+ user +'/' + codec);
  }

  getMenuAudit() {
    return this.http.get( this.apiURL + '/Taudit/geT_Audit');
  }
  
  // https://alp-cloud.com:8430/api/AuditPrint/GetLotes/DEL_H/001
  getLoteUnit( codec_lotes_master: string, codec_lotes: string ) {
    return this.http.get( this.apiURL + '/AuditPrint/GetLotes/' + codec_lotes_master + '/' + codec_lotes )
  }
}
