import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlptablaService } from 'src/app/services/alptabla.service';

@Component({
  selector: 'app-haciendas',
  templateUrl: './haciendas.component.html',
  styleUrls: ['./haciendas.component.css']
})
export class HaciendasComponent implements OnInit {
  public data_head: any;
  public icon:any = ""
  panelOpenState = false;
  public user: any;
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

  public _total_hectareaje: string = "0.00";

  public showHac: boolean = false;

  public _val_edit: any;
  public title_header:any

  constructor(public router:ActivatedRoute, public route:Router,public chcien: AlptablaService ) { }
  show = false
  ngOnInit(): void {
    this.user = sessionStorage.getItem('User_Name'); 
    setTimeout(() => {
      this.show = true
  }, 60);
    this.gMaster('HCIE_GR',     'grupo',  1, "ASC", "");
    this.gMaster('HCIE_GR',     'sgrupo', 2, "ASC", "");
    //this.gMaster('DELI_MASTER', 'master', 3);

    this.ejec_hacienda  = localStorage.getItem('name_hacienda' );
    this.codec_hacienda = localStorage.getItem('codec_hacienda');
    this._nomtag_hacienda = localStorage.getItem('nom_tag');
    this.icon = this.router.snapshot.routeConfig?.path
    this.ghead();
  this.verificacion()
  this.icon = `${this.router.snapshot?.routeConfig?.path}`
  var arrayitemsmenu:any = sessionStorage.getItem('items_menu'); 
  var objetitems = JSON.parse(arrayitemsmenu);
  for(var i = 0; i <= objetitems.length; i++){
    if(objetitems[i]?.icon_module == this.icon){this.title_header = objetitems[i].name_module}
  }
  }
  nextpage(){
    this.route.navigate(["receipt_long"])
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

  public count: number = 0;
  sHacienda(cod: string, nombre: string, nomtag: string, gestion: string) {

    this.chcien.saveCabeceraMaster( cod.padStart(3, '0'), nombre, nomtag, gestion )
    .subscribe( y => {
      console.log('OK');
      console.log(y);
      this.gMaster('HCIE_GR', 'sgrupo', 2, "ASC", "");

      this.codecSecuence =  Number(this.codecSecuence);

      //this.count ++

      localStorage.setItem( `secuence-${cod}`, this.count.toString() );

    })

  }

  sLote ( codecSecuence: string, nombre: string, grupo: string, hectareaje: number, ejec_hacienda:string) {

    // console.log( codecSecuence, nombre, grupo, hectareaje);
    const x: any = localStorage.getItem('codec_hacienda');

    localStorage.setItem(`secuence-${x.trim()}`, codecSecuence);
    this.codec_hacienda = Number(this._cod_hacienda) + 1;
    console.log(this.codec_hacienda);
    // codecSecuence.padStart(3,'0');
     
    const xx = codecSecuence.toString().padStart(3,'0')
    this.chcien.saveDetailMaster(ejec_hacienda.trim(), xx, nombre, grupo, hectareaje).subscribe( z => {
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
  // "DESC"
  // "ASC"
  gMaster(nomtag: string, properties: string, opt: number, order:string, master:string) {
    if( opt == 1 ) {

      this.chcien.getMaster(nomtag, properties, order).subscribe( MASTER => {
        this.ArrMaster = MASTER;
        // console.log(this.ArrMaster);
      }) 

    }
    else if ( opt == 2 ) {
      this.chcien.getMaster(nomtag, properties, order).subscribe( HACIE => {
        this.ArrHaciendas = HACIE;
        console.log(HACIE)
        for(var i = 1; i <= this.ArrHaciendas.length; i++){
          this.loadlotes(this.ArrHaciendas[i - 1].nombre, i - 1 )
        }
      }) 

    }
  }
  loadlotes(master:string, index:number){
    this.chcien.getMaster2(master).subscribe( LOTES => {
      var ArrLotes:any = LOTES;
      if(ArrLotes.length){
        var suma = 0
        this.ArrHaciendas[index].objeto = LOTES
        for(let i = 1; i <= ArrLotes.length; i++){
          suma = suma + Number(ArrLotes[i - 1].valor)
        }
        this.ArrHaciendas[index].total = suma.toFixed(2)
        var suma = 0
      }
    },(err)=>{
      console.log(err)

    })
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

  del(a:string, b: string) {
    var name = b.trim().toLowerCase()
    var code = a.trim().toLowerCase()
    this.chcien.delLotes(name, code).subscribe( del => {
      this.gMaster('HCIE_GR', 'sgrupo', 2, "", "");
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
      this.gMaster('HCIE_GR', 'sgrupo', 2, "", "");

    })

  }

  
  ghead() {
    this.data_head = localStorage.getItem('name_module');
  }

}
