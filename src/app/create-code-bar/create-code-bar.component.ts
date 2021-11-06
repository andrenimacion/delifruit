import { Component, OnInit } from '@angular/core';
import { ALPTABLAService } from '../services/alptabla.service';
import { ConfcolorsService } from '../services/confcolors.service';
import { Dp08acalService } from '../services/dp08acal.service';
import * as qrcode from 'qrcode-generator';
import { AuditPrintService } from '../services/audit-print.service';
import { TimeService } from '../services/time.service';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2'

import * as JsBarcode from 'jsbarcode';


// const JsBarcode = require('jsbarcode');

@Component({
  selector: 'app-create-code-bar',
  templateUrl: './create-code-bar.component.html',
  styleUrls: ['./create-code-bar.component.css'],
  template: `<ejs-barcodegenerator style="display: block;"  #barcode id="barcode" width="200px" height="150px" mode="SVG" type="Codabar" value="123456789"></ejs-barcodegenerator>`
})
export class CreateCodeBarComponent implements OnInit {
  public _perPage: number = 20;
  public p: any = 1;

  public year: any = new Date().getFullYear();
  public arrDp08acal:  any = [];
  public arrFilterGet: any = [];
  
  //var generator barcode
  public _hacienda: any = '';
  public _lote: any = '';
  public _secuencia: any = 0;
  public bar_codec: string = '';
  public data_head: any;

  public namHacienda: string = '';
 
  public usx: any;

  public sesHiystPrint: any;
  public _nPageCont:    any;

  constructor(  public dt: TimeService, 
                public smas: ConfcolorsService,
                private gdp: Dp08acalService,
                private alp: ALPTABLAService,
                private audit: AuditPrintService ) { }
  
  ngOnInit(): void {

    
    this.sesHiystPrint = localStorage.getItem('hystPrint');
    this._nPageCont = localStorage.getItem('hystPrint');
    
    this.codecSearch = localStorage.getItem('Codec_search');
    this.cantCod     = Number(localStorage.getItem('Cant_codec_search'));
    
    // console.log( '================ Slice INI ================' );
    // console.log(          this.codecSearch.slice(0,15)         );
    // console.log( '================ Slice FIN ================' );

    // this.audit.getAuditPrint( '_void_', this.codecSearch.slice(1,15) ).subscribe( m => {
    //   this.arrAuditFilter = m;
    //   console.log(this.arrAuditFilter)
    // })
    
    ///console.log()

    this.usx = sessionStorage.getItem('User_Name');
    this.getAudit(this.usx, '_');
    
    this.gDP08ACAL('ASC')
    
    console.log('init')
    this.filter('','b')
    
    this.namHacienda = 'DELI_MASTER';

    this.filter(this.namHacienda, 'a')

    // this.createQRO('ejemplo');
    this.ghead();
    //================DATA PERSIST =======================//
    this._hacienda = localStorage.getItem('codigo_hac_bcod');
    this._lote = localStorage.getItem('codigo_lot_bcod');
    this._secuencia = localStorage.getItem('');
    this.bar_codec = localStorage.getItem('codigo_hac_bcod')?.trim()+'_'+this._lote+'_'+this.year+this._secuencia.padStart(4,'0');
  }

  shist(a: any) {
    localStorage.setItem('hystPrint', a);
    this.sesHiystPrint = localStorage.getItem('hystPrint');
    // console.log(a);
  }

  shistPerPage(a: any) {
    localStorage.setItem('perPage', a);
    this.sesHiystPrint = localStorage.getItem('perPage');
    // console.log(a);
  }

  public ArrAudit: any = [];
  //Esta funcion nos devuelve las cantidad de ipresiones por usuario
  getAudit( a: string, b: string ) {
    this.audit.getAuditPrint(a, b).subscribe( y => {
      this.ArrAudit = y;
      console.log(this.ArrAudit);
    })
  }

  public arrAuditFilter: any = [];
  public cantCod: number = 0;
  public codecSearch: any = '----';
  getAuditImpress(a: string, cant: number) {

    // const xx = a.slice(1,15);
    
    localStorage.setItem( 'Codec_search', a );
    localStorage.setItem( 'Cant_codec_search', cant.toString().trim() );

    this.codecSearch = a;
    this.cantCod  = cant;

    this.audit.getAuditPrint( '_void_', a ).subscribe( m => {
      this.arrAuditFilter = m;
      console.log(this.arrAuditFilter)
    })

  }

  public arrAudit: any = [];

  saveAudit( username: string, finit: string, ffin: string, codec_lotes: string, haciendaTag:string, codecLoMaster: string, cant: number ) {
    
    this.arrAudit = {
      user_name:          username,
      finit:              finit,
      ffin:               ffin,
      codec_lotes:        codec_lotes,
      hacienda_tag:       haciendaTag,
      codec_lotes_master: codecLoMaster,
      cantidad:           cant,
      token_user:         sessionStorage.getItem('Code_user')
    }

    console.log(this.arrAudit);

    this.audit.saveAuditPrint(this.arrAudit).subscribe( y => {
      console.log('OK GUARDADO');
      console.log(y);
    })

    this.getAudit(this.usx, '_');
  
  }

 nhacienda(a:string) {
   this.namHacienda = a;
   console.log(this.namHacienda);
   this.filter(this.namHacienda, 'a');
 }

  ghead() {
    this.data_head = localStorage.getItem('name_module');
  }
  
  dataPersist( nameStorage: string, values: string ) {
    let x = localStorage.setItem( `${nameStorage}`, `${values}` )
  }

  gDP08ACAL(order: string) {
    this.gdp.getDp08acal(order).subscribe( db => {
      this.arrDp08acal = db;
      console.log(this.arrDp08acal);
    })
  }

