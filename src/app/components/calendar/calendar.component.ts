import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuditoryService } from 'src/app/services/auditory.service';
import { CalendarService } from 'src/app/services/calendar.service';
import { ColorService } from 'src/app/services/color.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  constructor(public auditoria:AuditoryService,public dialog: MatDialog,public route:Router,private gdp: CalendarService, public smas: ColorService ) { }
  tipeorder = "ffin"
  nameorder = "F. Fin"
  anios: any = ["2021", "2022", "2023"];
  public year = new Date().getFullYear();
  public _periodo: any = '';
  public _semana: any;
  public _startDate: any;
  public _endDate: any;
  public order: string = 'asc';
  public user: any;
  colorasing = "while"
  ordervalue = "DESC"
  orderstate = false
  ordericon = "expand_less"
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
  anio = new FormControl(2022, Validators.required);  
  public data_head: any;
  show = false
  ngOnInit(): void {
    this.gDP08ACAL();
  this._periodo = this.year;
  this.ghead();
  this._color   = localStorage.getItem('_color');
  this._codec_color = localStorage.getItem('_codec_color');
  var btn = <HTMLButtonElement> document.getElementById(`btncolorselect`);
  btn.style.background = this._color
  if(this._codec_color != null || this._codec_color != undefined){
    btn.innerHTML = this._codec_color
  }} 
  ghead() {
    this.data_head = localStorage.getItem('name_module');
  }

  dataPersist(nameData:string, a: string): void {
    localStorage.setItem(`${nameData}`, a);
    //return a;
  }
  changeorder(value:string, name:string){
    var element = <HTMLDivElement> document.getElementById(this.tipeorder)
    var item = `${this.nameorder}`
    element.innerHTML = item
    this.nameorder = name
    this.tipeorder = value
    if(this.orderstate){
      this.ordervalue = "DESC"
      this.ordericon = "expand_less"
      this.orderstate = false
    }else{
      this.ordervalue = "ASC"
      this.ordericon = "expand_more"
      this.orderstate = true
    }
    var element = <HTMLDivElement> document.getElementById(value)
    var item = `${name} <span class="material-icons iconord">${this.ordericon}</span>`
    element.innerHTML = item
    this.gDP08ACAL()
  }
  public arrDp08acal: any = [];
  gDP08ACAL() {
    this.gdp.getDp08acal(this.ordervalue, this.anio.value, this.tipeorder).subscribe( db => {
      this.arrDp08acal = db;
    })
  }

  public arrSaveDp08acal: any = []
  sDP08ACAL (finit: string, ffin: string ) {
    if(this._color != undefined){
      if(this._semana != undefined){
        if(finit != undefined && ffin != undefined){
          var newsema = this._semana.toString().padStart(2,'0');
          let dateinit = finit.toString().slice(4, 15);
          let datefin  = ffin.toString().slice(4, 15)
          this.dataPersist('_semana', this._semana);
          this.arrSaveDp08acal = {
            anio:         '' + this._periodo, 
            peri:         newsema,
            sema:         newsema,
            finicio:      dateinit,
            ffin:         datefin,
            ncaja:        0.00,
            color_asign:  this._color,
            color_codec:  this._codec_color
          }
          this.gdp.saveDp08acal(this.arrSaveDp08acal).subscribe( sdb => {
            this.auditoria.saveaudit("Creo la semana " + newsema, "")
            this.arrSaveDp08acal = []
            this._startDate = ""
            this._endDate = ""
            this._semana = ""
            this.toast.fire({
              icon: 'success',
              title: "Guardado con exito"
            })
            this.gDP08ACAL();
          }, () => {
            this.notifierror('Selecione datos validos')
          })
        }else{
          this.notifierror('Selecione fechas validas')
        }
      }else{
        this.notifierror('Selecione una semana valida')
      }
    }else{
      this.notifierror('Selecione un color valido')
    }
  }
  notifierror(data:string){
    this.toast.fire({
      icon: 'error',
      title: data
    })
  }
  delDP08ACAL( anio: string, peri: string, sema: string ) {
    var module = localStorage.getItem("name_module") || "undefined"
    this.gdp.deleteDp08acal( anio, peri, sema ).subscribe( deldb => {
      this.gDP08ACAL();
      this.auditoria.saveaudit("Borro la semana " + sema, module)
      this.toast.fire({
        icon: 'success',
        title: "Borrado con exito"
      })
    })
  }


  public arrGcolor: any = [];
  public _color: any = '';
  public _codec_color: any = '';
  gcolor() {
    this.smas.gecolor('conf_color', "name_labor", "ASC").subscribe( color => {
      const dialogRef = this.dialog.open(popupitemcolors, {
        width: '80%',
        data: color,
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result != undefined){
          this.asignColor(result.hrx, result.name);
          var btn = <HTMLButtonElement> document.getElementById(`btncolorselect`);
          btn.style.background = result.hrx
          btn.innerHTML = result.name
        }
      });
    }, ()=>{
      this.toast.fire({
        icon: 'error',
        title: 'Error al selecionar colores'
      })
    })
  }

  asignColor(a: string, b: string) {
    this._codec_color = b;
    this._color = a;
    this.dataPersist('_color', a);
    this.dataPersist('_codec_color', b);
  }
  nexttab(){
    var items = <HTMLDivElement> document.getElementById("tab")
    items.style.opacity = "0"
    items.style.transform = "scale(0.8)"
    setTimeout(() => {
      this.route.navigate(["./wb_shade"])
    }, 300);
  }
}

@Component({
  selector: 'popupitemcolors',
  templateUrl: 'popupcolor.html',
  styleUrls: ['popupcolor.css']

})
export class popupitemcolors {
  constructor(
    public dialogRef: MatDialogRef<popupitemcolors>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}
  selectcolor(hrx:string, name:string) {
    this.dialogRef.close({hrx, name});
  }
}