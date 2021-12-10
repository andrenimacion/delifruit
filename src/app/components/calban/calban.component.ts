import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ColoresService } from 'src/app/services/colores.service';
import { Dp08acalService } from 'src/app/services/dp08acal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-calban',
  templateUrl: './calban.component.html',
  styleUrls: ['./calban.component.css']
})
export class CalbanComponent implements OnInit {

  constructor(public router:ActivatedRoute,public dialog: MatDialog,public route:Router,private gdp: Dp08acalService, public smas: ColoresService ) { }
  title_header:any;
  icon:any = ""
  public year = new Date().getFullYear();
  public _periodo: any = '';
  public _semana: any;
  public _startDate: any;
  public _endDate: any;
  public order: string = 'asc';
  public user: any;
  colorasing = "while"
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
  public data_head: any;
  show = false
  ngOnInit(): void {
    this.title_header = localStorage.getItem("name_module") 
    this.user = sessionStorage.getItem('User_Name'); 
    setTimeout(() => {
      this.show = true
  }, 60);
  this.verificacion()
  this.gDP08ACAL(this.order);
  this._periodo = this.year;
  this.ghead();
  this._color   = localStorage.getItem('_color');
  this._codec_color = localStorage.getItem('_codec_color');
  var btn = <HTMLButtonElement> document.getElementById(`btncolorselect`);
  btn.style.background = this._color
  if(this._codec_color != null || this._codec_color != undefined){
    btn.innerHTML = this._codec_color
  }
  this.icon = `${this.router.snapshot?.routeConfig?.path}`
  var arrayitemsmenu:any = sessionStorage.getItem('items_menu'); 
  var objetitems = JSON.parse(arrayitemsmenu);
  for(var i = 0; i <= objetitems.length; i++){
    if(objetitems[i]?.icon_module == this.icon){this.title_header = objetitems[i].name_module}
  }
  } 
  logout(){
    sessionStorage.removeItem('Code_user');
    sessionStorage.removeItem('User_Name');
    sessionStorage.removeItem('Estado');
    this.verificacion()
  }
  verificacion() {     
    if (sessionStorage.getItem('User_Name') == '' || sessionStorage.getItem('User_Name') == null) {
      this.route.navigate(['/login']);
    } 
  }

  ghead() {
    this.data_head = localStorage.getItem('name_module');
  }

  dataPersist(nameData:string, a: string): void {
    localStorage.setItem(`${nameData}`, a);
    //return a;
  }

  public arrDp08acal: any = [];
  gDP08ACAL(order: string) {
    this.gdp.getDp08acal(order).subscribe( db => {
      this.arrDp08acal = db;
    })
  }

  public arrSaveDp08acal: any = []
  sDP08ACAL (finit: string, ffin: string ) {
    console.log(this._codec_color)
    if(this._color != undefined){
      if(this._semana != undefined){
        if(finit != undefined && ffin != undefined){
          let month: any = new Date().getMonth()
          if( month < 10 ) {
            month = '0'+ month;
          }
          if( Number(this._semana) < 10 ) {
            this._semana = '0'+this._semana;
          }
          let dateinit = finit.toString().slice(4, 15);
          let datefin  = ffin.toString().slice(4, 15)
          this.dataPersist('_semana', this._semana);
          this.arrSaveDp08acal = {
            anio:         '' + this._periodo,
            peri:         '' + month,
            sema:         '' + this._semana,
            finicio:      dateinit,
            ffin:         datefin,
            ncaja:        0.00,
            color_asign:  this._color,
            color_codec:  this._codec_color
          }
          this.gdp.saveDp08acal(this.arrSaveDp08acal).subscribe( sdb => {
            this.toast.fire({
              icon: 'success',
              title: "Guardado con exito"
            })
            this.gDP08ACAL('desc');
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
    this.gdp.deleteDp08acal( anio, peri, sema ).subscribe( deldb => {
      this.gDP08ACAL('desc');
      this.toast.fire({
        icon: 'success',
        title: "Borrado con exito"
      })
    })
  }

  orderType() {
    switch( this.order ) {
      case 'asc':
        this.order = 'desc';
        this.gDP08ACAL(this.order);
        console.log(this.order);
        break;
      case 'desc':
        this.order = 'asc';
        this.gDP08ACAL(this.order);
        console.log(this.order);
        break;
    }
  }

  public arrGcolor: any = [];
  public _color: any = '';
  public _codec_color: any = '';
  gcolor() {
    this.smas.gecolor('conf_color').subscribe( color => {
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
  nextpage(){
    this.route.navigate(["wb_shade"])
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

