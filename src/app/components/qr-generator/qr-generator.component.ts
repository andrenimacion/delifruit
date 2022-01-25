import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as qrcode from 'qrcode-generator';
import { AuditoryService } from 'src/app/services/auditory.service';
import { CalendarService } from 'src/app/services/calendar.service';
import { QrGeneratorService } from 'src/app/services/qr-generator.service';
import { ReturnsService } from 'src/app/services/returns.service';
import { StatesService } from 'src/app/services/states.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-qr-generator',
  templateUrl: './qr-generator.component.html',
  styleUrls: ['./qr-generator.component.css']
})
export class QrGeneratorComponent implements OnInit {

  state_order = "DESC" // Si es ASC o DESC
  value_order = "finit" // El valor por el q se va a order.. ejemp: id, color, etc
  icon_order = "expand_more" // Es el icono del estado del orden
  loading_gen = false
  year = new Date().getFullYear()
  code_master = ""
  loading = true
  codesqr:any = []
  arrqr:any = []
  lots:any = []
  states:any = []
  weeks:any = []
  tag = ""
  week = ""
  colorhex = ""
  cantidad = ""
  cantglobal = 0
  loadingadd = false
  Global_data:any = []
  showprint = false
  hacienda = ""
  Global_state = 1
  name_hacienda = ""
  firstFormGroup = this.formBuilder.group({
    hacienda: [null, Validators.required],
    lote: [null, Validators.required],
  });
  secondFormGroup = this.formBuilder.group({
    semana:    ['', Validators.required],
    inputyear: [`${this.year}`, [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern('[0-9]*')]],
  });
  threeFormGroup = this.formBuilder.group({
    cant: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(4), Validators.pattern('[0-9]*')]],
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
  arrstates: any = [{value:"1", name:"Activos"}, {value:"0", name:"Inactivos"}];
  state = new FormControl( Validators.required);  
  constructor(private formBuilder:FormBuilder, private returssvc:ReturnsService,private auditoriasvc:AuditoryService,private qrcodesvc:QrGeneratorService, private statatessvc:StatesService, private calendarsvc:CalendarService, private router:Router) { }
  @ViewChild('formDirective') formDirective: any;
  ngOnInit(): void {
    this.state_order = localStorage.getItem("Qr_order_state") || "DESC";
    this.value_order = localStorage.getItem("Qr_order_value") || "finit"; 
    this.loadweeks()
    this.listcodqr()
  }
  create_code_master(id:number){
    if(id == 1){
      this.code_master = this.tag
    }else if (id == 2){
      this.code_master = this.tag + "_" + this.hacienda
    }else if(id == 3){
      this.code_master = this.tag + "_" + this.hacienda + "_" + this.week
    }else if (id == 4){
      this.code_master = this.tag + "_" + this.hacienda + "_" + this.week + "_" + this.year
    }else if (id == 5){
      this.code_master = this.tag + "_" + this.hacienda + "_" + this.week + "_" + this.year + "_" + this.cantidad
    }
  }
  select_state(){
    this.Global_state = Number(this.state.value)
    this.listcodqr()
  }
  print(){
    var module = localStorage.getItem("name_module") || "QrCode"
    var ficha = <HTMLDivElement> document.getElementById("pageqr");
    let ventimp: any = window.open(' ', 'popimpr');
    ventimp.document.write( ficha.innerHTML );
    ventimp.document.close();
    ventimp.print();
    ventimp.close();
    Swal.fire({
      title: 'Imprimir los codigos?',
      text: "Confirme que ah podido realizar con exito la impresion de los codigos!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!'
    }).then((result) => {
      if (result.isConfirmed) {
        var arrAudit = {
          user_name:          this.Global_data.user_name,
          finit:              this.Global_data.finit,
          ffin:               this.Global_data.ffin,
          codec_lotes:        this.Global_data.codec_lotes,
          hacienda_tag:       this.Global_data.hacienda_tag,
          codec_lotes_master: this.Global_data.codec_lotes_master,
          cantidad:           this.Global_data.cantidad,
          token_user:         this.Global_data.token_user,
          codec_color:        this.Global_data.codec_color,
          seman:              this.Global_data.seman,
          estado:             0,
          id:                 this.Global_data.id,
        }
        console.log(arrAudit)
        this.qrcodesvc.update_qr(this.Global_data.id.toString().trim(), arrAudit).subscribe({
          next:()=>{
            this.auditoriasvc.saveaudit("Se cambio a Inactivo el codigo Qr " +  this.Global_data.hacienda_tag, module)
            this.toast.fire({
              icon: 'success',
              title: 'Se cambio el estado'
          })
          this.listcodqr()
          }, error:()=>{
            this.toast.fire({
              icon: 'error',
              title: 'Error al cambiar el estado'
          })
          }
        })
      }
    })
  }
  selectweek(color:string, sema:string){
    this.week = sema
    this.colorhex = color
    this.create_code_master(3)
  }
  
