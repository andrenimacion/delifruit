import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuditoryService } from 'src/app/services/auditory.service';
import { CalendarService } from 'src/app/services/calendar.service';
import { ColorService } from 'src/app/services/color.service';
import { HarvestService } from 'src/app/services/harvest.service';
import { StatesService } from 'src/app/services/states.service';
import Swal from 'sweetalert2';
import { ListHarvestComponent } from '../list-harvest/list-harvest.component';

@Component({
  selector: 'app-harvest',
  templateUrl: './harvest.component.html',
  styleUrls: ['./harvest.component.css']
})
export class HarvestComponent implements OnInit {

  h_developer = false
  state_order = "ASC" // Si es ASC o DESC
  value_order = "f_cosecha" // El valor por el q se va a order.. ejemp: id, color, etc
  icon_order = "expand_more" // Es el icono del estado del orden
  loading_tab = false
  loading = false
  arrLotes:any = []
  arrharvest:any = []
  arrcaidos:any = []
  arrdata:any = []
  Global_cont = 0
  Global_total = 0
  Global_total_2 = 0
  code_use = ""
  Global_cai = 0
  semana = ""
  color = ""
  placeholder = "ABC_123"
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
  constructor(private router:Router, private statessvc:StatesService,  private colorsvc:ColorService,private calendarsvc:CalendarService, private statesvc:StatesService,private harvestsvc:HarvestService, private auditoriasvc:AuditoryService, private dialog:MatDialog) { }

