import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { ALPTABLAService } from '../services/alptabla.service';

@Component({
  selector: 'app-haciendas',
  templateUrl: './haciendas.component.html',
  styleUrls: ['./haciendas.component.css']
})

export class HaciendasComponent implements OnInit {

  public data_head: any;

  panelOpenState = false;

  public _cod_hacienda:     string = '';
  public _name_hacienda:    string = '';
  public _nomtag_hacienda:  any;
  public ejec_hacienda:     any;

  //lotes
  public _cod_lote:         any =  '' ;
  public _nom_lote:         string =  '' ;
  public _hectareaje_lote:  number =  0.0;
  public codec_hacienda:    any;
  public _delete_hacienda: string = ''
  //make codec secuences
  public codecSecuence: any = '000';

  public _total_hectareaje: number = 0.00;

  public showHac: boolean = false;

  public _val_edit: any;

  constructor( public chcien: ALPTABLAService ) { }

  ngOnInit(): void {

    this.gMaster('HCIE_GR',     'grupo',  1);
    this.gMaster('HCIE_GR',     'sgrupo', 2);
    //this.gMaster('DELI_MASTER', 'master', 3);

    this.ejec_hacienda  = localStorage.getItem('name_hacienda' );
    this.codec_hacienda = localStorage.getItem('codec_hacienda');
    this._nomtag_hacienda = localStorage.getItem('nom_tag');

    this.ghead();

  }

  public count: number = 0;
  sHacienda(cod: string, nombre: string, nomtag: string, gestion: string) {

    this.chcien.saveCabeceraMaster( cod.padStart(3, '0'), nombre, nomtag, gestion )
    .subscribe( y => {
      console.log('OK');
      console.log(y);
      this.gMaster('HCIE_GR', 'sgrupo', 2);

      this.codecSecuence =  Number(this.codecSecuence);

      //this.count ++

      localStorage.setItem( `secuence-${cod}`, this.count.toString() );

    })

  }

  sLote ( codecSecuence: string, nombre: string, grupo: string, hectareaje: number) {

    // console.log( codecSecuence, nombre, grupo, hectareaje);
    const x: any = localStorage.getItem('codec_hacienda');

    localStorage.setItem(`secuence-${x.trim()}`, codecSecuence);
    this.codec_hacienda = Number(this._cod_hacienda) + 1;
    console.log(this.codec_hacienda);
    // codecSecuence.padStart(3,'0');
    
    const xx = codecSecuence.toString().padStart(3,'0')
    
    this.chcien.saveDetailMaster(x.trim(), xx, nombre, grupo, hectareaje).subscribe( z => {
    
      console.log('OK');
      console.log(z);
    
    })

    location.reload();
  
  }

  zfill(object: string, numbers: number, fill: string ) {
    let x: any = object.padStart(numbers, fill);
    // this._cod_lote = x;
    console.log(x);
    return x;
  }

  gcodec( a: string ) {

    this._cod_hacienda = a.slice(0,4).toUpperCase() + '_MASTER';
    this._nomtag_hacienda = a.slice(0,3).toUpperCase() + '_H'
    console.log('codec: ' + this._cod_hacienda );

  }

  public ArrMaster: any = [];
  public ArrHaciendas: any = [];
  public ArrLotes: any = [];

  gMaster(nomtag: string, properties: string, opt: number) {

    if( opt == 1 ) {

      this.chcien.getMaster(nomtag, properties).subscribe( MASTER => {
        this.ArrMaster = MASTER;
        // console.log(this.ArrMaster);
      })

    }

    else if ( opt == 2 ) {

      this.chcien.getMaster(nomtag, properties).subscribe( HACIE => {
        this.ArrHaciendas = HACIE;
        //console.log(this.ArrHaciendas);
      })

    }
    
    else if ( opt == 3 ) {

      this.chcien.getMaster(nomtag, properties).subscribe( LOTES => {
        this.ArrLotes = LOTES;
        // console.log(this.ArrLotes);

        let arr = [];

        for( let x = 0; x <= this.ArrLotes.length; x++ ) {

          // console.log(this.ArrLotes[x].valor);
          let xy = this.ArrLotes[x].valor;
          arr.push(xy);

          let xx = (previousValue: number, currentValue: number) => previousValue + currentValue;
          this._total_hectareaje = arr.reduce(xx).toFixed(2);

        }

        // console.log(this._total_hectareaje);

      })

    }

  }

  dataPersist(nameStore:string, a: string, nameStoreB: string, b: string, nameStoreC: string, c: string) {
    localStorage.setItem( `${nameStore}` , a );
    localStorage.setItem( `${nameStoreB}`, b );
    localStorage.setItem( `${nameStoreC}`, c );
    this.ejec_hacienda    = a;    this.codec_hacienda   = b;    this._nomtag_hacienda = c;
  }

  getDataIn() {
    const a: any = localStorage.getItem(`codec_hacienda`)?.toString();
    const b: any = localStorage.getItem('secuence-'+a.trim());
    this._cod_lote = Number(b) + 1;
  }

  del(b: string) {
    
    let a: any = localStorage.getItem('codec_hacienda');
    //let b: any = localStorage.getItem('nom_tag');
    
    console.log(a)
    console.log(b.slice(1,7).trim())

    this.chcien.delLotes(a.trim(), b.trim()).subscribe( del => {
      this.gMaster('HCIE_GR', 'sgrupo', 2);
      location.reload();
    })

  }


  upname(nomtag: string, id: string) {
    const xx = <HTMLInputElement> document.getElementById(`${id}`);
    let m = xx.value;
    console.log(m);
    // console.log(a)
    let aa = nomtag.slice(1,7).trim();
    // console.log(aa);
    this.chcien.updtaeNamesHaciendas(aa, m).subscribe( update => {
      
      console.log ('UPDATE EXITOSO');
      this.gMaster('HCIE_GR', 'sgrupo', 2);

    })

  }

  
  ghead() {
    this.data_head = localStorage.getItem('name_module');
  }

}
