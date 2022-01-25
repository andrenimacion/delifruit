import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuditoryService } from 'src/app/services/auditory.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  version = "2.0.8"
  date = "24 de enero 2022"
  constructor(private auditoriasvc:AuditoryService,public router:Router, public auditoria:AuditoryService, public dashboard:DashboardService, public routea:ActivatedRoute) { }
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
  state = false
  items:any = []
  loading = true
  user = sessionStorage.getItem("User_Name") || "null"
  title_header = "Dashboard"
  icon = "dashboard"
  ngOnInit(): void {
    this.modules()
  }
  modules(){
    var url = this.routea.snapshot.routeConfig?.path
    var module = url?.split("/")[0]
    if(module == "error_outline"){
      setTimeout(() => {
        this.auditoria.reviced_url$.emit({code:this.routea.snapshot.params["code"], state:this.routea.snapshot.params["state"]})
      }, 100);
    }
    this.dashboard.getmodules().subscribe({
      next:(m)=>{
        this.loading = false
        this.items = m
        this.dashboard.modules$.emit(m);
        var result = this.items.find((x:any)=>x.icon_module === module)
        if(result != undefined){
          this.icon = result.icon_module
          this.title_header = result.name_module.trim()
          this.state = true
        }else{
          this.icon = "dashboard"
          this.title_header = "Dashboard"
          this.state = false
        }
        localStorage.setItem("name_module", this.title_header)
        this.auditoriasvc.saveaudit("Entro al modulo " +  this.title_header, this.title_header)
      }, error:()=>{
        this.loading = false
        this.toast.fire({
          icon: 'error',
          title: 'Error al cargar los modulos'
        })
      }
    })
  }
  changedash(){
    this.router.navigate(['../']);
  }
  logout(){ 
    this.auditoria.saveaudit("Se deslogeo el usuario " + this.user, "Login")
    sessionStorage.removeItem('User_Name');
    sessionStorage.removeItem('Estado');
    sessionStorage.removeItem('Code_user');
    localStorage.removeItem("H_Global_total")
    localStorage.removeItem("H_Global_cont")
    localStorage.removeItem("H_arrcaidos")
    localStorage.removeItem("H_arrdata")
    localStorage.removeItem("H_semana")
    localStorage.removeItem("H_color")
    localStorage.removeItem("H_code_use")
    this.router.navigate(['../login']);
  }
  info(){
    if(!this.state){
      this.dashboard.info$.emit({version:this.version, date: this.date})
    }
  }
}
