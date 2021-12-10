import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ColoresService } from 'src/app/services/colores.service';
import { Dp08acalService } from 'src/app/services/dp08acal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-colores',
  templateUrl: './colores.component.html',
  styleUrls: ['./colores.component.css']
})
export class ColoresComponent implements OnInit {
  icon:any = ""
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
  public _valor: string = '';
  public _color: string = '';
  public data_head: any;
  public user: any;
  title_header:any;
  constructor( public router:ActivatedRoute,public route:Router,public smas: ColoresService, private gdp: Dp08acalService, public dialog:MatDialog) { }
  show = false
  ngOnInit(): void {
    this.gcolor();
    this.ghead();
    setTimeout(() => {
        this.show = true
    }, 60);
    this.verificacion()    
    this.user = sessionStorage.getItem('User_Name');   
    this.title_header = localStorage.getItem("name_module") 
    this.icon = `${this.router.snapshot?.routeConfig?.path}`
    var arrayitemsmenu:any = sessionStorage.getItem('items_menu'); 
    var objetitems = JSON.parse(arrayitemsmenu);
    for(var i = 0; i <= objetitems.length; i++){
      if(objetitems[i]?.icon_module == this.icon){this.title_header = objetitems[i].name_module}
    }
    this._valor = "Cinta "
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
  ghead() {
    this.data_head = localStorage.getItem('name_module');
  }
  nextpage(){
    this.route.navigate(["date_range"])
  }

  public arrmaster: any = [];
  public count: number = 0;
  secuenciador() {

    let xx: string = '00';
    let z: any = localStorage.getItem('count-secuence') 

    if( localStorage.getItem('count-secuence') == undefined || localStorage.getItem('count-secuence') == '' ){
      this.count ++;
      localStorage.setItem('count-secuence', '00'+this.count.toString());      
    }
    else if( Number(localStorage.getItem('count-secuence')) >= 1 ) {
      // if( z.length <= 1 ) {
      //   localStorage.setItem('count-secuence', '00'+this.count.toString());
      // }
      this.count = Number( localStorage.getItem('count-secuence') );
      this.count ++;
      localStorage.setItem('count-secuence', '00'+this.count.toString());
      if(Number(localStorage.getItem('count-secuence')) > 9  && Number(localStorage.getItem('count-secuence')) <= 99 ){
        localStorage.setItem('count-secuence', '0'+this.count.toString());
      } else {
        // console.log('Es mayor a 99')
        localStorage.setItem('count-secuence', this.count.toString());
      }
    }
  }

  salpmaster(color: string, value: string) {
    const string = value.toLowerCase();
    const str2 = string.charAt(0).toUpperCase() + string.slice(1);
    if(color.length >= 6 && value.length >= 3){
      this.arrmaster = {
        hex_cod_color : color,
        name_labor    : str2,
        descrip_labor : 'conf_color',
        s_codec: `${localStorage.getItem('count-secuence')}`
      }
      this.smas.conf_code_color(this.arrmaster).subscribe( x => {
        this.gcolor();
        this.toast.fire({
          icon: 'success',
          title: 'Guardado con exito'
        })
      }, () => {
        this.toast.fire({
          icon: 'error',
          title: 'Error al guardar el color'
        })
      })
    }else{
      this.toast.fire({
        icon: 'error',
        title: 'Datos invalidos'
      })
    }
  }

  public arrGcolor: any = [];
  gcolor() {
    this.smas.gecolor('conf_color').subscribe( color => {
      this.arrGcolor = color;
    })
  }

  removecolor(np:string, id:string){
    const dialogRef = this.dialog.open(alertremovecolor, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result != undefined){
        var name_module:any = localStorage.getItem("name_module");
        var token:any = sessionStorage.getItem("Code_user");
        var codecolor:string = np.slice(1, 7);
        var option = 0
        if(result.check){option = 1}
          this.smas.decolor('conf_color', id).subscribe(x=>{
            this.smas.removeallcolor(name_module , token, codecolor, option).subscribe( m => {
              console.log(m);
              this.gcolor()
              this.toast.fire({
                icon: 'success',
                title: 'Borrado con exito'
              })
            })
          })
      }
    })
  }
}

@Component({
  selector: 'alertremovecolor',
  templateUrl: 'alertremovecolor.html',
  styleUrls: ['alertremovecolor.css']
})
export class alertremovecolor {
  checkformcontrol = new FormControl(false);
  totalTime = 5;
  textcont = "";
  enablebtn = true
  constructor(
    public dialogRef: MatDialogRef<alertremovecolor>
  ) {}
  acept(): void {
    this.dialogRef.close({check: this.checkformcontrol.value});
  }
  ngOnInit(): void {
    this.updateClock()
  }
  cancelbtn(){
    this.dialogRef.close();
  }
updateClock() {
  if(this.totalTime==0){
    this.textcont = "Aceptar"
    this.enablebtn = false
  }else{
  this.totalTime-=1;
  this.textcont = "Espere " + this.totalTime;
  setTimeout(() => {
    this.updateClock()
  }, 1000);
}}
}