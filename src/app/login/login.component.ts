import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2'
import { LoginService } from '../services/login.service';
import { ValidationsHttpService } from '../services/validations-http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  passwordType: string   = 'password';
  passwordShow: boolean  = false;
  password: string       = '';
  usuario: string        = '';
  public _alerts: string = '';

  env = environment;
 
  constructor(public userService: LoginService,
    public router: Router, private httpValidate: ValidationsHttpService) { }

  ngOnInit() {
    this.verificacion();
  }

  verificacion() {    
    if (sessionStorage.getItem('User_Name') == '' || sessionStorage.getItem('User_Name') == null) {
      this.router.navigate(['/login']);
    }
    else {
      this.router.navigate(['/camview']);
    }
  }

  passwordHidShow() {
    if ( !this.passwordShow ) {
      this.passwordShow = true;
      this.passwordType = 'text';
    }    
    else {
      this.passwordShow = false;
      this.passwordType = 'password';
    }
  }

  public arrLogin: any = [];
  logeo( a: string ,b: string ) {

    let arrLog: any = {
      WebUsu:  a,
      WebPass: b
    }

    // console.log(arrLog);
    this.userService.login(arrLog).subscribe( x => {
      this.arrLogin = x;      
      
      // console.log(this.arrLogin)

      let name     = this.arrLogin.webUsu;
      let estado   = this.arrLogin.tipoMu;
      let CodeUser = this.arrLogin.codeUser;
      
      console.log(name + ' : ' + estado + ' : ' + CodeUser);
      
      sessionStorage.setItem('User_Name', name);
      sessionStorage.setItem('Estado', estado);
      sessionStorage.setItem('Code_user', CodeUser);

      this.verificacion();
      this.router.navigate(['/dash']);

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Te has logeado con éxito',
        showConfirmButton: false,
        timer: 2000
      })

    }, ()=> {
      let d: string = '';
      this.httpValidate
          .validateSession( 'demAL', 
                            'Algo salió mal!',
                            'Revisa tu usuario y contraseña.',
                            'alert-danger animated bounceInDown fast',
                             2, 'warning');
    })

  }

 



}
