import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuditoriaService } from 'src/app/services/auditoria.service';
import { DevolucionService } from 'src/app/services/devolucion.service';
import { LoginService } from 'src/app/services/login.service';
import { MotRecusadoService } from 'src/app/services/mot-recusado.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recusado',
  templateUrl: './recusado.component.html',
  styleUrls: ['./recusado.component.css']
})
export class RecusadoComponent implements OnInit {
  impucodecode:any
  disabledpopup = true
  motives = new FormControl("", Validators.required);
  cant = new FormControl("", Validators.required);
  inputopt = new FormControl("", Validators.required);
  showFiller = false;
  option = "Recusado"
  panelOpenState = true;
  titleoption = "";
  descriptmotiv = ""
  titlemotiv = ""
  statemotiv = true
  codex:any 
  show = false;
  public user: any;
  title_header:any;
  icon:any = ""
  listdata:any = []
  historyrec:any = []
  arraytem:any = []
  arrayrec:any = []
  arraycai:any = []
  public data_head: any;
  public _codec_in: string = '';
  public _product: boolean = false;
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
  constructor( private route:ActivatedRoute,public servicemotiv:MotRecusadoService,private router:Router,private loginservice:LoginService, private dns: DevolucionService, private lote: AuditoriaService, public dialog: MatDialog) { }
  copaneelde = document.getElementById("paneel");
  ngOnInit(): void {
    //this.selectopyiopn()
    setTimeout(() => {
      this.selectopyiopn()
      this.show = true
    }, 60);
    this.verificacion()    
    this.user = sessionStorage.getItem('User_Name');   
    this.ghead(); 
    this.loaddatas()
    this.loadfun()
    this.impucodecode = <HTMLInputElement> document.getElementById("input-code");
    this.icon = `${this.route.snapshot?.routeConfig?.path}`
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
  var arrayitemsmenu:any = sessionStorage.getItem('items_menu'); 
  var objetitems = arrayitemsmenu.split(",")
  for(var i = 0; i <= objetitems.length; i++){
    if(objetitems[i].icon_module == this.icon){this.title_header = objetitems[i].name_module}
  }
}
verificacion() {     
  if (sessionStorage.getItem('User_Name') == '' || sessionStorage.getItem('User_Name') == null) {
  } 
}
loaddatas(){
  var tipe = localStorage.getItem("optionsrec") || "";
  if(tipe.length >= 3){
    var token:any = sessionStorage.getItem("Code_user");
    this.arrayrec = []
    this.arraycai = []
    this.lote.loaddata(token, tipe).subscribe( m => {
      this.arraytem = m
      for (let i = 0; i < this.arraytem.length; i++) {
        if(this.arraytem[i].tipo == "REC"){
          this.arrayrec.push(this.arraytem[i])
        }else{
          this.arraycai.push(this.arraytem[i])
        }
      }
      
    }, ()=>{
      this.toast.fire({
        icon: 'error',
        title: 'Reintente mas tarde'
      })
    })
  }
}
selectopyiopn(){
  const dialogseled = this.dialog.open(recusadosOptions, {
    width: 'auto',
    disableClose: this.disabledpopup
  });
  dialogseled.afterClosed().subscribe(resultopt => {
    if(resultopt){
      Swal.fire({
        title: 'Esta seguro que desea continuar con esta opcion',
        showDenyButton: true,
        confirmButtonText: 'Continuar',
        denyButtonText: `Cancelar`,
      }).then((result) => {
        if (result.isConfirmed) {
          var codereport = localStorage.getItem("codexreport");
          if(codereport != undefined || codereport != null || codereport != ""){
            this.impucodecode.value = codereport
            this.search()
          } 
          if(resultopt == 1){
            this.option = "Caido"
            this.statemotiv = false
          }
          this.titleoption = this.option;
          this.option = this.option.toUpperCase();
          this.option = this.option.slice(0, 3)
          localStorage.setItem("optionsrec", this.option)
        } else if (result.isDenied) {
          this.selectopyiopn()
        }
      }) 
    }
})
}
ngOnDestroy(): void{
  this.disabledpopup = false
}
public checkdev:any = [];
  search(){  
    if(this.impucodecode.value != null || this.impucodecode.value != undefined){
      const x = this.impucodecode.value.trim().slice(0,15);
      var history = localStorage.getItem("historyrec")
      var arrayob:Array<string> = []
      if(history != undefined || history != null ){
        arrayob = history?.split(",");
      }
      console.log(arrayob)
      var resp = arrayob.find(a => a === x)
      if(resp == null || resp == undefined){
        localStorage.setItem("codeinuser", x)
        this.searchfin()
      }else{
        this.toast.fire({
          icon: 'error',
          title: 'Codigo ya registrado'
        })
        this.impucodecode.value = ""
      }
    }
  }
  searchfin(){
    if(this.impucodecode.value.length == 18){
      const x = this.impucodecode.value.trim().slice(0,15);
      const sliceXa = x.slice(0,5);
      const sliceXb = x.slice(6,9);
      localStorage.setItem('sliceCodeA', sliceXa);
      this.lote.getLoteUnit(sliceXa, sliceXb).subscribe( m => {
        this.checkdev = m;
        console.log(this.checkdev)
        var verifie = this.checkdev[0]?.cant_dev
        if(verifie == 0){
          Swal.fire({
            title: 'No tiene devoluciones, porfavor ingrese devoluciones primero.',
            showCancelButton: true,
            confirmButtonText: 'Continuar',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/rule']);
            }
          })
        }else{
          this.arrLotes = m;
          this._product = true;
        }
      }, () => {
        this._product = false;
        this.toast.fire({
          icon: 'error',
          title: 'Codigo no encontrado'
        })
        this._codec_in = ''
      })
    }else{
      this.toast.fire({
        icon: 'error',
        title: 'Ingresa un codigo valido'
      })
    }
  }
  verified(){
    if(this.panelOpenState){
      const dialogRef = this.dialog.open(recusadosFragment, {
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
            this.panelOpenState = false;
            this.toast.fire({
              icon: 'success',
              title: 'Verificacion exitosa'
            })
          }, ()=>{
            this.toast.fire({
              icon: 'error',
              title: 'Aceso no autorizado'
            })
          })
        }
      });
    }
  }
  changenumber(data:string, canttotal:number){
    var input = <HTMLSpanElement> document.getElementById("tol-"+ data)
    if(this.cant.value <= canttotal){
      input.innerHTML = `${canttotal - this.cant.value}`
    }else{
      this.cant.setValue(canttotal)
      input.innerHTML = `${canttotal - this.cant.value}`
      this.toast.fire({
        icon: 'error',
        title: 'Cantidad exede'
      })
    }
  }
  savedata(data:string, canttotal:number){
    if(this.statemotiv && this.motives.valid && this.cant.valid){
      this.savedata2(data, canttotal)
    }else if(!this.statemotiv && this.cant.valid){ 
      this.savedata2(data, canttotal)
    }else{
      this.toast.fire({
        icon: 'error',
        title: 'Ingrese datos validos'
      })
    }
  }
  savedata2(data:string, canttotal:number){
    var secuencial = localStorage.getItem("secuencial");
    var x:any =localStorage.getItem("codeinuser")
    var historyrec:any =localStorage.getItem("historyrec")
    var objto:any = []
    if(historyrec != null || historyrec != undefined){objto =  historyrec.split(","); }
    console.log(objto)
    objto.push(x)
      let secuencialfi = secuencial?.padStart(4,'0');
      var numbersecuencial = 0
      if(secuencial == "null"){
        numbersecuencial++;
      }else{
        numbersecuencial = Number(secuencial); 
        numbersecuencial++;
      }
      var datamotive = ""
      if(this.statemotiv){
        datamotive = this.motives.value
      }
      localStorage.setItem("secuencial", `${numbersecuencial}`);
      var token:any = sessionStorage.getItem("Code_user");
      var codex = token + "_" + secuencialfi;
      var today = new Date()
      var year = today.getFullYear();
      var model = {
        observer_recu: "",
        num_recu: this.cant.value,
        date: today, 
        motivo: datamotive,
        token_user: token, 
        tipo: this.option,
        codec_recu: codex
    }
    console.log(model)
    this.lote.savedata(model).subscribe( m => {
      this.loaddatas()
      localStorage.setItem("historyrec", objto.toString())
      this.impucodecode.value = ""
      this.checkdev = []
      localStorage.removeItem("codexreport");
      this.toast.fire({
        icon: 'success',
        title: 'Guardado con exito'
      })
    }, ()=>{
      this.toast.fire({
        icon: 'error',
        title: 'Reintente mas tarde'
      })
    })
  }
  editdata(id:number){

  } 
  ghead() {
    this.data_head = localStorage.getItem('name_module');
  }
  editcam(){
    var secuencial = localStorage.getItem("secuencial");
    let secuencialfi = secuencial?.padStart(4,'0');
    var numbersecuencial = 0
    if(secuencial == "null"){
      numbersecuencial++;
    }else{
      numbersecuencial = Number(secuencial); 
      numbersecuencial++;
    }
    localStorage.setItem("secuencial", `${numbersecuencial}`);
    var token = sessionStorage.getItem("Code_user");
    var codex = token + "_" + secuencialfi;
    var today = new Date()
    var model = {
      id: 2,
      observer_recu: "Prueba2_PUT CORREGIDO",
      num_recu: 5,
      date: today, 
      token_user: token, 
      tipo: "REC",
      motivo: "null",
      codec_recu: "aaaaaarecu"
  }
  }

  public arrLotes : any = [];
  getLotes(codecs: string) {
    const x = codecs.trim().slice(0,15);
    const sliceXa = x.slice(0,5);
    const sliceXb = x.slice(6,9);
    localStorage.setItem('sliceCodeA', sliceXa);

    this.lote.getLoteUnit(sliceXa, sliceXb).subscribe( m => {
      this.arrLotes = m;
      console.log(this.arrLotes)
      this._product = true;
    }, () => {
      this._product = false;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Código no encontrado',
        footer: 'Vuelve a intentarlo'
      })
      this._codec_in = ''
    })

  }
  sendmotiv(){
    if(this.titlemotiv.length >= 3 && this.descriptmotiv.length >= 3){
      var date = new Date();
      var tok = sessionStorage.getItem("Code_user");
      let arrLog: any = {      
        name_mot:  this.titlemotiv,
        descrip_mot: this.descriptmotiv,
        date: date,
        token_session: tok
      }
      this.servicemotiv.senddata(arrLog).subscribe( x => {
        this.loadfun();
        var text = <HTMLInputElement> document.getElementById("input");
        var textarea = <HTMLInputElement> document.getElementById("textarea");
        text.value = ""
        textarea.value = ""
        this.toast.fire({
          icon: 'success',
          title: 'Guardado con exito'
        })
      }, (errr)=>{
        this.toast.fire({
          icon: 'error',
          title: 'Error al cargar la lista'
        })
      })
    }else{
      this.toast.fire({
        icon: 'error',
        title: 'Ingresa datos validos'
      })
    }
  }
  deletehist(id:number){
    var tok = sessionStorage.getItem("Code_user");
    this.servicemotiv.deleteitemhis(id, `${tok}`).subscribe( x => {
      this.loaddatas()
      this.toast.fire({
        icon: 'success',
        title: 'Eliminado con exito'
      })
    }, (err) =>{
      this.toast.fire({
        icon: 'error',
        title: 'Error al eliminar'
      })
    })
  }
  loadfun(){
    var tok = sessionStorage.getItem("Code_user");
    var order = "asc"
    this.servicemotiv.loaddata(`${tok}`, order).subscribe( x => {
      this.listdata = x;
    }, (errr)=>{
      this.toast.fire({
        icon: 'error',
        title: 'Error al cargar la lista'
      })
    })
  }
  updatemotiv(name: string, description:string, id:number){
    var title = <HTMLInputElement> document.getElementById(name);
    var text = <HTMLInputElement> document.getElementById(description)
    var date = new Date();
    var tok = sessionStorage.getItem("Code_user");
    let arrLog: any = {     
      id: id, 
      name_mot:  title.value,
      descrip_mot: text.value,
      date: date,
      token_session: tok
    }
    this.servicemotiv.updatedata(arrLog, id, `${tok}`).subscribe( x => {
      this.toast.fire({
        icon: 'success',
        title: 'Actualizado con exito'
      })
    }, (errr)=>{
      this.toast.fire({
        icon: 'error',
        title: 'Error al cargar la lista'
      })
    })
  }
  deletemotiv(id:number){
    var tok = sessionStorage.getItem("Code_user");
    this.servicemotiv.deletedata(id, `${tok}`).subscribe( x => {
      this.loadfun();
      this.toast.fire({
        icon: 'success',
        title: 'Eliminado con exito'
      })
    }, (errr)=>{
      this.toast.fire({
        icon: 'error',
        title: 'Error al eliminar la lista'
      })
    })
  }
}
@Component({
  selector: 'recusados-fragment',
  templateUrl: 'recusados-fragment.html',
})
export class recusadosFragment {
  constructor(
    public dialogRef: MatDialogRef<recusadosFragment>
  ) {}
  password = new FormControl("", Validators.required);
  onNoClick(): void {
    this.dialogRef.close();
  }
  yesClick(){
    if(this.password.valid){
      this.dialogRef.close(this.password.value);
    }
  }
}

@Component({
  selector: 'recusados-options',
  templateUrl: 'recusados-options-fragment.html',
})
export class recusadosOptions {
  constructor(
    public dialogRef: MatDialogRef<recusadosOptions>
  ) {}
  select(data:number): void {
    this.dialogRef.close(data);
  }
}
