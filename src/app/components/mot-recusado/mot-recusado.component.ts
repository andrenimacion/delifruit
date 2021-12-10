import { Component, OnInit } from '@angular/core';
import { MotRecusadoService } from 'src/app/services/mot-recusado.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mot-recusado',
  templateUrl: './mot-recusado.component.html',
  styleUrls: ['./mot-recusado.component.css']
})
export class MotRecusadoComponent implements OnInit {
  public loading = false;
  public loadinglist = true;
  public listdata:any;
  public titlemotiv = "";
  public descriptmotiv = "";

  constructor(private servicemotiv: MotRecusadoService) { }
  public toast = Swal.mixin({
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
  ngOnInit(): void {
    this.loadfun()
  }
  loadfun(){
    this.loadinglist = true;
    var tok = sessionStorage.getItem("Code_user");
    var order = "asc"
    this.servicemotiv.loaddata(`${tok}`, order).subscribe( x => {
      this.listdata = x;
      this.loadinglist = false;
    }, (errr)=>{
      this.toast.fire({
        icon: 'error',
        title: 'Error al cargar la lista'
      })
      this.loadinglist = false;
    })
  }
  sendmotiv(){
    var text = <HTMLInputElement> document.getElementById("input");
    var textarea = <HTMLInputElement> document.getElementById("textarea");
    if(text.value.length >= 1 && textarea.value.length >= 1 ){
      this.loading = true;
      var date = new Date();
      var tok = sessionStorage.getItem("Code_user");
      let arrLog: any = {      
        name_mot:  this.titlemotiv,
        descrip_mot: this.descriptmotiv,
        date: date,
        token_session: tok
      }
      this.servicemotiv.senddata(arrLog).subscribe( x => {
        this.loadfun();
        text.value = ""
        textarea.value = ""
        this.loading = false;
        this.toast.fire({
          icon: 'success',
          title: 'Guardado con exito'
        })
      }, (errr)=>{
        this.toast.fire({
          icon: 'error',
          title: 'Error al cargar la lista'
        })
        this.loading = false;
      })
    }else{
      this.toast.fire({
        icon: 'error',
        title: 'Ingresa datos correctos'
      })
    }
  }
  updatemotiv(name: string, description:string, id:number){
    var title = <HTMLInputElement> document.getElementById(name);
    var text = <HTMLInputElement> document.getElementById(description)
    this.loadinglist = true;
    var date = new Date();
    var tok = sessionStorage.getItem("Code_user");
    let arrLog: any = {     
      id: id, 
      name_mot:  title.value,
      descrip_mot: text.value,
      date: date,
      token_session: tok
    }
    this.servicemotiv.updatedata(arrLog, id, `${tok}`).subscribe( x => {
      this.loadinglist = false;
      this.toast.fire({
        icon: 'success',
        title: 'Actualizado con exito'
      })
    }, (errr)=>{
      this.toast.fire({
        icon: 'error',
        title: 'Error al cargar la lista'
      })
      this.loadinglist = false;
    })
  }
  deletemotiv(id:number){
    this.loadinglist = true;
    var tok = sessionStorage.getItem("Code_user");
    this.servicemotiv.deletedata(id, `${tok}`).subscribe( x => {
      this.loadfun();
      this.toast.fire({
        icon: 'success',
        title: 'Eliminado con exito'
      })
      this.loadinglist = false;
    }, (errr)=>{
      this.toast.fire({
        icon: 'error',
        title: 'Error al eliminar la lista'
      })
      this.loadinglist = false;
    })
  }

}