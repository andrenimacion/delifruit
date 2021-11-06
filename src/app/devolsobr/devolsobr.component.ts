import { Component, OnInit } from '@angular/core';
import { AuditPrintService } from '../services/audit-print.service';
import { DevsobcontrolService } from '../services/devsobcontrol.service';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2'

@Component({
  selector: 'app-devolsobr',
  templateUrl: './devolsobr.component.html',
  styleUrls: ['./devolsobr.component.css']
})

export class DevolsobrComponent implements OnInit {

  public data_head: any;
  public _codec_in: string = '';
  public _dev_cant: number = 1;
  public _obser: string = '';
  public _dis_bol: boolean = false;

  constructor( private dns: DevsobcontrolService, private lote: AuditPrintService ) { }

  ngOnInit(): void {
    // this.sDevsobs();
    this.ghead();
    this.getDevos();
    // this.getLotes();
  }

  ghead() {
    this.data_head = localStorage.getItem('name_module');
  }

  public ArrDevos: any = [];
  sDevsobs( loteProd: string, finit: any, observ: string, cantidad: number, cantidadDev: number ) {

    this.ArrDevos = {
      lote_prod:  loteProd,
      finit:      finit,
      ffin:       new Date(), 
      observ_dev: observ, 
      cant:       cantidad, 
      cant_dev:   cantidadDev, 
      total:      cantidad - cantidadDev, 
      campo:      '----',
      campoA:     sessionStorage.getItem('Code_user'), 
      campoB:     sessionStorage.getItem('User_Name') 
    }

    console.log(this.ArrDevos);

    this.dns.saveSobDevs(this.ArrDevos).subscribe( y => {
      console.log(y);
      this.getDevos();
    }, () => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El Lote escaneado para devolución está repetido.',
        footer: 'Si desea hacer un cambio, pruebe actualizando.'
      })
    })
  
  }

  controlCant(a: number, b: number) {
    if( a > b || a <= 0 || a == null) {
      Swal.fire({
        icon: 'info',
        title: 'Oops...',
        text: 'Cantidad a devoler ha sido superada!',
        // footer: '<a href="">Why do I have this issue?</a>'
      })
      this._dev_cant = b-1;
    }    
    this._dis_bol = false;
  }

  public arrDevs: any = [];
  public canDevs: number = 0;
  getDevos() {

    const x: any = sessionStorage.getItem('Code_user');
    const y: any = localStorage.getItem('sliceCodeA');

    console.log(y);

    this.dns.getSobDevs( x, y ).subscribe( x => {
      this.arrDevs = x;
      this.canDevs = this.arrDevs.length;
      console.log(x);
    })
  }

  public arrLotes : any = [];
  getLotes(codecs: string) {

    const x = codecs.trim().slice(1,15);

    const sliceXa = x.slice(0,5);
    const sliceXb = x.slice(6,9);

    // console.log(x);
    // console.log(sliceXa);
    // console.log(sliceXb);

    // localStorage.setItem('CodLOTE:', sliceXb);
    localStorage.setItem('sliceCodeA', sliceXa);

    this.lote.getLoteUnit(sliceXa, sliceXb).subscribe( m => {
      this.arrLotes = m;
      console.log(this.arrLotes)
    }, () => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Código no encontrado',
        footer: 'Vuelve a intentarlo'
      })
      this._codec_in = ''
    })

  }

  updatePK(lotePK: string, finit: any, observ: string, cantidad: number, id:string) {

    const xx = <HTMLInputElement> document.getElementById(`${id}`);

    this.ArrDevos = {
      lote_prod:  lotePK,
      finit:      finit,
      ffin:       new Date(), 
      observ_dev: observ, 
      cant:       cantidad, 
      cant_dev:   Number(xx.value), 
      total:      cantidad - Number(xx.value), 
      campo:      '----',
      campoA:     sessionStorage.getItem('Code_user'), 
      campoB:     sessionStorage.getItem('User_Name') 
    }

    console.log(this.ArrDevos);
    console.log(lotePK)

    this.dns.putSobDevs(lotePK, this.ArrDevos).subscribe( upd => {
      console.log(upd);
    })
  }

}
