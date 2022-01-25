import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuditoryService } from 'src/app/services/auditory.service';
import { StatesService } from 'src/app/services/states.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-estates',
  templateUrl: './estates.component.html',
  styleUrls: ['./estates.component.css']
})
export class EstatesComponent implements OnInit {

  public data_head: any;
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
  constructor(public auditoria:AuditoryService, public route:Router,public chcien: StatesService, public dialog: MatDialog ) { }
  show = false
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
  ngOnInit(): void {
    this.user = sessionStorage.getItem('User_Name'); 
    this.gMaster('HCIE_GR',     'grupo',  1, "ASC", "");
    this.gMaster('HCIE_GR',     'sgrupo', 2, "ASC", "");
    //this.gMaster('DELI_MASTER', 'master', 3);

    this.ejec_hacienda  = localStorage.getItem('name_hacienda' );
    this.codec_hacienda = localStorage.getItem('codec_hacienda');
    this._nomtag_hacienda = localStorage.getItem('nom_tag');
    this.ghead();
  }
  nextpage(){
    this.route.navigate(["receipt_long"])
  }

  public count: number = 0;
  sHacienda(cod: string, nombre: string, nomtag: string, gestion: string) {
    var namemodule = localStorage.getItem("name_module") || "undefined"
    this.chcien.saveCabeceraMaster( cod.padStart(3, '0'), nombre, nomtag, gestion )
    .subscribe( y => {
      this.auditoria.saveaudit("Se creo hacienda " +  nombre, namemodule)
      this.toast.fire({
        icon: 'success',
        title: 'Hacienda creada con exito'
      })
      this.gMaster('HCIE_GR', 'sgrupo', 2, "ASC", "");
      this.codecSecuence =  Number(this.codecSecuence);
      localStorage.setItem( `secuence-${cod}`, this.count.toString() );

    })

  }

  sLote ( codecSecuence: string, nombre: string, grupo: string, hectareaje: number, ejec_hacienda:string) {
    const x: any = localStorage.getItem('codec_hacienda');
    var namemodule = localStorage.getItem("name_module") || "undefined"
    localStorage.setItem(`secuence-${x.trim()}`, codecSecuence);
    this.codec_hacienda = Number(this._cod_hacienda) + 1;
    const xx = codecSecuence.toString().padStart(3,'0')
    this.chcien.saveDetailMaster(ejec_hacienda.trim(), xx, nombre, grupo, hectareaje).subscribe( z => {
      this.auditoria.saveaudit("Se creo lote " +  this.codec_hacienda,namemodule )
      this.toast.fire({
        icon: 'success',
        title: 'Lote creada con exito'
      })
    })
    location.reload();
  
  }

  zfill(object: string, numbers: number, fill: string ) {
    let x: any = object.padStart(numbers, fill);
    return x;
  }

  gcodec( a: string ) {

    this._cod_hacienda = a.slice(0,4).toUpperCase() + '_MASTER';
    this._nomtag_hacienda = a.slice(0,3).toUpperCase() + '_H'

  }

  public ArrMaster: any = [];
  public ArrHaciendas: any = [];
  public ArrLotes: any = [];

  gMaster(nomtag: string, properties: string, opt: number, order:string, master:string) {
    if( opt == 1 ) {

      this.chcien.getMaster(nomtag, properties, order).subscribe( MASTER => {
        this.ArrMaster = MASTER;
      }) 

    }
    else if ( opt == 2 ) {
      this.chcien.getMaster(nomtag, properties, order).subscribe( HACIE => {
        this.ArrHaciendas = HACIE;
        for(var i = 1; i <= this.ArrHaciendas.length; i++){
          this.loadlotes(this.ArrHaciendas[i - 1].nombre, i - 1 )
        }
      }) 

    }
  }
  loadlotes(master:string, index:number){
    this.chcien.getMaster2(master).subscribe( LOTES => {
      console.log(master)
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
    var namemodule = localStorage.getItem("name_module") || "undefined"
    var name = b.trim().toLowerCase()
    var code = a.trim().toLowerCase()
    this.chcien.delLotes(name, code).subscribe( del => {
      this.toast.fire({
        icon: 'success',
        title: 'Lote borrado con exito'
      })
      this.auditoria.saveaudit("Borro el lote  " +  code, namemodule)
      this.gMaster('HCIE_GR', 'sgrupo', 2, "", "");
      location.reload();
    })

  }
  deletei(id:string){

  }
  deletelot(id:string){

  }
  nexttab(){
    var items = <HTMLDivElement> document.getElementById("tab")
    items.style.opacity = "0"
    items.style.transform = "scale(0.8)"
    setTimeout(() => {
      this.route.navigate(["./receipt_long"])
    }, 300);
  }
  ghead() {
    this.data_head = localStorage.getItem('name_module');
  }
  addlot(name:string){
      const dialogRef = this.dialog.open(addLot, {
        width: '350px',
        data: {name: name},
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.gMaster('HCIE_GR', 'sgrupo', 2, "", "");
        }
      });
  }
}
@Component({
  selector: 'add-lot-estates',
  templateUrl: './add_lot.html',
  styleUrls: ['./estates.component.css']
})
export class addLot {
  constructor(public dialogRef: MatDialogRef<addLot>, @Inject(MAT_DIALOG_DATA) public data: any,public chcien: StatesService, public auditoria:AuditoryService ) {}
  lot = new FormGroup({
    code: new FormControl("", [Validators.required]),
    name: new FormControl("",[Validators.required]),
    hect: new FormControl("",[Validators.required]),
   });
  onNoClick(): void {
    this.dialogRef.close();
  }
  add(){
    if(this.lot.valid){
      var name_module = localStorage.getItem("name_module")  || "undefined"
      this.chcien.saveDetailMaster(this.data.name, "", this.lot.get("name")?.value, 'd-000', this.lot.get("hect")?.value).subscribe( z => {
        this.auditoria.saveaudit("Se creo lote " +  this.lot.get("name")?.value, name_module)
      })
    }
  }

  closed(){
    this.dialogRef.close(false);
  }
}