  ngOnInit(): void {
    var input = <HTMLInputElement> document.getElementById("input-code")
    input.focus()
    this.Global_total_2= Number(localStorage.getItem("Global_total_2")) || 0
    this.Global_total = Number(localStorage.getItem("H_Global_total")) || 0
    this.Global_cont = Number(localStorage.getItem("H_Global_cont")) || 0
    this.code_use = localStorage.getItem("H_code_use") || ""
    var arrcaistring = localStorage.getItem("H_arrcaidos") || "[]"
    this.arrcaidos = JSON.parse(arrcaistring)
    var arrdatastring = localStorage.getItem("H_arrdata") || "[]"
    this.arrdata = JSON.parse(arrdatastring)
    this.semana = localStorage.getItem("H_semana") || ""
    this.color = localStorage.getItem("H_color")|| ""
    this.state_order = localStorage.getItem("H_order_state") || "DESC";
    this.value_order = localStorage.getItem("H_order_value") || "f_cosecha"; 
    this.contar_caidos()
    this.loadcosechas()
    if(localStorage.getItem("h_developer") && this.Global_total > 0){this.h_developer = true}
    
  }
  contar_caidos(){
    this.Global_cai = 0
    for(let i = 0;i < this.arrcaidos.length;i++){
      if(this.arrcaidos[i].state){
        this.Global_cai = this.Global_cai + 1
      }
    }
  }
  change_q(){
    var input = <HTMLInputElement> document.getElementById("h_developer")
    if(Number(input.value) < this.Global_total && Number(input.value) > 0){
      this.Global_cont = Number(input.value)
      console.log(Number(input.value))
    }else{
      this.toast.fire({
        icon: 'error',
        title: 'No se puede ingresar mas de la cantidad'
      });
    }
  }
  contador(){
    var module = localStorage.getItem("name_module") || "Harvest"
    var input = <HTMLInputElement> document.getElementById("input-code")
    var codestring = input.value.trim()
    var value = codestring.split("_")
    var length = value.length 
    if(length == 5 || length == 6){
        var code = ""
        for(let i = 0;i < length - 1;i++){code += value[i] + "_" }
        if(code == this.code_use || this.code_use == ""){
          var cant = Number(value[value.length - 1])
          if(this.Global_total == 0){this.search(codestring)}else{
            var search = this.arrcaidos.find((x:any)=>Number(x.codigo) == cant)
            if(cant <= this.Global_total_2 && cant > 0){
              if(search == undefined){
                this.Global_cont = this.Global_cont + 1
                localStorage.setItem("H_Global_cont", this.Global_cont.toString())
                input.value = ""
                var codigo = value[value.length - 1].toString().padStart(4, "0")
                this.arrcaidos.push({codigo:codigo, state:false, date:new Date()})
                this.auditoriasvc.saveaudit("Cosecho " + this.code_use + codigo, module)
                localStorage.setItem("H_arrcaidos", JSON.stringify(this.arrcaidos))
              }else{
                input.value = ""
                this.toast.fire({
                  icon: 'error',
                  title: 'Codigo ya ingresado'
                });
              }
            }else{
              input.value = ""
              this.toast.fire({
                icon: 'error',
                title: 'No existe en el stock'
              });
            }
          }
        }else{
          this.toast.fire({
            icon: 'error',
            title: 'No se puede agregar un lote diferente'
          });
        }
      }else{
        this.arrLotes = []
        this.toast.fire({
          icon: 'error',
          title: 'Codigo Invalido'
        });
      }
  }
  select_fallen(){
    const dialogRef = this.dialog.open(ListHarvestComponent, {
      width: '300px',
      data: {arr:  this.arrcaidos, inuse: this.code_use, data:this.arrdata},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result != undefined){
        this.arrcaidos = result
        localStorage.setItem("H_arrcaidos", JSON.stringify(this.arrcaidos))
        this.contar_caidos()
      }
    })
  }
  change_week(){
    this.calendarsvc.getDp08acal("ASC", "2022", "anio").subscribe({
      next: (e)=>{
        var code_Sema = ""
        var data = this.arrdata[0].hacienda_tag.split("_")
        if(data.length == 5){
          code_Sema = data[2].split(".")[1]
        }else{
          code_Sema = data[3]
        }
          var arr:any = e
          var data = arr.find((x:any) => x.sema == code_Sema)
          if(data == undefined){
            this.toast.fire({
              icon: 'error',
              title: 'No existe semana para este lote'
            });
            this.del_history()
          }else{
            this.semana = data.sema
            this.color = data.color_asign
            localStorage.setItem("H_semana", this.semana)
            localStorage.setItem("H_color", this.color)
          }
      },error:()=>{
        this.toast.fire({
          icon: 'error',
          title: 'Error al cargar los datos'
        });
      }
      })
  }
  search(codestring:string){
    this.loading = true
    var slice = codestring.slice(0, codestring.length-4)
        this.harvestsvc.getLoteUnit(slice, "void", 1).subscribe({
          next:(x)=>{
            this.loading = false
            var arr:any = x
            var myarr:any = []
            if(arr.length == 0){
              var input = <HTMLInputElement> document.getElementById("input-code")
              input.value = ""
              this.toast.fire({
                icon: 'error',
                title: 'Codigo no existe'
              });
            }
            for(let i = 0; i < arr.length; i++){
              if(arr[i].cant_cosecha == 0 || arr[i].cant_cosecha == null){
                myarr.push(arr[i])
              }
              var newnum = i + 1
              if(newnum == arr.length){
                if(myarr.length == 1){
                  this.selectcode(codestring, myarr[0])
                }else if(myarr.length == 0){ 
                  this.toast.fire({
                    icon: 'error',
                    title: 'Codigo no existe'
                  });
                }else{
                  this.arrLotes = myarr
                }
            }}
          }, error:()=>{
            this.loading = false
            this.toast.fire({
              icon: 'error',
              title: 'Codigo no encontrado'
            });
          }
        })
  }
  selectcode(codestring:string, myarr:any){
    if( myarr.totalStock > 0){
      this.arrLotes = []
      this.arrdata = []
      this.code_use = codestring.slice(0, codestring.length-4)
      this.placeholder = this.code_use
      this.Global_total = myarr.totalStock
      if(localStorage.getItem("h_developer") && this.Global_total > 0){this.h_developer = true}
      this.Global_total_2 = myarr.cantidad
      this.arrdata.push(myarr)
      localStorage.setItem("H_arrdata", JSON.stringify( this.arrdata))
      localStorage.setItem("H_code_use", this.code_use)
      localStorage.setItem("H_Global_total", this.Global_total.toString())
      localStorage.setItem("Global_total_2", this.Global_total_2.toString())
      this.contador()
    }else{
      this.toast.fire({
        icon: 'error',
        title: 'No tiene cantidad de enfunde'
      });
    }
    this.change_week()
  }
  selectdeli(data:String){
    return data.split(".")[0].toString().replace("D", "")
  }
  selectlot(data:String){
    return Number(data.split(".")[1])
  }
  delete(id:number, code:string){
    var module = localStorage.getItem("name_module") || "Harvest"
    Swal.fire({
      title: '¿Está usted seguro?',
      text: "esta acción es irreversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.harvestsvc.dcsecha( id ).subscribe( dd => { 
          this.auditoriasvc.saveaudit("Borro la cosecha " + code, module)
          this.loadcosechas()     
          this.toast.fire({
            icon: 'success',
            title: 'Borrado con exito'
          });
        })
      }
    })
  }
  save(){
    if(this.Global_total && this.semana){
      var rec = this.Global_total - this.Global_cont
      if(rec > 15){
        Swal.fire({
          title: 'Seguro desea guardar?',
          text: `Todavia tiene ${this.Global_total - this.Global_cont} pendientes`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, guardar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.loading = true
            this.save_2()
          }
        })
      }else{
        this.loading = true
        this.save_2()
      }
    }
  }
  save_2(){
    var module = localStorage.getItem("name_module") || "Harvest"
    var sin_contar = this.Global_total - this.Global_cont
    var total_caidos = this.Global_cai + sin_contar
    var cosecha = this.Global_cont - this.Global_cai
    var codearr = this.code_use.split("_")
    var scosechArr = {
          code_user: sessionStorage.getItem("Code_user"),
          cant_cosecha: cosecha,
          cortes: this.arrdata[0].totalStock,
          semana: this.semana,
          color: this.color,
          hacienda: this.arrdata[0].hacienda,
          f_cosecha: new Date(),
          cod_hacienda:  this.arrdata[0].codec_lotes,
          lote_prod: this.arrdata[0].hacienda_tag
        }
   this.harvestsvc.scosecha(scosechArr).subscribe ({
     next:(x)=> {
      this.loading = false
       var tag = this.arrdata[0].hacienda_tag
      this.toast.fire({
        icon: 'success',
        title: 'Guardado con exito'
      });
      this.auditoriasvc.saveaudit("Guardo la cosecha con " + cosecha + " cosechados en " +  this.arrdata[0].hacienda_tag, module)
      if(this.Global_cai > 0){
        Swal.fire({
          title: 'Desea reportar como caidos',
          text: `Tiene ${total_caidos} items marcado como caido`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, reportar'
        }).then((result) => {
          this.router.navigate(["./error_outline/"+ tag + "/1"])
        })
      }else{  
        if(sin_contar > 0){
          Swal.fire({
            title: 'Desea reportarlos',
            text: `Tiene ${sin_contar} items sin marcar`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, reportar'
          }).then((result) => {
            this.router.navigate(["./error_outline/"+ tag + "/0"])
          })
        }
      }
      this.del_history()
      this.loadcosechas()
     },error:()=>{
      this.loading = false
      this.toast.fire({
        icon: 'error',
        title: 'Ocurrio un error al guardar'
      });
     }
   })
  }
  manualingress(){
    var input = <HTMLInputElement> document.getElementById("input-code")
    input.value = this.code_use
    input.focus()
  }
  resetdata(){
    if(this.Global_cont > 10){
      Swal.fire({
        title: 'Seguro desea restablecer?',
        text: `Se perderan ${this.Global_cont} cosechas`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, guardar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.del_history()
        }
      })
    }else{
      this.del_history()
    }
  }
  del_history(){
    this.arrcaidos = []
    var input = <HTMLInputElement> document.getElementById("input-code")
    input.value = ""
    this.Global_cont = 0
    this.Global_total = 0
    this.code_use = ""
    localStorage.removeItem("H_Global_total")
    localStorage.removeItem("H_Global_cont")
    localStorage.removeItem("H_arrcaidos")
    localStorage.removeItem("H_arrdata")
    localStorage.removeItem("H_semana")
    localStorage.removeItem("H_color")
    localStorage.removeItem("H_code_use")
    localStorage.removeItem("Global_total_2")
    this.h_developer = false
    this.Global_total_2 = 0
    this.semana = ""
    this.color = ""
    this.Global_cai = 0
    this.arrdata = []
    this.arrcaidos = []
    this.placeholder = "ABC_123"
  }
  loadcosechas(){
    this.loading_tab = true
    this.harvestsvc.gcosecha(this.value_order, this.state_order).subscribe(x =>{
      this.loading_tab = false
      this.arrharvest = x
      console.log(x)
    }, () => {
      this.loading_tab = false
      this.toast.fire({
        icon: 'error',
        title: 'Ocurrio un error al cargar'
      });
    })
  }
  showdate(e:any, date:string){
    if(e.path[0].value == false || e.path[0].value == undefined){
      e.path[0].innerHTML = new DatePipe('en-US').transform(date, 'shortTime')
      e.path[0].value = true
    }else{
      e.path[0].value = false
      e.path[0].innerHTML = new DatePipe('en-US').transform(date, 'shortDate')
    }
  }
  nexttab(){
    var items = <HTMLDivElement> document.getElementById("tab")
    items.style.opacity = "0"
    items.style.transform = "scale(0.8)"
    setTimeout(() => {
      this.router.navigate(["./error_outline"])
    }, 300);
  }

  changeorder(value:string){
    var element = <HTMLDivElement> document.getElementById(this.value_order)// Quitamos el icono antiguo
    element.innerHTML = ""
    if(this.state_order == "ASC"){
      this.state_order = "DESC";this.icon_order = "expand_less" 
    }else{
      this.state_order = "ASC"; this.icon_order = "expand_more" 
    }
    this.value_order = value
    var element = <HTMLDivElement> document.getElementById(value) // Agregamnos el nuevo icono
    element.innerHTML = this.icon_order
    localStorage.setItem("H_order_state", this.state_order);
    localStorage.setItem("H_order_value", this.value_order); //Guarda en local storage el orden
    this.loadcosechas()// Aqui se llama la api para volver a cargar los datos
  }
}
