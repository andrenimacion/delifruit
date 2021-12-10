import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ValidationHttpService {


  public port: string = environment.port;
  private URLConnect = `https://alp-cloud.com:${this.port}/api`;
  

  constructor( public router: Router, private http: HttpClient ) { }

  DBconsultor( DBconnect: string ) {
    return this.http.get( this.URLConnect + '/CnStringsDB/cndb_empresas/' + DBconnect );
  }

  Dbconsultorgen() {
   return this.http.get( this.URLConnect + '/CnStringsDB/cndb_empresasGen' );
  }

  GetConnection(cns: any) {
    return this.http.get( this.URLConnect + '/CnStringsDB/ConnectDB/' + cns )
  }

  validateSession(divs: string, contentHTMLheader: string,
                  contentHTMLparagraph: string,
                  alertType: string,
                  a: any, icon: string) {
    if (sessionStorage.getItem('User_Name') == '') {
      this.router.navigate(['/Login']);
    }

    else {
      this.router.navigate(['/Login']);
      // manejo de errores (err)=> validateSession(....)

      // #region Bootstrap ALERTS https://getbootstrap.com/docs/4.0/components/alerts/
        //         <div class="alert alert-primary" role="alert">
        //   This is a primary alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
        // </div>
        // <div class="alert alert-secondary" role="alert">
        //   This is a secondary alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
        // </div>
        // <div class="alert alert-success" role="alert">
        //   This is a success alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
        // </div>
        // <div class="alert alert-danger" role="alert">
        //   This is a danger alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
        // </div>
        // <div class="alert alert-warning" role="alert">
        //   This is a warning alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
        // </div>
        // <div class="alert alert-info" role="alert">
        //   This is a info alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
        // </div>
        // <div class="alert alert-light" role="alert">
        //   This is a light alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
        // </div>
        // <div class="alert alert-dark" role="alert">
        //   This is a dark alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
        // </div>
      //#endregion

      const idsAlerts = <HTMLDivElement> document.getElementById(`${divs}`);

      let val: number = a;
      switch (val) {
        case 1:
          idsAlerts.innerHTML = `<div class="alert ${alertType}" role="alert" >
                             <h4 class="alert-heading"> <span class="icon-${icon}"></span> ${contentHTMLheader}</h4>
                             <p>${contentHTMLparagraph}</p>   
                             </div>`;
          break;

        case 2:
          idsAlerts.innerHTML = `<div class="alert ${alertType}" role="alert" >
                                 <strong> <span class="icon-${icon}"></span> ${contentHTMLheader}</strong>: ${contentHTMLparagraph}.
                                 </div>`;
          break;
        

        case 3:
          idsAlerts.innerHTML = `<div class="alert ${alertType}" role="alert" >
                                 <strong> <span class="icon-${icon}"></span> ${contentHTMLheader}</strong>: ${contentHTMLparagraph}.
                                 </div>`;
          break;
        default:
          idsAlerts.innerHTML = `<div class="alert ${alertType}" role="alert"  >
                                 <h4 class="alert-heading"> <span class="icon-${icon}"></span> ${contentHTMLheader}</h4>
                                 <p>${contentHTMLparagraph}</p></div>`;          
          break;
      }
      
    }

  }

}
