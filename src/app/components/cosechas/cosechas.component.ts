import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuditoriaService } from 'src/app/services/auditoria.service';
import { CosechaService } from 'src/app/services/cosecha.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cosechas',
  templateUrl: './cosechas.component.html',
  styleUrls: ['./cosechas.component.css']
})
export class CosechasComponent implements OnInit {
  codexinuse:any = ""
  codexcontados = 0
  codextotal = 0
  icon:any = ""
  codeuse = ""
  historycant:Array<string>  = []
  cantagg = 0
  codexcomplet:any = ""
  loadingadd = false
  Semana = new FormControl('', Validators.required);
  Hacienda = new FormControl('', Validators.required);
  scosechArr:any = [];
  cosecha:any = [];
  haciendas:any = [];
  arrcosecha:any = []
  codecs:string = ""
  cantidad = 0;
  show = false
  public user: any;
  title_header:any;
  weeks:any = [];
  public _color_sel: string = '';
  public _semana: string = '';
  public naHacienda: string = '';
  public _hacienda: string = '';
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
  constructor(public router:ActivatedRoute,private route:Router, private lote: AuditoriaService, private service:CosechaService) { }

  ngOnInit(): void {
    this.icon = `${this.router.snapshot?.routeConfig?.path}`
    var arrayitemsmenu:any = sessionStorage.getItem('items_menu'); 
    var objetitems = JSON.parse(arrayitemsmenu);
    for(var i = 0; i <= objetitems.length; i++){
      if(objetitems[i]?.icon_module == this.icon){this.title_header = objetitems[i].name_module}
    }
    if(localStorage.getItem("codextotal") != null || localStorage.getItem("codextotal") != undefined){this.codextotal = Number(localStorage.getItem("codextotal"))}
    if(localStorage.getItem("codexcontados") != null || localStorage.getItem("codexcontados") != undefined){this.codexcontados = Number(localStorage.getItem("codexcontados"))}
    if(localStorage.getItem("codexinuse") != null || localStorage.getItem("codexinuse") != undefined){this.codexinuse = localStorage.getItem("codexinuse")}
    this.loadweeks('asc');
    this.loadcosechas(50, 'desc')
    this.loadhaciendas('HCIE_GR', 'sgrupo', 'ACS');
    setTimeout(() => {
      this.show = true
  }, 60);
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
    } 
  }
  nextpage(){
    this.route.navigate(["error_outline"])
  }
  validationcodex(){
    var scode = this.codecs.trim()
    if(scode.length >= 17 && scode.length <= 20){
      var sliceXa = scode.slice(0,5);
      var sliceXb = scode.slice(6,11);
      var sliceXc = scode.slice(17,);
      this.codexinuse = localStorage.getItem("codexinuse")
      if(this.codexinuse == "" || this.codexinuse == undefined || this.codexinuse == sliceXa + "_" +  sliceXb){
        var historycodestring:any = localStorage.getItem("historycodes")
        var historycodeobject:Array<string> = []
        if(historycodestring != null ||  historycodestring != undefined){
          historycodeobject = JSON.parse(historycodestring)
        }
        var resulsearchcodev = historycodeobject.find(x => x === scode )
        if(resulsearchcodev == undefined || resulsearchcodev == null){
          this.searchcodex(sliceXa,sliceXb,sliceXc, scode)
        }else{
          this.toast.fire({
            icon: 'error',
            title: 'Codigo ya escaneado'
          })
        }
      }else{
        this.toast.fire({
          icon: 'error',
          title: 'Codigo es diferente a los escaneados'
        })
      }
    }
  }
  searchcodex(sliceXa:string,sliceXb:string,sliceXc:string, scode:string){
    var arraym:any = []
    var cantcodenumber = Number(sliceXc)
    this.codextotal = 0
    this.lote.getLoteUnit(sliceXa, sliceXb).subscribe( m => {
      arraym = m
      console.log(m)
     if(arraym.length > 0){
      this.codextotal = arraym[0].totalStock
      console.log(cantcodenumber)
      console.log( this.codextotal)
      if(cantcodenumber <=  this.codextotal){
        this.codexcontados = this.codexcontados + 1
        localStorage.setItem("codexreport", scode)
        localStorage.setItem("codexcontados", this.codexcontados.toString())
        localStorage.setItem("codextotal", this.codextotal.toString())
        localStorage.setItem("codexinuse", sliceXa + "_" + sliceXb)
        var historycodestring:any = localStorage.getItem("historycodes")
        var historycodeobject = JSON.parse(historycodestring)
        var newbjt = []
        if(historycodeobject != null || historycodeobject != undefined){ newbjt = historycodeobject }
        newbjt.push(scode)
        localStorage.setItem("historycodes", JSON.stringify(newbjt))
      }else{
        this.toast.fire({
          icon: 'error',
          title: 'No tiene enfunde'
        })
      }
     }else{
      this.toast.fire({
        icon: 'error',
        title: 'Codigo no escontrado'
      })
     }
    }, ()=>{
      this.toast.fire({
        icon: 'error',
        title: 'Error al procesar'
      })
    })
  }



  loadweeks(order: string) {
    this.loadingadd = true   
    this.service.getDp08acal(order).subscribe( db => {
      this.loadingadd = false   
      this.weeks = db;
    }, () => {
      this.loadingadd = false   
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error al cargar las cosechas.',
      })
    })
  }
  loadcosechas(max:number, order:string){
    this.service.gcosecha(max, order).subscribe(x =>{
      this.cosecha = x
    }, () => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error al cargar las cosechas.',
      })
    })
  }
  loadhaciendas(nomtag: string, properties: string, order:string) {
    this.loadingadd = true    
    this.service.getMaster(nomtag, properties, "ASC").subscribe( HACIE => {
      this.loadingadd = false;
      this.haciendas = HACIE
    }, () => {
      this.loadingadd = false  ;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error al cargar las haciendas.',
      })
    })
  }
  delete(id:number){
    Swal.fire({
      title: '¿Está usted seguro?',
      text: "esta acción es irreversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.dcsecha( id ).subscribe( dd => {      
          this.loadcosechas(50, 'desc')
          Swal.fire({
            icon: 'success',
            title: 'Exito...',
            text: 'Borrada con exito.',
          })
        })
      }
    })
  }
  adddata(){
    var cant:string = localStorage.getItem("codexcontados")!
    var cantotal:any = localStorage.getItem("codextotal")!
    var cantotalnum = Number(cantotal)
    var cantnumber = 0
    if(cant != null){cantnumber = Number(cant)}
    if(cantnumber >= 1 && this.Semana.valid && this.Hacienda.valid){
        this.scosechArr = {
          code_user: sessionStorage.getItem("Code_user"),
          cant_cosecha: cantnumber,
          cortes: cantotalnum,
          semana: this._semana,
          color: this._color_sel,
          hacienda: this.naHacienda,
          f_cosecha: new Date(),
          cod_hacienda:  this._hacienda,
        }
        this.service.scosecha(this.scosechArr).subscribe (x => { 
          if(cantnumber < cantotalnum){
            Swal.fire({
              title: 'Tiene codigos pendientes?',
              text: "Desea reportarlos ahora!",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Si reportarlo'
            }).then((result) => {
              if (result.isConfirmed) {
                this.route.navigate(["error_outline"])
              }else{
                localStorage.removeItem("codexreport")
                this.toast.fire({
                  icon: 'success',
                  title: 'Guardado con exito'
                })
                this.codexcomplet = ""
              }
            })
          }
          this.resetdata()      
          this.loadcosechas(50, 'desc');
        }, (e) => {
          this.loadingadd = false  ;
          this.toast.fire({
            icon: 'error',
            title: 'Error al guardar'
          })
        })
    }else if(cantnumber == 0){
      this.toast.fire({
        icon: 'error',
        title: 'Selecione un codigo'
      })
    }else if(this.Semana.invalid){
      this.toast.fire({
        icon: 'error',
        title: 'Seleciona una semana'
      })
    }else if(this.Hacienda.invalid){
      this.toast.fire({
        icon: 'error',
        title: 'Seleciona una hacienda'
      })
    }
  }
  asignData(color: string, semana: string) {
    this._color_sel = color;
    this._semana = semana;
    localStorage.setItem('_color', color);
    localStorage.setItem('_semana', this._semana);
  }
  getHacienda( nombre: string, codigo: string ) {
    this._hacienda  = codigo;
    this.naHacienda = nombre;
  }
  resetdata(){
    localStorage.removeItem('codexcontados');
    localStorage.removeItem('codextotal');
    localStorage.removeItem('codexinuse');
    localStorage.removeItem('historycodes');
    this.codexcontados = 0
    this.codextotal = 0
    this.codexinuse = ""
  }
}
