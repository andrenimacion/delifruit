import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuditoryService {
  msecuential = 0
  reviced_url$ = new EventEmitter<any>()
  public port: string = environment.port;
  private apiURL = `https://alp-cloud.com:${this.port}/api`;

  constructor(private http: HttpClient) { }

  saveaudit(accion:String, module:string){
    this.getauditoria("codec_audit", "0", "ASC").subscribe((x)=>{
      var arrl:any = x
      this.msecuential = 0
      for(let i = 0;i < arrl.length;i++){
        var text = arrl[i].codec_audit
        var number = Number(text.slice(Number(text.length - 10), text.length))
        if(number > this.msecuential){
          this.msecuential = number
        }
        if(Number(i + 1) == arrl.length){
          var nameuser = sessionStorage.getItem('User_Name') || ""
          var date = new DatePipe("en-US").transform(new Date(), 'yyyy-MM-dd') || "";
          var arr = {
            name_audit: sessionStorage.getItem('Code_user') || "",
            date: new Date(),
            codec_audit: module?.slice(0,5) + date.split('-').join('') + nameuser + Number(this.msecuential + 1).toString().padStart(10, "0"), 
            module_codec: module, 
            client_net_address: null,
            accion_user: accion
          }
          this.saveauditoria(arr)
        }
      }
    })
  }
  getauditoria( prop: string, data:string, order:string) {
    return this.http.get( this.apiURL + '/AUD/getAudit/date/a/asc/1' )
  }
  saveauditoria(data:any) {
    this.http.get("https://api.ipify.org/?format=json").subscribe({
      next:(res:any)=>{
        data.local_net_address = res.ip
        this.http.post( this.apiURL + '/AUD/SaveAUD/', data ).subscribe()
      },error:()=>{
        data.local_net_address = "No disponible"
        this.http.post( this.apiURL + '/AUD/SaveAUD/', data ).subscribe()
      }
    });
  }
}