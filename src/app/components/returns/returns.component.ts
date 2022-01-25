import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuditoryService } from 'src/app/services/auditory.service';
import { ReturnsService } from 'src/app/services/returns.service';
import Swal from 'sweetalert2';
import { ValidatePasswordComponent } from '../validate-password/validate-password.component';

@Component({
  selector: 'app-returns',
  templateUrl: './returns.component.html',
  styleUrls: ['./returns.component.css']
})
export class ReturnsComponent implements OnInit {

  loading_tab = false
  state_order = "DESC" // Si es ASC o DESC
  value_order = "ffin" // El valor por el q se va a order.. ejemp: id, color, etc
  icon_order = "expand_more" // Es el icono del estado del orden
  itemsPerPage = 10
  currentPage = 1
  cantarest = 0
  arrDev:any = []
  arrLotes:any = []
  list_dev:any = []
  loading_search = false
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
  constructor(private router:Router,public dialog: MatDialog, private route:ActivatedRoute, private returssvc:ReturnsService, private auditoriasvc:AuditoryService) { }

  ngOnInit(): void {
    var input = <HTMLInputElement> document.getElementById("input-code")
    input.focus()
    var code = this.route.snapshot.params["code"]
    if(code != undefined){
      input.value = code;
      this.search()
    }
    this.state_order = localStorage.getItem("R_order_state") || "DESC";
    this.value_order = localStorage.getItem("R_order_value") || "ffin"; 
    this.load_dev()
  }
  load_dev(){ 
    this.loading_tab = true
    this.list_dev = []
      this.returssvc.getSobDevs("2",`DEL_H`, this.value_order, this.state_order).subscribe({
        next:(x)=>{
          console.log(x)
          this.loading_tab = false
          this.list_dev = x
        }, error:()=>{
          this.loading_tab = false
          this.toast.fire({
            icon: 'error',
            title: 'Erro al cargar las devoluciones'
          });
        }
      })
  }
  return_neg(data:number):string{
    if(data > 0){
      return "-"+data
    }else{
      return ""+data+""
    }
  }
  items = [{}, {}]
  old_id = ""
  state_id = false
  view(lost:string, index:number){
    var id = `1-${lost}-${index}`;
    console.log("d-"+id)
    if(this.old_id != ""){
      var div = <HTMLDivElement> document.getElementById("d-"+this.old_id)
      var cant = <HTMLDivElement> document.getElementById( "a-"+this.old_id)
      var edit = <HTMLDivElement> document.getElementById( "e-"+this.old_id)
      var clear = <HTMLDivElement> document.getElementById( "c-"+this.old_id)
      var input = <HTMLInputElement> document.getElementById("i-"+this.old_id)
      div.style.minHeight = 50+"px"
      div.style.background = "#FFF"
      cant.style.right = "0%"
      edit.style.right = "-50px"
      clear.style.right = "-50px"
    }
    this.old_id = id
    var div = <HTMLDivElement> document.getElementById("d-"+id)
    var cant = <HTMLDivElement> document.getElementById( "a-"+id)
    var edit = <HTMLDivElement> document.getElementById( "e-"+id)
    var clear = <HTMLDivElement> document.getElementById( "c-"+id)
    var input = <HTMLInputElement> document.getElementById("i-"+id)
    if(input.value == "false"){
      cant.style.right = "100%"
      div.style.minHeight = 270+"px"
      div.style.background = "#E9E9E9"
      edit.style.right = "55px"
      clear.style.right = "15px"
      this.state_id = true
      input.value = "true"
    }else{
      cant.style.right = "0%"
      div.style.minHeight = 50+"px"
      div.style.background = "#FFF"
      this.state_id = false
      edit.style.right = "-50px"
      clear.style.right = "-50px"
      input.value = "false"
    }
  }
  edit_item(lot:string, index:number, data:any, input:string, nstate:string){
    var id = `1-${lot}-${index}`;
    var state = <HTMLInputElement> document.getElementById("v-"+id)
    var icon = <HTMLInputElement> document.getElementById("ic-"+id)
    var menos = <HTMLDivElement> document.getElementById("me-"+id)
    var mas = <HTMLDivElement> document.getElementById( "ma-"+id)
    var number = <HTMLInputElement> document.getElementById("input-"+id)
    var inpút = <HTMLTextAreaElement> document.getElementById( "t-"+id)
    if(state.value == "false"){
      icon.innerHTML = "save"
      state.value = "true"
      number.disabled = false
      inpút.disabled = false
      number.style.marginRight = "0px"
      mas.style.display = "flex"
      menos.style.display = "flex"
    }else{
      Swal.fire({
        title: 'Seguro desea actualizar?',
        showDenyButton: true,
        confirmButtonText: 'Si actualizar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.update_dev(data, index, input, nstate)
        }
      })
    }

  }
  delete_item(prod:string, camp:string){
    Swal.fire({
      title: 'Seguro desea borrar?',
      showDenyButton: true,
      confirmButtonText: 'Si borrar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.delete_dev(prod, camp)
      }
    })
  }
  showdate(e:any, date:string){
    if(e.path[0].value == false || e.path[0].value == undefined){
      e.path[0].innerHTML = new DatePipe('en-US').transform(date, 'shortTime')
      e.path[0].value = true
    }else{
      e.path[0].value = false
      console.log(e.path[0].value)
      e.path[0].innerHTML = new DatePipe('en-US').transform(date, 'shortDate')
    }
  }
  aument(data:number, cant:number){
    var value =cant + this.cantarest 
    if(data == 1 && value >= 1){
      this.cantarest = this.cantarest + -1
    }else if(data == 2){
      if(this.cantarest >= 0){
        this.cantarest = -this.cantarest
      }
    }else if(data == 0 && this.cantarest != 0){
      this.cantarest = this.cantarest + 1 
    }
  }
  insercant(id:string, data:number, index:number, tot:number, state:string){
    var number = 0;
    var input1 = <HTMLInputElement> document.getElementById(`input-${state}-${id}-${index}`);
    var total1 = <HTMLDivElement> document.getElementById(`total-${state}-${id}-${index}`);
    number = Number(input1.value)    
    if(number >= 0){number = -number}
    if(data == 1 && total1.innerHTML != "0"){
      number = number + -1
      input1.value = `${number}`
      if(tot + number >= 0){
        total1.innerHTML = `${tot + number}`
      }
    }else if(data == 2){
      total1.innerHTML = `${tot + number}`
      input1.value = `${number}`
    }else if(data == 0 && input1.value != "0"){
      number = number + 1
      input1.value = `${number}`
      if(tot + number >= 0){
      total1.innerHTML = `${tot + number}`
    }}
    if(state == "0"){
      var input = <HTMLInputElement> document.getElementById(`text-0-${id}-${index}`);
      var btnsave = <HTMLInputElement> document.getElementById(`save-${id}-${index}`);
      if(Number(btnsave.value) == Math.abs(Number(input1.value))){
        input.disabled = true
        btnsave.style.display = "none"
      }else{
        input.disabled = false
        btnsave.style.display = "flex"
        btnsave.style.justifyContent = "center"
      }
    }
  }
  validate(data:any){
    const dialogRef = this.dialog.open(ValidatePasswordComponent, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(result => {

    })
  }
  update_dev(data:any,index:number, name:string, state:string){
    var id = `1-${data.lote_prod}-${index}`;
    var nstate = <HTMLInputElement> document.getElementById("v-"+id)
    var icon = <HTMLInputElement> document.getElementById("ic-"+id)
    var menos = <HTMLDivElement> document.getElementById("me-"+id)
    var mas = <HTMLDivElement> document.getElementById( "ma-"+id)
    var numberi = <HTMLInputElement> document.getElementById("input-"+id)
    var inpút = <HTMLTextAreaElement> document.getElementById( "t-"+id)
    console.log(`t-${state}-${data.lote_prod}-${index}`)
    if(inpút.value.trim().length > 3){
      var module = localStorage.getItem("module_name")|| " Sobrantes"
      const dialogRef = this.dialog.open(ValidatePasswordComponent, {
        width: '250px'
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          var input = <HTMLInputElement> document.getElementById(`${name}-${state}-${data.lote_prod}-${index}`);
          var number:number = Number(input.value)
          var ArrDevos = {
            lote_prod:  data.lote_prod,
            finit:      data.finit,
            ffin:       new Date(), 
            observ_dev: inpút.value.trim(), 
            cant:       data.cant, 
            cant_dev:   number, 
            total:      data.cant - Math.abs(number), 
            campo:      data.campo,
            campoA:     data.campoA,
            campoB:     data.campoB
          }
          this.returssvc.putSobDevs(data.lote_prod, ArrDevos, data.campo).subscribe({
            next:()=>{
              icon.innerHTML = "edit"
              nstate.value = "false"
              mas.style.display = "none"
              menos.style.display = "none"
              numberi.disabled = true
              inpút.disabled = true
              numberi.style.marginRight = "20%"
              input.disabled = true
              this.load_dev()
              this.auditoriasvc.saveaudit("Actualizo la devolucion " +  data.lote_prod, module)
              this.toast.fire({
                icon: 'success',
                title: 'Actualizada con exito'
              })
            },error:()=>{
              this.toast.fire({
                icon: 'error',
                title: 'Error al actualizar la devolucion'
              })
            }
          })
        }
      })
    }else{
      inpút.focus()
      this.toast.fire({
        icon: 'error',
        title: 'Ingrese un motivo valido'
      })
    }
  }
  delete_dev(lote_prod:string, lot:string){
    var module = localStorage.getItem("module_name")|| " Sobrantes"
    var token = sessionStorage.getItem("Code_user") || "undefined";
    const dialogRef = this.dialog.open(ValidatePasswordComponent, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.returssvc.deletehistunit(token, lote_prod, lot).subscribe({
          next:()=>{
            this.auditoriasvc.saveaudit("Borro la devolucion " +  lote_prod, module)
              this.load_dev()
              this.toast.fire({
                icon: 'success',
                title: 'Borrado con exito'
              })
          }, error:()=>{
            this.toast.fire({
              icon: 'error',
              title: 'Se produjo un error al eliminar'
            })
          }
        })
      }
    })
  }
  search(){
    this.arrDev = []
    this.arrLotes = []
    var input = <HTMLInputElement> document.getElementById("input-code")
    var codestring = input.value.trim()
    var value = codestring.split("_")
    if(value.length == 5 || value.length == 6){
      if(value.length == 5){
        var slice = codestring.slice(0, codestring.length-4)
        this.returssvc.getLoteUnit(slice, "void", 1).subscribe({
          next:(x)=>{
            var arr:any = x
            //console.log(x)
            var myarr:any = []
            for(let i = 0; i < arr.length; i++){
              if(arr[i].cant_dev == 0 || arr[i].cant_dev == null){
                myarr.push(arr[i])
              }
              var newnum = i + 1
              if(newnum == arr.length){
                if(myarr.length == 1){
                  this.arrDev = myarr
                }else if(myarr.length == 0){
                  this.toast.fire({
                    icon: 'error',
                    title: 'Codigo no existe'
                  });
                  this.router.navigate(["/rule"])
                }else{
                  this.arrLotes = myarr
                }
            }
          }
          }, error:()=>{
            this.toast.fire({
              icon: 'error',
              title: 'Erro al buscar el cosdigo'
            });
          }
        })
      }else{
        this.returssvc.getLoteUnit(codestring, "void", 1).subscribe({
          next:(x)=>{
            var marr:any = x
            console.log(x)
            if(marr.length == 1){
              this.arrDev = marr
            }else if(marr.length == 0){
              this.toast.fire({
                icon: 'error',
                title: 'Codigo no existe'
              });
              this.router.navigate(["/rule"])
            }
          }, error:()=>{
            this.toast.fire({
              icon: 'error',
              title: 'Erro al obtener el cosdigo'
            });
          }
        })
      }
    }else{
      this.toast.fire({
        icon: 'error',
        title: 'El codigo es invalido'
      });
    }
  }
  selectdev(data:any){
    this.arrLotes = []
    this.arrDev = []
    this.arrDev.push(data)
  }
  selectdeli(data:String){
    return data.split(".")[0].toString().replace("D", "")
  }
  selectlot(data:String){
    return Number(data.split(".")[1])
  }
  nexttab(){
    var items = <HTMLDivElement> document.getElementById("tab")
    items.style.opacity = "0"
    items.style.transform = "scale(0.8)"
    setTimeout(() => {
      this.router.navigate(["./spa"])
    }, 300);
  }
  save_dev(data:any, input:string){
    var module = localStorage.getItem("name_module") || "Devoluciones"
    var motives1 = <HTMLInputElement> document.getElementById(input)
    var semana = ""
    var sem = data.hacienda_tag.split("_")
    if(sem.length == 5){ semana = sem[2].split(".")[1]
    }else{ semana = sem[3] }
    var motive = motives1.value.trim()
      if(motive.length >= 2){
      var ArrDevos = {
        lote_prod:  data.hacienda_tag,
        finit:      data.finit,
        ffin:       new Date(), 
        observ_dev: motive, 
        cant:       data.cantidad, 
        cant_dev:   Math.abs(this.cantarest), 
        total:      data.cantidad - Math.abs(this.cantarest), 
        campo:      data.codec_lotes,
        campoA:     data.hacienda,
        campoB:     semana 
      }
      this.returssvc.saveSobDevs(ArrDevos).subscribe( y => {
        this.auditoriasvc.saveaudit("Agrego devoluciones a " +  data.lote, module)
        var input = <HTMLInputElement> document.getElementById("input-code")
        input.value = ""
        input.focus()
        this.router.navigate(["/rule"])
        this.cantarest = 0
        this.load_dev()
        this.arrLotes = []
        this.arrDev = []
        this.toast.fire({
          icon: 'success',
          title: 'Agregado con exito'
        })
        motives1.value = ""
        this.cantarest = 0
      }, (e) => {
        this.toast.fire({
          icon: 'error',
          title: 'Error al guardar'
        })
      })
      }else{
        this.toast.fire({
          icon: 'error',
          title: 'Ingrese un motivo valido'
        })
    }
  }
  changeorder(value:string){
    var element = <HTMLDivElement> document.getElementById(this.value_order)// Quitamos el icono antiguo
    element.innerHTML = ""
    if(this.state_order == "ASC"){
      this.state_order = "DESC";this.icon_order = "expand_less";
    }else{
      this.state_order = "ASC"; this.icon_order = "expand_more" 
    }
    this.value_order = value
    var element = <HTMLDivElement> document.getElementById(value) // Agregamnos el nuevo icono
    element.innerHTML = this.icon_order
    localStorage.setItem("R_order_state", this.state_order);
    localStorage.setItem("R_order_value", this.value_order); //Guarda en local storage el orden
    this.load_dev()// Aqui se llama la api para volver a cargar los datos
  }
}
