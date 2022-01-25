import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public port: string = environment.port;
  private apiURL = `https://alp-cloud.com:${this.port}/api`;
  

  constructor(private http: HttpClient) { }
  
  login(contentLog: string) {
    return this.http.post( this.apiURL + '/UserLogin/login' ,  contentLog);
  }
}