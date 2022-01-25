import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuditoryService } from 'src/app/services/auditory.service';
import { ColorService } from 'src/app/services/color.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.css']
})
export class ColorComponent implements OnInit {

  msecuential = 0
  arrcolors:any = []
  name_color = "Cinta Azul"
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
  add_color_form = new FormGroup({
    name: new FormControl('Cinta ', Validators.required),
    color: new FormControl("", Validators.required),
   }); 
  constructor(public route:Router, public auditory:AuditoryService, public colorsvc: ColorService, public dialog:MatDialog, ) { }

  ngOnInit(): void {
    this.loadcolors()
  }
  changecolor(event:any){
    var div = <HTMLDivElement> document.getElementById("divcolor")
    div.style.background = event.target.value
  }
  changename(){
    this.name_color = this.add_color_form.get("name")?.value
  }
  loadcolors(){
    this.colorsvc.gecolor('conf_color', this.value_order, this.state_order).subscribe( color => {
      this.arrcolors = color;
      console.log(color)
      this.obtainsecuential()
    })
  }
  obtainsecuential(){
    for(let i = 0;i < this.arrcolors.length;i++){
      var number = Number(this.arrcolors[i].s_codec)
      if(number > this.msecuential){
        this.msecuential = number
      }
    }
  }
  upercasenam(name:string):string{
    var namearr = name.split(" ")
    var result = ""
    for(let i = 0; i < namearr.length;i++){
     var namelo = namearr[i].toLowerCase()
     var rest = namelo.slice(1)
     var leter = namelo.slice(0,1).toUpperCase()
     result += leter + rest + " "
    }
    return result
 }
 deletecolor(data:any){
  var mmodule = localStorage.getItem("name_module") || "Configuracion de color"
  var text = "Borro "+ data.name_labor +" con color " + data.hex_cod_color
  const dialogRef = this.dialog.open(alertremovecolor, {
    width: '250px'
  });
  dialogRef.afterClosed().subscribe(result => {
    if(result != undefined){
        this.colorsvc.decolor('conf_color', data.s_codec).subscribe({
          next:()=>{
            this.auditory.saveaudit(text, mmodule)
            this.loadcolors()
            this.toast.fire({
              icon: 'success',
              title: "Borrado con exito"
            })
          }, error:()=>{
            this.toast.fire({
              icon: 'error',
              title: "Error al Borrar el color"
            })
          }
        })
      if(result.check){
        console.log("entro")
        var text = "Borro etiquetas del color "+ data.name_labor
        var module = "configuracicoplor"
        var token:any = sessionStorage.getItem("Code_user");
        var codecolor:string = data.hex_cod_color.slice(1, 7);
        this.colorsvc.removeallcolor(module , token, codecolor, 1).subscribe({
          next:()=>{
            this.auditory.saveaudit(text, mmodule)
            this.loadcolors()
            this.toast.fire({
              icon: 'success',
              title: "Borradas las etiquetas con exito"
            })
          }, error:()=>{
            this.toast.fire({
              icon: 'error',
              title: "Error al Borrar las etiquetas"
            })
          }
        })
      }
    }
  })
 }
  savecolor(){
    if(this.add_color_form.valid){
      var module = localStorage.getItem("name_module") || "Configuracion de color"
      var secuential = this.msecuential + 1
      var color = this.add_color_form.get("color")?.value
      var name = this.add_color_form.get("name")?.value
      var arrmaster = {
        hex_cod_color : this.upercasenam(color),
        name_labor    : this.upercasenam(name),
        descrip_labor : 'conf_color',
        s_codec: secuential.toString().padStart(3, "0")
      }
      this.colorsvc.conf_code_color(arrmaster).subscribe({
        next:()=>{
          this.add_color_form.get("name")?.setValue("Cinta ")
          var text = "Creo "+this.upercasenam(color) +" con color " + this.upercasenam(color)
          this.auditory.saveaudit(text, module)
          this.loadcolors()
          this.toast.fire({
            icon: 'success',
            title: "Guardado con exito"
          })
        }, error:()=>{
          this.toast.fire({
            icon: 'error',
            title: "Error al guardar el color"
          })
        }
      })
    }else{
      this.toast.fire({
        icon: 'error',
        title: "Verifique los datos ingresados"
      })
    }
  }

  state_order = "ASC" // Si es ASC o DESC
  value_order = "name_labor" // El valor por el q se va a order.. ejemp: id, color, etc
  icon_order = "expand_more" // Es el icono del estado del orden
  changeorder(value:string){
    var element = <HTMLDivElement> document.getElementById(this.value_order)// Quitamos el icono antiguo
    element.innerHTML = ""
    if(this.state_order == "ASC"){
      this.state_order = "DESC";this.icon_order = "expand_less" 
    }else{
      this.state_order = "ASC"; this.icon_order = "expand_more" 
    }
    this.value_order = value
    var element = <HTMLDivElement> document.getElementById(value) // Agregamnos el nuevo icono
    element.innerHTML = this.icon_order
    this.loadcolors()// Aqui se llama la api para volver a cargar los datos
  }
  nexttab(){
    var items = <HTMLDivElement> document.getElementById("tab")
    items.style.opacity = "0"
    items.style.transform = "scale(0.8)"
    setTimeout(() => {
      this.route.navigate(["./date_range"])
    }, 300);
  }
}

@Component({
  selector: 'alertremovecolor',
  templateUrl: 'alertremovecolor.html',
  styleUrls: ['./color.component.css']
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