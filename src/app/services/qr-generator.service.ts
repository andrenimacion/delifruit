import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class QrGeneratorService {

  public port: string = environment.port;
  private apiURL = `https://alp-cloud.com:${this.port}/api`;
  //private apiURL = `https://alp-cloud.com:8430/api`;
 
 
 
   constructor(private http: HttpClient) { }
   savedata(model: any ){
     return this.http.post( this.apiURL + '/RecuData01/SaveRecuData01', model);
   }
   update_qr(id:string, model: any ){
    return this.http.put( this.apiURL + '/AuditPrint/update_audit_print_lote/' + id, model);
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
 
   saveAuditPrint(model: any) {
     return this.http.post( this.apiURL + '/AuditPrint/Save_audit_print_lote', model);
   }
   
   // exec AR_audit @User, @codec
   getAuditPrint( user: string, order: string, prop:string ) {
     return this.http.get( this.apiURL + '/AuditPrint/getAudit/'+ user +'/' + order +'/' + prop);
   }
 
   getMenuAudit() {
     return this.http.get( this.apiURL + '/Taudit/geT_Audit');
   }
   
   getLoteUnit( codec_lotes_master: string, lote:string, state:string) {
     return this.http.get( this.apiURL + '/AuditPrint/GetLotes/' + codec_lotes_master +'/' + lote +'/' + state )
   }
   senaudit(text:String){
     this.getauditoria("module_codec", "a", "ASC").subscribe((x)=>{
       var arrl:any = x
       var nameuser = sessionStorage.getItem('User_Name') || ""
       var module = localStorage.getItem('name_module') || ""
       var date = new DatePipe("en-US").transform(new Date(), 'yyyy-MM-dd') || "";
       var arr = {
         name_audit: sessionStorage.getItem('Code_user') || "",
         date: new Date(),
         codec_audit: module?.slice(0,5) + date.split('-').join('') + nameuser + arrl.length.toString().padStart(10, "0"), 
         module_codec: module, 
         client_net_address: null,
         accion_user: text
       }
       this.saveauditoria(arr)
     })
   }
   saveauditoria(data:any) {
     this.http.get("http://api.ipify.org/?format=json").subscribe((res:any)=>{
       data.local_net_address = res.ip
       this.http.post( this.apiURL + '/AUD/SaveAUD/', data ).subscribe()
     });
   }
   getauditoria( prop: string, data:string, order:string) {
     return this.http.get( this.apiURL + '/AUD/getAudit/' + prop +'/' + data +'/' + order )
   }
 }
 