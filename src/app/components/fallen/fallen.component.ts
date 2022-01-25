import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuditoryService } from 'src/app/services/auditory.service';
import { FallenService } from 'src/app/services/fallen.service';
import Swal from 'sweetalert2';
import { ValidatePasswordComponent } from '../validate-password/validate-password.component';

@Component({
  selector: 'app-fallen',
  templateUrl: './fallen.component.html',
  styleUrls: ['./fallen.component.css']
})
export class FallenComponent implements OnInit {
  option = ""
  totalrec = 0
  totalcai = 0
  code_use = ""
  finit = ""
  cantidad = 0
  cant_dev = 0
  totalStock = 0
  cant_cosecha = 0
  codec_lotes = ""
  secuencia = 0
  arraytem:any = []
  arrhaciendasa:any = []
  arrayrec:any = []
  arraycai:any = []
  arrLotes:any = []
  Global_data:any = []
  Global_code:any = ""
  loading_search = false
  loading_report = false
  title_option = ""
  show_select = true
  selection_mode = false
  motive_use = "Motivo"
  motivedesc_use = "Selecione un motivo"
  isselect = false
  arr_motives:any = []
  state_menu = false
  token = ""
  formmotiv = this.formBuilded.group({
    motive: [, [Validators.required, Validators.minLength(3)]],
    description: [, [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
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
  constructor(private formBuilded:FormBuilder, private router:Router,private auditoriasvc:AuditoryService, private fallensvc:FallenService, private dialog:MatDialog) { }

  ngOnInit(): void {
   this.token = sessionStorage.getItem("Code_user") || "";
   this.load_motives()
   this.load_rec()
  }
  load_rec(){
    this.arrayrec = []
    this.arraycai = []
    this.totalrec = 0
    this.totalcai = 0
    this.fallensvc.loaddata("0", "codec_recu").subscribe( m => {
      this.arraytem = m
      console.log(m)
      this.arrhaciendasa = []
      for (let i = 0; i < this.arraytem.length; i++) {
        var code = this.arraytem[i].codec_recu.split("_")
        this.arrhaciendasa.push(code[1])
        if(this.arraytem[i].tipo == "rec"){
          this.totalrec = this.totalrec + Number(this.arraytem[i].num_recu)
          this.arrayrec.push(this.arraytem[i])
        }else{
          this.totalcai = this.totalcai + Number(this.arraytem[i].num_recu)
          this.arraycai.push(this.arraytem[i])
        }
        var d = i + 1
        if(d == this.arraytem.length){this.load_secuencia();this.validate()}
      }
      
    }, ()=>{
      this.toast.fire({
        icon: 'error',
        title: 'Reintente mas tarde'
      })
    })
  }
  deletehist(id:number, codee:string){
    var module = localStorage.getItem("module_name")|| " Sobrantes"
    var token = sessionStorage.getItem("Code_user") || "undefined";
    const dialogRef = this.dialog.open(ValidatePasswordComponent, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.fallensvc.deleteitemhis(id).subscribe( x => {
          this.auditoriasvc.saveaudit("Borro el item "+codee, module)
          this.toast.fire({
            icon: 'success',
            title: 'Eliminado con exito'
          })
          this.load_rec()
        }, (err) =>{
          this.toast.fire({
            icon: 'error',
            title: 'Error al eliminar'
          })
        })
      }})
  }
  load_secuencia(){
    for(let i = 0;i < this.arraytem.length;i++){
      var intearr = this.arraytem[i].codec_recu.split("_")
      var number = Number(intearr[intearr.length - 1])
      if(number > this.secuencia){
        this.secuencia = number
      }
    }
  }
  validate(){
    setTimeout(() => {
      var data = this.arrhaciendasa.find((x:any)=>x == this.codec_lotes)
      if(data != undefined){
        this.toast.fire({
          icon: 'error',
          title: 'codigo ya registrado'
        })
        this.router.navigate(["./error_outline"])
      }
    }, 1000);
  }
  async search(){
    var input = <HTMLInputElement> document.getElementById("input-code")
    var value = input.value.trim().split("_")
    this.clear_cache()
    this.Global_code = await this.min_code(input.value.trim())
    if(value.length == 5 || value.length == 6){
      this.loading_search = true
      this.fallensvc.getLoteUnit(this.Global_code, "void", "1", "ASC").subscribe({
        next:async (x:any)=>{
          if(x.length == 0){this.no_item()}
          var subitem:any = await this.filter_valid(x)
          if(subitem.length == 0){this.no_item()}
          var items:any = await this.filter_nouse(subitem)
          this.loading_search = false
          if(items.length == 1){
            this.use_date(items[0])
          }else if(items.length > 1){
            this.arrLotes = items
          }else{
            this.loading_search = false
            this.toast.fire({
              icon: 'error',
              title: 'No tiene cosecha'
            });
          }
        }, error:()=>{
          this.no_item()
        }
      })
    }else{
      this.toast.fire({
        icon: 'error',
        title: 'No se encuentra el codigo'
      });
    }
  }
  no_item(){
    var input = <HTMLInputElement> document.getElementById("input-code")
    input.value = ""
    this.clear_cache()
    this.loading_search = false
    this.toast.fire({
      icon: 'error',
      title: 'Codigo no encontrado'
    });
  }
  min_code(data:String){
    return new Promise((resolve, reject) =>{
      var arrtotal = data.split("_")
      var arrnumber = arrtotal.length - 1
      var newcode = ""
      for(let i = 0; i < arrnumber; i++){
          if(i == 0){newcode = arrtotal[i]}else{newcode = newcode + "_" + arrtotal[i]}
          if(i == Number(arrnumber-1)){resolve(newcode)}
      }
    })
  }
  filter_valid(array:any){
    return new Promise((resolve, reject) =>{
      var arr = []
      for(let i = 0; i < array.length; i++){
        if(array[i].cant_cosecha){arr.push(array[i])}
        if(i == Number(array.length-1)){resolve(arr)}
      }
    })
  }
  filter_nouse(array:any){
    return new Promise((resolve, reject) =>{
      var arr = []
      var data = ""
      for(let i = 0; i < array.length; i++){
        var code = array[i].hacienda_tag
        var vcode = code.split("_")
        if(vcode.length == 5){          
          data = vcode[0] + "_" + vcode[1] + "_" + array[i].codec_lotes + "_" + vcode[2].split(".")[1] + "_" + vcode[3]
        }else{
          data = code
        }
        var resul = this.arraytem.find((x:any)=>x.token_user == data)
        if(resul == undefined){arr.push(array[i])}
        if(i == Number(array.length-1)){resolve(arr)}
      }
    })
  }
  selectdeli(data:String){
    return data.split(".")[0].toString().replace("D", "")
  }
  selectlot(data:String){
    return Number(data.split(".")[1])
  }
  use_date(data:any){
    this.arrLotes = []
    this.Global_data = data
    var vcode = this.Global_code.split("_")
    if(vcode.length == 4){
      this.Global_data.mhacienda = this.Global_data.codec_lotes;
      this.Global_data.msemana = vcode[2].split(".")[1];
      this.Global_code = vcode[0] + "_" + vcode[1] + "_" + this.Global_data.mhacienda + "_" + this.Global_data.msemana + "_" + vcode[3]
    }
    var result = this.arraytem.find((x:any)=>x.token_user == this.Global_code)
    if(result != undefined){
      this.clear_cache()
      this.toast.fire({
        icon: 'error',
        title: 'Codigo ya ingresado'
      })
    }else{
      this.finit        = this.Global_data.finit
      this.cantidad     = this.Global_data.cantidad
      this.cant_dev     = this.Global_data.cant_dev
      this.totalStock   = this.Global_data.totalStock
      this.cant_cosecha = this.Global_data.cant_cosecha
      this.codec_lotes  = this.Global_data.codec_lotes
      this.code_use     = this.Global_data.hacienda_tag
    }
  }
  clear_cache(){
    this.arrLotes = []
    this.Global_code = ""
    this.Global_data = {}
    this.finit = ""
    this.cantidad = 0
    this.cant_dev = 0
    this.totalStock = 0
    this.cant_cosecha = 0
    this.codec_lotes = ""
    this.code_use = ""
  }
  menu_action(){
    this.state_menu = !this.state_menu
  }
  select_mode(state:boolean){
    var change_btn = <HTMLDivElement> document.getElementById("change_btn")
    var punt = <HTMLDivElement> document.getElementById("titlepunt")
    var text = <HTMLDivElement> document.getElementById("titletext")
    this.selection_mode = state
    this.show_select = false
    if(state){
      this.option = "cai"
      punt.style.background = "#e29420"
      text.style.color = "#e29420"
      change_btn.style.background = "#ff4116"
      this.title_option = "Caído"
    }else{
      this.option = "rec"
      text.style.color = "#e93912"
      punt.style.background = "#e93912"
      change_btn.style.background = "#ffa826"
      this.title_option = "Recusado"
    }
  }
  select_item(title:string, text:string){
    if(this.isselect){
      this.motive_use = title 
      this.motivedesc_use = text
      this.state_menu = false
      this.isselect = false
    }
  }
  savedata(){
    var datamotive = ""
    if(!this.selection_mode){
      if(this.motivedesc_use == "Selecione un motivo" || this.motivedesc_use == ""){
        this.toast.fire({
          icon: 'error',
          title: 'selecione algun motivo'
        })
      }else{
        datamotive = this.motivedesc_use
        this.savedata_2(datamotive)
      }
    }else{
      this.savedata_2(datamotive)
    }

  }
  savedata_2(datamotive:string){
    this.loading_report = true
    var module = localStorage.getItem("module_name")|| " Sobrantes"
    var today = new Date()
    var secuen = this.secuencia + 1
    var codex = this.option.toUpperCase() + "_" + this.codec_lotes + "_" + secuen.toString().padStart(4,"0");
    var cant_rec = this.totalStock - this.cant_cosecha
    var model = {
      observer_recu: datamotive,
      num_recu: Number(cant_rec.toString().replace("-", "")),
      date: today, 
      motivo: this.title_option,
      token_user: this.Global_code, 
      tipo: this.option,
      codec_recu: codex,
      seman: this.Global_data.msemana,
      lote_prod: this.Global_data.hacienda_tag
  }
  this.fallensvc.savedata(model).subscribe({
    next:()=>{
    this.loading_report = false
      this.auditoriasvc.saveaudit("Reporto la semana "+this.Global_data.msemana+" y genero el reporte "+codex, module)
      this.load_rec()
      var input = <HTMLInputElement> document.getElementById("input-code")
      input.value = ""
      this.clear_cache()
      this.toast.fire({
        icon: 'success',
        title: 'Guardado con exito'
      })
    }, error:()=>{
    this.loading_report = false
      this.toast.fire({
        icon: 'error',
        title: 'Error al reportar'
      })
    }
  })
  }
  load_motives(){
    var order = "asc"
    this.fallensvc.loaddata_mot(this.token, order).subscribe( x => {
      this.arr_motives = x;
    }, (err)=>{
      this.toast.fire({
        icon: 'error',
        title: 'Error al cargar la lista'
      })
    })
  }
  delete_motive(id:number){
    this.fallensvc.deletedata(id, this.token).subscribe( x => {
      this.load_motives();
      this.toast.fire({
        icon: 'success',
        title: 'Eliminado con exito'
      })
    }, (errr)=>{
      this.toast.fire({
        icon: 'error',
        title: 'Error al eliminar la lista'
      })
    })
  }
  save_motive(){
    if(this.formmotiv.valid){
      var module = localStorage.getItem("module_name")|| " Sobrantes"
      var date = new Date();
        let arrLog: any = {      
          name_mot:  this.formmotiv.get("motive")?.value,
          descrip_mot: this.formmotiv.get("description")?.value,
          date: date,
          token_session: this.token
        }
        this.fallensvc.senddata(arrLog).subscribe( x => {
          this.auditoriasvc.saveaudit("Borro motivo ", module)
          this.load_motives();
          this.formmotiv.reset()
          this.toast.fire({
            icon: 'success',
            title: 'Guardado con exito'
          })
        }, (errr)=>{
          this.toast.fire({
            icon: 'error',
            title: 'Error al cargar la lista'
          })
        })
      }else{
        this.toast.fire({
          icon: 'error',
          title: 'Ingresa datos validos'
        })
      }
  }
}