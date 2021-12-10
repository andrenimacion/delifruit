import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { ValidationHttpService } from 'src/app/services/validation-http.service';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formlogin = this._formBuilder.group({
    WebUsu: ['', Validators.required],
    WebPass: ['', Validators.required],
  });
  toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  passwordType: string   = 'password';
  passwordShow: boolean  = false;
  password: string       = '';
  usuario: string        = '';
  public _alerts: string = '';
  hide = true
  env = environment;
  show = false
  constructor(private _formBuilder: FormBuilder,public userService: LoginService,
    public router: Router, private httpValidate: ValidationHttpService) { }

  ngOnInit() {
    this.verificacion();
    setTimeout(() => {
      this.show = true
    }, 60);
  }

  verificacion() {   
    if (sessionStorage.getItem('User_Name') == '' || sessionStorage.getItem('User_Name') == null) {
      this.router.navigate(['login']);
    } else {
      this.router.navigate(['dash']);
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
  logeo(){
    if(this.formlogin.valid){
     let arrLog: any = {      
       WebUsu:  "a,",
       WebPass: "b"
     }
      this.userService.login(this.formlogin.value).subscribe( x => {
        this.arrLogin = x;      
        let name     = this.arrLogin.webUsu;
        let estado   = this.arrLogin.tipoMu;
        let CodeUser = this.arrLogin.codeUser;
        console.log(name + ' : ' + estado + ' : ' + CodeUser);
        sessionStorage.setItem('User_Name', name);
        sessionStorage.setItem('Estado', estado);
        sessionStorage.setItem('Code_user', CodeUser);
        this.verificacion();
        this.toast.fire({
          icon: 'success',
          title: 'Inicio exitoso'
        })
        this.router.navigate(['/dash'])
      }, (e)=> {
        console.log(e)
        this.toast.fire({
          icon: 'error',
          title: e.error
          
        })
      })
    
    }
  }

}
