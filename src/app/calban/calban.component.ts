import { Component, OnInit } from '@angular/core';
import { Dp08acalService } from '../services/dp08acal.service';
import Swal from 'sweetalert2';
import { ConfcolorsService } from '../services/confcolors.service';

@Component({
  selector: 'app-calban',
  templateUrl: './calban.component.html',
  styleUrls: ['./calban.component.css']
})
export class CalbanComponent implements OnInit {

  constructor( private gdp: Dp08acalService, public smas: ConfcolorsService ) { }

  public year = new Date().getFullYear();
  public _periodo: any = '';
  public _semana: any;
  public _startDate: any;
  public _endDate: any;
  public order: string = 'asc';

  public data_head: any;

  ngOnInit(): void {
    this.gDP08ACAL(this.order);
    this._periodo = this.year;

    this.ghead();

    this._semana  = localStorage.getItem('_semana');
    this._color   = localStorage.getItem('_color');
    this._codec_color = localStorage.getItem('_codec_color');

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
      console.log(this.arrDp08acal);
    })
  }

  public arrSaveDp08acal: any = []
  sDP08ACAL (finit: string, ffin: string ) {

    let month: any = new Date().getMonth()

    if( month < 10 ) {
      month = '0'+ month;
    }

    if( Number(this._semana) < 10 ) {
      this._semana = '0'+this._semana;
    }
    
    let dateinit = finit.toString().slice(4, 15);
    let datefin  = ffin.toString().slice(4, 15);
    console.log( dateinit );
    console.log( datefin );
    //console.log( ffin );

    this.dataPersist('_semana', this._semana);

    this.arrSaveDp08acal = {
      anio:         '' + this._periodo,
      peri:         '' + month,
      sema:         '' + this._semana,
      finicio:      dateinit,
      ffin:         datefin,
      ncaja:        0.00,
      color_asign:  this._color,
      color_codec:  ''
    }

    // this.arrSaveDp08acal = {
    //   anio:        "2021",
    //   color_asign: "",
    //   color_codec: "",
    //   ffin:        "Oct 31 2021",
    //   finicio:     "Oct 19 2021",
    //   ncaja:        0,
    //   peri:        "09",
    //   sema:        "49"
    // }

    console.log(this.arrSaveDp08acal);

    this.gdp.saveDp08acal(this.arrSaveDp08acal).subscribe( sdb => {
      console.log(sdb);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 1500
      })
      this.gDP08ACAL('desc');
    }, () => {
      Swal.fire(
        'Sin conexión?',
        'Revise la señal de su wifi',
        'error'
      )
    })

  }

  delDP08ACAL( anio: string, peri: string, sema: string ) {
    this.gdp.deleteDp08acal( anio, peri, sema ).subscribe( deldb => {
      this.gDP08ACAL('desc');
      console.log(deldb);
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
      this.arrGcolor = color;
    })
  }

  asignColor(a: string, b: string) {
    this._codec_color = b;
    this._color = a;
    this.dataPersist('_color', a);
    this.dataPersist('_codec_color', b);
  }



}
