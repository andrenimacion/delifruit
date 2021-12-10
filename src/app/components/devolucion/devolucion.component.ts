import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DevolucionService } from 'src/app/services/devolucion.service';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-devolucion',
  templateUrl: './devolucion.component.html',
  styleUrls: ['./devolucion.component.css']
})
export class DevolucionComponent implements OnInit {
  public icon:any = ""
  public show = false;
  public _codec_in: string = '';
  public historial = [""];
  public arrLotes : any = [];
  public arrLotes1 : any = [];
  public arrLotesstate = false
  public arrDevs: any = [];
  public arrDevs1: any = [];
  public _obser: string = '';
  public cantarest: number = 0;
  public _dev_cant: number = 1;
  public resultsearch = true;
  public resultsearch1 = true;
  public user: any;
  public title_header:any  = ""
  public toast = Swal.mixin({
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
  datestate = false
  modedate = "shortDate"
  showdate(){
    if(this.datestate){
      this.datestate = false
      this.modedate = "shortDate"
    }else{
      this.datestate = true
      this.modedate = "shortTime"
    }
  }
  constructor( public router:ActivatedRoute,public route:Router,public loginservice:LoginService,public dialog: MatDialog,private dns: DevolucionService) { }

  ngOnInit(): void {
    this.getDevos()
    setTimeout(() => {
        this.show = true
    }, 60);
    this.verificacion()    
    this.user = sessionStorage.getItem('User_Name');   
    this.icon = `${this.router.snapshot?.routeConfig?.path}`
    var arrayitemsmenu:any = sessionStorage.getItem('items_menu'); 
    var objetitems = JSON.parse(arrayitemsmenu);
    for(var i = 0; i <= objetitems.length; i++){
      if(objetitems[i]?.icon_module == this.icon){this.title_header = objetitems[i].name_module}
    }
  }
  nextpage(){
    this.route.navigate(["spa"])
  }
  logout(){
    sessionStorage.removeItem('Code_user');
    sessionStorage.removeItem('User_Name');
    sessionStorage.removeItem('Estado');
    this.verificacion()
  }
  verificacion() {     
    if (sessionStorage.getItem('User_Name') == '' || sessionStorage.getItem('User_Name') == null) {
      this.route.navigate(["login"])
    } 
  }
  getDevos() {
    const x = sessionStorage.getItem("Code_user");
    const y = localStorage.getItem('sliceCodeA');
    this.dns.getSobDevs( `${x}`,`${y}` ).subscribe( x => {
      console.log("Lotes")
      console.log(x)
      this.arrDevs = x;
      this.arrDevs1 = x;
    })
  }
  public ArrDevos: any = [];
  sDevsobs( loteProd: string, finit: any, observ: string, cantidad: number, cantidadDev: number ) {
    if(observ.length >= 2){
    this.ArrDevos = {
      lote_prod:  loteProd,
      finit:      finit,
      ffin:       new Date(), 
      observ_dev: observ, 
      cant:       cantidad, 
      cant_dev:   Math.abs(cantidadDev), 
      total:      cantidad - Math.abs(cantidadDev), 
      campo:      '----',
      campoA:     sessionStorage.getItem("Code_user"),
      campoB:     sessionStorage.getItem("User_Name")
    }
    this.dns.saveSobDevs(this.ArrDevos).subscribe( y => {
      this.getDevos()
      this.toast.fire({
        icon: 'success',
        title: 'Agregado con exito'
      })
      this.historydata(loteProd.slice(0, 9))
      this.arrLotes = null;
      this.arrLotes1 = null;
      this.arrLotesstate = false

      this._dev_cant = 1;
      this._obser = ""
    }, (e) => {
      this.toast.fire({
        icon: 'error',
        title: 'Error al guardar'
      })
    })
    }else{
      this.toast.fire({
        icon: 'error',
        title: 'Ingrese un motivo valido'
      })
  }
}
anyfunction(){
  console.log("goal")
}
insercant1(id:string, data:number, index:number, tot:number){
  var number = 0;
  var input1 = <HTMLInputElement> document.getElementById(`input1-${id}-${index}`);
  var total1 = <HTMLDivElement> document.getElementById(`total1-${id}-${index}`);
  number = Number(input1.value)
  if(number >= 0){number = -number}
  if(data == 1 && total1.innerHTML != "0"){
    number = number + -1
    input1.value = `${number}`
    if(tot + number >= 0){
      total1.innerHTML = `${tot + number}`
    }
  }else if(data == 2){
    total1.innerHTML = `${tot + number}`
    input1.value = `${number}`
  }else if(data == 0 && input1.value != "0"){
    number = number + 1
    input1.value = `${number}`
    if(tot + number >= 0){
    total1.innerHTML = `${tot + number}`
  }}
}
insercant(id:string, data:number, index:number, tot:number){
  var number = 0;
  var input = <HTMLInputElement> document.getElementById(`input-${id}-${index}`);
  var total = <HTMLDivElement> document.getElementById(`total-${id}-${index}`);
  var btnsave = <HTMLButtonElement> document.getElementById(`btnsave-${id}-${index}`);
  number = Number(input.value)
  btnsave.style.display = "flex"
  if(number >= 0){number = -number}
  if(data == 1 && total.innerHTML != "0"){
    number = number + -1
    input.value = `${number}`
    if(tot + number >= 0){
      total.innerHTML = `${tot + number}`
    }
  }else if(data == 2){
    total.innerHTML = `${tot + number}`
    input.value = `${number}`
  }else if(data == 0 && input.value != "0"){
    number = number + 1
    input.value = `${number}`
    if(tot + number >= 0){
    total.innerHTML = `${tot + number}`
  }}
}
historydata(codex:string){
  const localhistorial = localStorage.getItem('historial');
  if(localhistorial == null){
    this.historial!.push(codex);
    localStorage.setItem('historial', `${codex}`)
  }else{
    const objethist = localhistorial?.split(",");
    objethist!.push(codex);
    localStorage.setItem('historial', `${objethist}`)
  }
}
getLotes(){
  const localhistorial = localStorage.getItem('historial');
  if(localhistorial == null){
    this.nextsearch()
  }else{
    var code = <HTMLInputElement> document.getElementById("input-code");
    const x = code.value.trim().slice(0,15);
    const sliceXa = x.slice(0,5);
    const sliceXb = x.slice(6,9);
    var codex = sliceXa+ "_" +sliceXb
    const objethist = localhistorial?.split(",");
    const resultado = objethist.find( code=> code ===  codex);
    if(resultado == undefined){
      this.nextsearch()
    }else{
      code.value = ""
      this.arrLotesstate = false
      this.arrLotes = null;
      this.arrLotes1 = null;
      this.toast.fire({
        icon: 'error',
        title: 'No esta disponible'
      })
    }
  }
}
//    this.historial!.push(sliceXa+ "_" +sliceXb);
nextsearch() {
  var code = <HTMLInputElement> document.getElementById("input-code");
  if(code.value.length >= 18 && code.value.length <= 20){
  const x = code.value.trim().slice(0,15);
  const sliceXa = x.slice(0,5);
  const sliceXb = x.slice(6,11);
  localStorage.setItem('sliceCodeA', sliceXa);
  this.dns.getLoteUnit(sliceXa, sliceXb).subscribe( m => {
    this.arrLotesstate = true
      this.arrLotes = m;
      this.arrLotes1 = m;
      this.getDevos()
    }, (e) => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Código no encontrado',
        footer: 'Vuelve a intentarlo'
      })
      this._codec_in = ''
    })
    code.value = ""
  }
}
aument(data:number, cant:number){
  var value =cant + this.cantarest 
  if(data == 1 && value >= 1){
    this.cantarest = this.cantarest + -1
  }else if(data == 2){
    if(this.cantarest >= 0){
      this.cantarest = -this.cantarest
    }
  }else if(data == 0 && this.cantarest != 0){
    this.cantarest = this.cantarest + 1
  }
}
deleteitemhist(codex:string){
  var token:any = sessionStorage.getItem("Code_user")
  this.dns.deletehistunit(token, codex.slice(0, -2)).subscribe( x => {
    this.getDevos()
    this.toast.fire({
      icon: 'success',
      title: 'Borrado con exito'
    })
  })
}
verified(select:boolean, lotePK: string, finit: any, observ: string, cantidad: number, id:string, index:number, state:boolean){
  var admin:any = sessionStorage.getItem("Estado")
  if(admin == "A"){
    const dialogRef = this.dialog.open(devolucionFragment, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(result => {
      var webusu = sessionStorage.getItem('User_Name');
      if(result && webusu){
        let arrLog: any = {      
          WebUsu:  webusu,
          WebPass: result
        }
        this.loginservice.login(arrLog).subscribe(x =>{
          this.toast.fire({
            icon: 'success',
            title: 'Verificacion exitosa'
          })
          if(select){
            this.updatePK(lotePK, finit, observ, cantidad, id, index, state)
          }else{
            this.deleteitemhist(lotePK)
          }
        }, ()=>{
          this.toast.fire({
            icon: 'error',
            title: 'Aceso no autorizado'
          })
        })
      }
    });
  }else if (admin == null){
    this.toast.fire({
      icon: 'error',
      title: 'Inicia sesion nuevamente'
    })
  }else{
    this.toast.fire({
      icon: 'error',
      title: 'Usted no puede realizar estos cambios'
    })
  }
}
updatePK(lotePK: string, finit: any, observ: string, cantidad: number, id:string, index:number, state:boolean) {
  var input = <HTMLInputElement> document.getElementById(`input-${id}-${index}`);
  var input1 = <HTMLInputElement> document.getElementById(`input1-${id}-${index}`);
  var number = 0
  if(state){
    number = Number(input1.value)
  }else{
    number = Number(input.value)
  }
  this.ArrDevos = {
    lote_prod:  lotePK,
    finit:      finit,
    ffin:       new Date(), 
    observ_dev: observ, 
    cant:       cantidad, 
    cant_dev:   number, 
    total:      cantidad - Math.abs(number), 
    campo:      '----',
    campoA:     sessionStorage.getItem("Code_user"),
    campoB:     sessionStorage.getItem("User_Name")
  }
  console.log(this.ArrDevos)
  this.dns.putSobDevs(lotePK, this.ArrDevos).subscribe( upd => {
    this.toast.fire({
      icon: 'success',
      title: 'Actualizado con exito'
    })
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
}

@Component({
  selector: 'devolucion-fragment',
  templateUrl: 'devolucion-fragment.html',
})
export class devolucionFragment {
  constructor(
    public dialogRef: MatDialogRef<devolucionFragment>
  ) {}
  password = new FormControl("ad123", Validators.required);
  onNoClick(): void {
    this.dialogRef.close();
  }
  yesClick(){
    if(this.password.valid){
      this.dialogRef.close(this.password.value);
    }
  }
}