  generatecodex(data:any){
    this.Global_data = data
    var value = data.hacienda_tag
    var color = data.name_labor
    var codex = value.split("_")
    var cant = codex[codex.length - 1]
    var cantn = Number(cant)
    this.cantglobal = cantn
    this.arrqr = []
    this.toast.fire({
        icon: 'success',
        title: 'Generando los codigos QR'
    })
    if(color == null){color = "Cinta Blanca"}
    var arraycolor = color.trim().split(" ")
    var color2 = arraycolor[1]
    var heigthb = 120
    var contador = 0
    for(let i = 1; i <= cantn; i++){
      var newcant = i.toString().padStart(4,'0');
      var tag = value.slice(0, value.length-4) + newcant
      if(contador == 2){
        heigthb = heigthb + 10
        contador = 0;
      }else{
        heigthb = 120
        contador = contador + 1
      }
      this.arrqr.push({heigth: heigthb + "px",code: newcant, color: color2, data: this.createQR(tag)})
      if(i == cantn){this.showprint = true}
    }

  }

  createQR(tag:string):string{
        var qr = qrcode(0, 'M');
        qr.addData(`${tag}`);
        qr.make();
        return `${qr.createDataURL(3, 0)}`;
  }
  loadweeks() {
    this.loadingadd = true
    this.calendarsvc.getDp08acal("ASC", "2022", "anio").subscribe({
      next: (a)=>{
        this.weeks = a
        this.statatessvc.getFilterHac('HCIE_GR', "b").subscribe({
          next: (b)=>{
            this.loadingadd = false
            this.states = b
          }, error:(a)=>{
            this.loadingadd = false
            this.toast.fire({
              icon: 'error',
              title: 'Error al obtener las haciendas'
            })
          }
        })
      }, error:()=>{
        this.loadingadd = false
        this.toast.fire({
          icon: 'error',
          title: 'Error al obtener las semanas'
        })
      }
    })
  }
  loadlots(value:string, tag:string){
    this.tag = tag.trim()
    this.create_code_master(1)
    this.loadingadd = true
    this.statatessvc.getFilterHac(value, "a").subscribe({
      next: (c)=>{
        this.name_hacienda = value
        this.loadingadd = false
        this.lots = c
      }, error:(a)=>{
        this.loadingadd = false
        this.toast.fire({
          icon: 'error',
          title: 'Error al obtener los lotes'
        })
      }
    })
  }
  notlots(){
    if(this.tag == ""){
      this.toast.fire({
        icon: 'error',
        title: 'Selecione una hacienda'
      })
    }else if(this.tag != "" && this.lots.length == 0){
      this.toast.fire({
        icon: 'error',
        title: 'No tiene lotes disponibles'
      })
    }
  }
  generateBarcode(steper:any){
    if(!this.loading_gen){
      if(this.firstFormGroup.valid){
        if(this.secondFormGroup.valid){
          if(this.threeFormGroup.valid){
            this.loading_gen = true
            this.create_code_master(5)
            this.toast.fire({
              icon: 'warning',
              title: 'Generando los codigos..'
            })
            var module = localStorage.getItem("name_module") || "QrCode"
            const usx:  any = sessionStorage.getItem('User_Name') || "undefilned";
            var mdate = new Date()
              var arrAudit = {
                user_name:          usx,
                finit:              mdate,
                ffin:               mdate,
                codec_lotes:        this.hacienda,
                hacienda_tag:       this.code_master,
                codec_lotes_master: this.tag,
                cantidad:           Number(this.cantidad),
                token_user:         sessionStorage.getItem('Code_user'),
                codec_color:        this.colorhex,
                seman: this.week,
                estado: 1
              }
              this.auditoriasvc.saveaudit("Creo codigos Qr  " +  this.code_master, module)
              this.qrcodesvc.saveAuditPrint(arrAudit).subscribe({
                next: ()=>{
                  var ArrDevos = {
                    lote_prod:  this.code_master,
                    finit:      mdate,
                    ffin:       new Date(), 
                    observ_dev: "", 
                    cant:       Number(this.cantidad), 
                    cant_dev:   0, 
                    total:      Number(this.cantidad),
                    campo:      this.hacienda,
                    campoA:     this.name_hacienda ,
                    campoB:     this.week
                  }
                  this.returssvc.saveSobDevs(ArrDevos).subscribe({
                    next:()=>{
                      this.loading_gen = false
                      this.auditoriasvc.saveaudit("Agrego devoluciones a " +  this.code_master, module)
                      this.listcodqr()
                      steper.reset()
                      this.hacienda = ""
                      this.colorhex = ""
                      this.code_master = ""
                      this.formDirective.resetForm();
                      this.secondFormGroup.get("inputyear")?.setValue(`${this.year}`)
                      this.toast.fire({
                        icon: 'success',
                        title: 'Creado con exito'
                      })
                    }, error:()=>{
                      this.loading_gen = false
                      this.toast.fire({
                        icon: 'error',
                        title: 'Error al crear la devolucion'
                      })
                    }
                  })
                },error:()=>{
                  this.loading_gen = false
                  this.toast.fire({
                    icon: 'error',
                    title: 'Error al crear etiquetas'
                  })
                }
              })
          }else{
            steper.previous();
            this.toast.fire({
              icon: 'error',
              title: 'Verifique los datos ingresados'
            })
          }
        }else{
          steper.previous().previous();
          this.toast.fire({
            icon: 'error',
            title: 'Verifique los datos ingresados'
          })
        }
      }else{
        this.toast.fire({
          icon: 'error',
          title: 'Verifique los datos ingresados'
        })
      }
    }else{
      this.toast.fire({
        icon: 'error',
        title: 'Se esta generando los codigos'
      })
    }
  }
  report(code:string){
    var items = <HTMLDivElement> document.getElementById("tab")
    items.style.opacity = "0"
    items.style.transform = "scale(0.8)"
    setTimeout(() => {
      this.router.navigate(["./rule/", code])
    }, 300);
  }
  updateyear(){
    this.year = this.secondFormGroup.get("inputyear")?.value
    this.create_code_master(4)
  }
  selectlot(data:string){
    this.hacienda = data.trim()
    this.create_code_master(2)
  }
  listcodqr() {
    this.loading = true
    var user = sessionStorage.getItem("User_Name") || "undefined"
    this.qrcodesvc.getAuditPrint(user, this.state_order, this.value_order).subscribe({
      next: (y)=>{
        //console.log(y)
        this.loading = false
        var allarr:any = y
        this.codesqr = [] 
        for(let i =0;i<allarr.length;i++){
          if(allarr[i].estado == this.Global_state){
            this.codesqr.push(allarr[i])
          }
        }
      }, error:()=>{
        this.loading = false
        this.toast.fire({
          icon: 'error',
          title: 'Error al obtener los codigos'
        })
      }
    })
  }
  changecant(){
    var cant = this.threeFormGroup.get("cant")?.value
    this.cantidad = cant.toString().padStart(4,'0');
    this.create_code_master(5)
  }
  deletecodeqr(id:string, name:string, lot:string){
    var token = sessionStorage.getItem("Code_user") || "undefined";
    this.loading = true
    var module = localStorage.getItem("name_module") || "Qrcode"
    this.calendarsvc.deleteqrlote("id", id).subscribe((x)=>{
      this.auditoriasvc.saveaudit("Borro los codigos Qr  " +  name, module)
      this.returssvc.deletehistunit(token, name, lot).subscribe({
        next:()=>{
          this.auditoriasvc.saveaudit("Borro la devolucion " +  name, module)
          this.listcodqr()
          this.toast.fire({
            icon: 'success',
            title: 'Borrado con exito'
          })
        }, error:()=>{
          this.loading = false
          this.toast.fire({
            icon: 'error',
            title: 'Se produjo un error al eliminar'
          })
        }
      })
    },err=>{
      this.loading = false
      this.toast.fire({
        icon: 'error',
        title: 'Error al eliminar el elemento'
      })
    })
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
    localStorage.setItem("Qr_order_state", this.state_order);
    localStorage.setItem("Qr_order_value", this.value_order); //Guarda en local storage el orden
    this.listcodqr() // Aqui se llama la api para volver a cargar los datos
  }
}
