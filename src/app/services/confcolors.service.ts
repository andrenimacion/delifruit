import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfcolorsService {
  public port: string = environment.port;
  private apiURL = `https://alp-cloud.com:${this.port}/api`;


  constructor(private http: HttpClient, public router: Router) { }
  

  confalpMaster(model: any []) {
    return this.http.post( this.apiURL + '/control_alp_master_tabla/save_color_alp_master' ,  model);
  }

  conf_code_color(model: any []) {
    return this.http.post( this.apiURL + '/control_alp_master_tabla/save_color_code_lab' ,  model);
  }
  
  gecolor( codecmaster: string ) {
    return this.http.get( this.apiURL + '/control_alp_master_tabla/gecolor/' + codecmaster);
  }
  
  decolor( codecmaster: string, np: string ) {
    return this.http.get( this.apiURL + '/control_alp_master_tabla/delcolor/' + codecmaster + '/' + np);
  }

}
