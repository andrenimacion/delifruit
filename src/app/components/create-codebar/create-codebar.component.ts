import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as JsBarcode from 'jsbarcode';
import { forkJoin, from, Observable } from 'rxjs';
import * as qrcode from 'qrcode-generator';
import { AlptablaService } from 'src/app/services/alptabla.service';
import { AuditoriaService } from 'src/app/services/auditoria.service';
import { ColoresService } from 'src/app/services/colores.service';
import { Dp08acalService } from 'src/app/services/dp08acal.service';
import { TimeService } from 'src/app/services/time.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-codebar',
  templateUrl: './create-codebar.component.html',
  styleUrls: ['./create-codebar.component.css']
})
export class CreateCodebarComponent implements OnInit {
  fonts: any[] = ["Arial", "Helvetica", "Courier New"];
  alings: any[] = [{name: "Top", value: "flex-start"}, {name: "Center", value: "center"}, {name: "Bottom", value: "flex-end"}];
  types: any[] = [{name: "Qr code", value: 0}, {name: "Code bar", value: 1}, {name: "Code bar 2", value: 2}];
  isEditable = false;
  show = false;
  show2 = false;
  showprint = false
  addqrcode = false;
  btnaddanimat = false;
  cardsettings = false;
  btnsettings = false
  icon:string = ""
  Mtag = "";
  Mhacien = "";
  Manio = "";
  Mcant = "";
  codemastert = "";
  today = new Date();
  settingsfont = this._formBuilder.group({
    mwidth: [120, Validators.required],
    mheigth: [50, Validators.required],
    msize: [16, Validators.required],
    mfont: ['arial', Validators.required],
    mrotate: [-90, Validators.required],
    marginl: [0],
    margint: [0],
    marginb: [0],
    marginr: [0],
    alings: [],
    types: []
  });
  year2 = this.today.getFullYear();
  firstFormGroup = this._formBuilder.group({
    semana: ['', Validators.required],
    hacienda: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    lote: ['', Validators.required],
    inputyear: [`${this.year2}`],
  });
  threeFormGroup = this._formBuilder.group({
    cant: [0, Validators.required],
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
  public user: any;
  public title_header:any

  constructor(    private route:ActivatedRoute,
    private router:Router,
                private _formBuilder: FormBuilder,
                public dt: TimeService,
                public smas: ColoresService,
                private gdp: Dp08acalService,
                private alp: AlptablaService,
                private audit: AuditoriaService, ) { }

  ngOnInit(): void {
    this.icon = `${this.route.snapshot?.routeConfig?.path}`
    var arrayitemsmenu:any = sessionStorage.getItem('items_menu'); 
    var objetitems = JSON.parse(arrayitemsmenu);
    for(var i = 0; i <= objetitems.length; i++){
      if(objetitems[i]?.icon_module == this.icon){this.title_header = objetitems[i].name_module}
    }
    setTimeout(() => {
      this.show = true
    }, 60);
    setTimeout(() => {
      var desarollador:any = localStorage.getItem("desarrollador");
      if(desarollador != null){
        this.show2 = true
      }
    }, 150);
    this.secondFormGroup.controls["inputyear"].disable()
    localStorage.setItem("levelcode", "3");
    localStorage.setItem("apptransform", "-90");
    localStorage.setItem("appheight", "40");
    localStorage.setItem("appwidth", "105");
    localStorage.setItem("appsize", "14");
    localStorage.setItem("appfont", "Arial");
    localStorage.setItem("aling", "center");
    localStorage.setItem("marginl", "-43");
    localStorage.setItem("marginr", "0");
    localStorage.setItem("margint", "-5");
    localStorage.setItem("marginb", "75");
    localStorage.setItem("types", "0");
    this.gDP08ACAL('asc');

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
    this.filter('','b')

    this.namHacienda = 'DELI_MASTER';


    // this.createQRO('ejemplo');
    this.ghead();
    //================DATA PERSIST =======================//
    this._hacienda = localStorage.getItem('codigo_hac_bcod');
    this._lote = localStorage.getItem('codigo_lot_bcod');
    this._secuencia = localStorage.getItem('');
    this.bar_codec = localStorage.getItem('codigo_hac_bcod')?.trim()+'_'+this._lote+'_'+this.year+this._secuencia?.padStart(4,'0');
    this.verificacion()
    this.user = sessionStorage.getItem('User_Name'); 
  }
  logout(){
    sessionStorage.removeItem('Code_user');
    sessionStorage.removeItem('User_Name');
    sessionStorage.removeItem('Estado');
    this.verificacion()
  }
  verificacion() {     
    if (sessionStorage.getItem('User_Name') == '' || sessionStorage.getItem('User_Name') == null) {
      this.router.navigate(['/login']);
      console.log('/login')
    } 
  }
  showaddqrcode(){
    this.addqrcode = !this.addqrcode
    this.btnaddanimat = !this.btnaddanimat
  }
  settingsimp(){
    this.cardsettings = !this.cardsettings
    this.btnsettings = !this.btnsettings
  }
  settingsprint(){
      if(this.settingsfont.valid){
        localStorage.setItem("apptransform", this.settingsfont.get("mrotate")?.value);
        localStorage.setItem("appheight", this.settingsfont.get("mheigth")?.value);
        localStorage.setItem("appwidth", this.settingsfont.get("mwidth")?.value);
        localStorage.setItem("appsize", this.settingsfont.get("msize")?.value);
        localStorage.setItem("appfont", this.settingsfont.get("mfont")?.value);
        localStorage.setItem("marginl", this.settingsfont.get("marginl")?.value);
        localStorage.setItem("margint", this.settingsfont.get("margint")?.value);
        localStorage.setItem("marginb", this.settingsfont.get("marginb")?.value);
        localStorage.setItem("marginr", this.settingsfont.get("marginr")?.value);
      }
      if(this.settingsfont.get("alings")?.value != null){
        console.log(localStorage.getItem("aling"))
        localStorage.setItem("aling", this.settingsfont.get("alings")?.value);
      }
      if(this.settingsfont.get("types")?.value != null){
        localStorage.setItem("types", this.settingsfont.get("types")?.value);
      }
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
    })
  }

//  // Obtiene la semanas
//  public arrDp08acal: any = [];
//  gDP08ACAL(order: string) {
//    this.gdp.getDp08acal(order).subscribe( db => {
//      this.arrDp08acal = db;
//      console.log(this.arrDp08acal);
//    })
//  }


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
      var desarollador:any = localStorage.getItem("desarrollador");
      if(desarollador != null){
        var btnprint = <HTMLButtonElement> document.getElementById(`btnprint`);
        var btnsettings = <HTMLButtonElement> document.getElementById(`btnsettings`);
        btnprint.style.bottom = "110px"
        btnsettings.style.bottom = "182px"
        setTimeout(() => {
          this.showprint = true
        }, 200);
      }else{
        this.showprint = true
      }
    })

  }

  public arrAudit: any = [];
  saveAudit( username: string, finit: string, ffin: string, codec_lotes: string, haciendaTag:string, codecLoMaster: string, cant: number ) {

    // const xcolor : any = localStorage.getItem('_color');
    this.arrAudit = {
      user_name:          username,
      finit:              finit,
      ffin:               ffin,
      codec_lotes:        codec_lotes,
      hacienda_tag:       haciendaTag,
      codec_lotes_master: codecLoMaster,
      cantidad:           cant,
      token_user:         sessionStorage.getItem('Code_user'),
      codec_color:        localStorage.getItem('_color')
    }

    // console.log(xcolor);

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
  deleteitem(codex:string,hacienda_tag:string){
    forkJoin(
      this.gdp.deleteqrlote("hacienda_tag", hacienda_tag),
      this.gdp.deleteqrlote("codec_lotes", codex)
    ).subscribe((x)=>{
        this.getAudit(this.usx, '_');
        this.toast.fire({
          icon: 'success',
          title: 'Borrado con exito'
        })
    },err=>{
      this.toast.fire({
        icon: 'error',
        title: 'Error al eliminar el elemento'
      })
    })
  }
  dataPersist( nameStorage: string, values: string ) {
    let x = localStorage.setItem( `${nameStorage}`, `${values}` )
  }
  
  public _color_sel: string =  ''
  gDP08ACAL(order: string) {
    this.gdp.getDp08acal(order).subscribe( db => {
      this.arrDp08acal = db;
    })
  }

  // jj.sema + '/' + jj.peri + '/' + jj.anio
  public _semana: string = '';
  asignData(color: string, semana: string) {
    this._color_sel = color;
    this._semana = semana;
    localStorage.setItem('_color', color);
    localStorage.setItem('_semana', this._semana);
  }

  public arrHaciendas: any = [];
  public titleModal: string = '';
  filter(data: string, opt: string) {

    // opcion a busca todos los lotes por haciendas
    if( opt == 'a' ) {
      this.arrFilterGet = []
      this.alp.getFilterHac(data, "a").subscribe( y => {
        this.arrFilterGet = y;
        this.titleModal = this.arrFilterGet[0]?.db_msj;
      }, (e)=>{
        console.log(e)

      })
    }

    // opcion B busca todas las haciendas creadas en el ALPTABLA
    else if( opt == 'b' ) {
      this.alp.getFilterHac('HCIE_GR', opt).subscribe( w =>
      {
        console.log(w)
        this.arrHaciendas = w;
        this.titleModal   = this.arrHaciendas[0].db_msj;
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
  returncodex(id:boolean){
    if(id){
      this.codemastert = this.Mtag + "_" + this.Mhacien + "_" + this.year;
    }else{
      this.codemastert = this.Mtag;
    }
  }
  getDataTables( nameStore: string, a: string, opt: number, nhacienda: string, name?:string ) {
    switch( opt ) {

      case 1:
        var data = name || ""
        this.Mtag = a
        this.codemastert = this.Mtag;
        this._hacienda = a;
        this.nhacienda(nhacienda);
        this.filter(data, "a")
        localStorage.setItem(`${nameStore}`, `${this._hacienda}`);
        console.log(localStorage.getItem('codigo_hac_bcod')?.trim()+'_'+this._lote+'_'+this.year+this._secuencia.toString().padStart(4,'0'))
        const xa: any = localStorage.getItem('codigo_hac_bcod')?.trim()+'_'+this._lote+'_'+this.year+this._secuencia.toString().padStart(4,'0');
        this.bar_codec = xa;
        break;

      case 2:
        this.Mhacien = a
        this.codemastert = this.Mtag + "_" + this.Mhacien + "_" + this.year;
        this._lote = a;
        localStorage.setItem(`${nameStore}`, `${this._lote}`);
        const xb: any = localStorage.getItem('codigo_hac_bcod')?.trim()+'_'+this._lote.trim()+'_'+this.year+this._secuencia.toString().padStart(4,'0');
        this.bar_codec = xb;
        break;

      case 3:
        this.Mcant = a
        this.codemastert = this.Mtag + "_" + this.Mhacien + "_" + this.year + "_" + this.Mcant.toString().padStart(4,'0');
        this._secuencia = Number(a);
        localStorage.setItem(`${nameStore}`, `${this._secuencia}`);
        const xc: any = localStorage.getItem('codigo_hac_bcod')?.trim()+'_'+this._lote.trim()+'_'+this.year+this._secuencia.toString().padStart(4,'0');
        this.bar_codec = xc;
        break;

    }

  }

  public arrCode: any = [];
  generateBarcode(numberCode: number) {
    this.toast.fire({
      icon: 'success',
      title: 'Generadas con exito'
    })
    this.codemastert = ""
    this.dt.timeSetformatSQL( 'receipt_long', 'fin' );

    //Guardar Maestro Auditoria
    const xx:   any = localStorage.getItem('audit_mod_receipt_long-fin');
    const usx:  any = sessionStorage.getItem('User_Name');
    const fx :  any = localStorage.getItem('audit_mod_receipt_long-init');
    const lot:  any = localStorage.getItem('codigo_lot_bcod');
    const htag: any = localStorage.getItem('codigo_hac_bcod')?.trim();

    this.saveAudit( usx, fx, xx, lot, this.bar_codec + ':M', htag, numberCode );
    console.log( usx, fx, xx, lot, this.bar_codec + ':M',  htag);

    for( let i = 1; i <= numberCode; i++ ) {

      this.arrCode.push({ data:  localStorage.getItem('codigo_hac_bcod')?.trim()
       + '_' + this._lote.trim() + '_' + this.year + (i).toString().padStart(4,'0'),
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
        
        // const qr = qrcode(3, 'Q');
        // const url = `${this.arrCode[x].data}`;
        // qr.addData(url);
        // qr.make();

        // xx.innerHTML = qr.createImgTag(2,4);
        // xy.innerHTML = `<span style="font-weight: bold; font-size: 7pt;
        //                              font-family: arial; display: flex;
        //                              align-items: center; padding: 5px;">
        //                              COD:<br>${this.arrCode[x].secuence}
        //                              </span>`;

        // const xz: any = localStorage.getItem('audit_mod_receipt_long-fin');

      }, 300);

    }

  }
  createQRO(data: string, id: string, color: string) {
    var newcolor = color.replace("Cinta ", "")
    var state:any = localStorage.getItem("levelcode");
    var types:any = localStorage.getItem("types");
    var transform:any = localStorage.getItem("apptransform") + "deg";
    var height:any = localStorage.getItem("appheight") + "px";
    var width:any = localStorage.getItem("appwidth") + "px";
    var size:any = localStorage.getItem("appsize") + "px";
    var appfont:any = localStorage.getItem("appfont")
    var aling:any = localStorage.getItem("aling");
    var marginl:any = localStorage.getItem("marginl")+ "px";
    var marginr:any = localStorage.getItem("marginr")+ "px";
    var margint:any = localStorage.getItem("margint")+ "px";
    var marginb:any = localStorage.getItem("marginb")+ "px";
    const xx  = <HTMLDivElement> document.getElementById(`${id}`);
    var inertt = ""
    var flexDirection = "";
    var justifyContent = "";
    var qr:any;
    if(Number(state) == 1){
      qr = qrcode(0, 'L');
    }else if(Number(state) == 2){
      qr = qrcode(0, 'M');
    }else if(Number(state) == 3){
      qr = qrcode(0, 'Q');
    }else if(Number(state) == 4){
      qr = qrcode(0, 'H');
    }
    if(Number(types) == 0){
      const url = `${data}`;
      qr.addData(url);
      qr.make();
      inertt =  `${qr.createImgTag(1.4, 1)}<div style="font-size: ${size};font-family: ${appfont};"> ${newcolor}</div>`
      flexDirection = "row";
      justifyContent = "space-around";
    }else if(Number(types) == 1){
      inertt =  `<img id="A${id}"/><div style="font-size: ${size};font-family: ${appfont};">${color}</div>`
      flexDirection = "column-reverse";
      justifyContent = "center";
    }else if(Number(types) == 2){
      inertt =  `<img id="A${id}"/>`
      flexDirection = "column-reverse";
      justifyContent = "center";
    }
    xx.style.marginLeft = marginl;
    xx.style.marginRight = marginr;
    xx.style.marginTop = margint;
    xx.style.marginBottom = marginb;
    xx.style.padding  = "0px";
    xx.style.minWidth      = width;
    xx.style.maxWidth = width;
    xx.style.height     = height;
    xx.style.transform  = 'rotate('+ transform +')';
    xx.style.display    = 'block';
    xx.style.flexDirection = flexDirection;
    xx.style.justifyContent = justifyContent;
    xx.style.alignItems = aling;
    xx.innerHTML =  inertt;
    if(Number(types) == 1 || Number(types) == 2){
      const imgc  = <HTMLImageElement> document.getElementById(`A${id}`);
      JsBarcode(imgc, data);
    }
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
