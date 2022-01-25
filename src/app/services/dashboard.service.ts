import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  modules$ = new EventEmitter<any>()
  info$ = new EventEmitter<any>()
  public port: string = environment.port;
 private apiURL = `https://alp-cloud.com:${this.port}/api`;

  constructor(private http: HttpClient) { }
  getmodules(){
    return this.http.get( this.apiURL + '/modcon/get_module/ASC/1.1' )
  }
}
