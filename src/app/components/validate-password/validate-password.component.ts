import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-validate-password',
  templateUrl: './validate-password.component.html',
  styleUrls: ['./validate-password.component.css']
})
export class ValidatePasswordComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ValidatePasswordComponent>, private loginsvc:LoginService
  ) {}
  ngOnInit(): void {
      
  }
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
  password = new FormControl("", Validators.required);
  onNoClick(): void {
    this.dialogRef.close();
  }
  yesClick(){
    if(this.password.valid){
      var webusu = sessionStorage.getItem('User_Name');
      if(webusu){
        let arrLog: any = {      
          WebUsu:  webusu,
          WebPass: this.password.value
        }
        this.loginsvc.login(arrLog).subscribe({
          next:()=>{
            this.dialogRef.close(true);
            this.toast.fire({
              icon: 'success',
              title: 'Validacion exitosa'
            });
          }, error:()=>{
            this.toast.fire({
              icon: 'error',
              title: 'Credenciales incorrectas'
            });
          }
        })
    }}
  }
}