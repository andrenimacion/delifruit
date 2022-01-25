import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuditoryService } from 'src/app/services/auditory.service';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,public userService: LoginService,public router: Router, private auditoria: AuditoryService, private routea:ActivatedRoute) { }

  formlogin = this.formBuilder.group({
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

  loading = false
  passwordType: string   = 'password';
  passwordShow: boolean  = false;
  password: string       = '';
  usuario: string        = '';
  public _alerts: string = '';
  hide = true


  ngOnInit() {
    this.verificacion();
  }

  verificacion() {   
    if (sessionStorage.getItem('User_Name') != '' || sessionStorage.getItem('User_Name') != null) {
      this.router.navigate(['/dashboard']);
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
      this.loading = true
     let arrLog: any = {      
       WebUsu:  "a,",
       WebPass: "b"
     }
      this.userService.login(this.formlogin.value).subscribe( x => {
        var name_module = this.routea.snapshot.routeConfig?.path || "undefine"
        this.arrLogin = x;      
        if(this.arrLogin.tipoMu == "N"){
          let name     = this.arrLogin.webUsu;
          let estado   = this.arrLogin.tipoMu;
          let CodeUser = this.arrLogin.codeUser;
          sessionStorage.setItem('User_Name', name);
          sessionStorage.setItem('Estado', estado);
          sessionStorage.setItem('Code_user', CodeUser);
          this.toast.fire({
            icon: 'success',
            title: 'Inicio exitoso'
          })
         this.loading = false
          this.auditoria.saveaudit("Se logeo el usuario " + name, name_module)
          this.router.navigate(['/dash'])
        }else{
         this.loading = false
        this.toast.fire({
          icon: 'error',
          title: "Usuario no existe"
        })
        }
      }, (e)=> {
        this.loading = false
        this.toast.fire({
          icon: 'error',
          title: "Credenciales incorrectas"
        })
      })
    
    }
  }

}