  public arrHaciendas: any = [];
  public titleModal: string = '';
  filter(data: string, opt: string) {

    // opcion a busca todos los lotes por haciendas
    if( opt == 'a' ) {
      console.log('Buscando lotes');
      this.alp.getFilterHac(data, opt).subscribe( y => {
        
        this.arrFilterGet = y;
        console.log(this.arrFilterGet);
        this.titleModal = this.arrFilterGet[0].db_msj;

      })
    }

    // opcion B busca todas las haciendas creadas en el ALPTABLA
    else if( opt == 'b' ) {
      console.log('Buscando haciendas');
      this.alp.getFilterHac('HCIE_GR', opt).subscribe( w =>
      {

        this.arrHaciendas = w;
        this.titleModal   = this.arrHaciendas[0].db_msj;
        console.log(this.arrHaciendas);

      })

    }

    //opcion c filtra una hacienda
    else if( opt == 'c' ) {
      console.log('Buscando una hacienda');
      this.alp.getFilterHac(data, opt).subscribe( z => {
        this.arrHaciendas = z;
        console.log(this.arrFilterGet);
        this.titleModal = this.arrFilterGet[0].db_msj;
      })
    }
  }

  getDataTables( nameStore: string, a: string, opt: number, nhacienda: string ) {
    // console.log('haci')


    switch( opt ) {

      case 1:
        this._hacienda = a;
        console.log(nhacienda)
        this.nhacienda(nhacienda);
        localStorage.setItem(`${nameStore}`, `${this._hacienda}`);
        const xa: any = localStorage.getItem('codigo_hac_bcod')?.trim()+'_'+this._lote.trim()+'_'+this.year+this._secuencia.toString().padStart(4,'0');
        this.bar_codec = xa;
        break;

      case 2:
        this._lote = a;
        localStorage.setItem(`${nameStore}`, `${this._lote}`);
        const xb: any = localStorage.getItem('codigo_hac_bcod')?.trim()+'_'+this._lote.trim()+'_'+this.year+this._secuencia.toString().padStart(4,'0');
        this.bar_codec = xb;
        break;

      case 3:
        this._secuencia = Number(a);
        localStorage.setItem(`${nameStore}`, `${this._secuencia}`);
        const xc: any = localStorage.getItem('codigo_hac_bcod')?.trim()+'_'+this._lote.trim()+'_'+this.year+this._secuencia.toString().padStart(4,'0');
        this.bar_codec = xc;
        break;

    }
  
  }
 
  public arrCode: any = [];
  generateBarcode(numberCode: number) {    

    this.dt.timeSetformatSQL( 'receipt_long', 'fin' );

    //Guardar Maestro Auditoria
    const xx:   any = localStorage.getItem('audit_mod_receipt_long-fin');
    const usx:  any = sessionStorage.getItem('User_Name');
    const fx :  any = localStorage.getItem('audit_mod_receipt_long-init');
    const lot:  any = localStorage.getItem('codigo_lot_bcod');
    const htag: any = localStorage.getItem('codigo_hac_bcod')?.trim();
    this.saveAudit( usx, fx, xx, lot, this.bar_codec + ':M', htag, numberCode )

    console.log( usx, fx, xx, lot, this.bar_codec + ':M',  htag);

    for( let i = 1; i <= numberCode; i++ ) {
      this.arrCode.push({ data:  localStorage.getItem('codigo_hac_bcod')?.trim()
                          + '_' + this._lote.trim()   + '_' + this.year + (i).toString().padStart(4,'0'),
                          secuence: this._lote.trim() + '_' + this.year + (i).toString().padStart(4,'0')
      });
      

      console.log(this.arrCode);

    }

    for(let x = 0; x <= this.arrCode.length; x++) {
      
      setTimeout(() => {
        this.arrCode[x].data;
        console.log(this.arrCode[x].data);
        let xx = <HTMLDivElement> document.getElementById(`${this.arrCode[x].secuence}`)
        let xy = <HTMLDivElement> document.getElementById(`data-${this.arrCode[x].secuence}`)
        console.log( xx )
        
        this.saveAudit( '---', '', '', htag+'-'+lot, this.arrCode[x].data, '',  0 );
        const qr = qrcode(3, 'Q');
        const url = `${this.arrCode[x].data}`;
        qr.addData(url);
        qr.make();
        
        xx.innerHTML = qr.createImgTag(2,4);
        xy.innerHTML = `<span style="font-weight: bold; font-size: 7pt; font-family: arial; display: flex; align-items: center; padding: 5px;">
        COD:<br>
            ${this.arrCode[x].secuence}               
        </span>`
        const xz: any = localStorage.getItem('audit_mod_receipt_long-fin');

      }, 300);
      
    }

    // Swal.fire({      
    //   position: 'top-end',
    //   icon:     'success',
    //   title:    'Etiquetas generadas',
    //   showConfirmButton: false,
    //   timer: 1500
    // })

  }

  createQRO(data: string, id: string) {

    const xx  = <HTMLDivElement> document.getElementById(`${id}`);
    const qr  = qrcode(2, 'L');
    const url = `${data}`;

    qr.addData(url);
    qr.make();

    xx.innerHTML = qr.createImgTag(1.4, 1);
  
  }


  imprSelec(id: string) {
    var ficha = <HTMLDivElement> document.getElementById(id);
    let ventimp: any = window.open(' ', 'popimpr');
    ventimp.document.write( ficha.innerHTML );
    ventimp.document.close();
    // ficha.style.fontFamily = 'Arial';
    ventimp.print();
    ventimp.close();
  }

}
