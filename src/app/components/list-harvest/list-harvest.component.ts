import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as qrcode from 'qrcode-generator';
import { AuditoryService } from 'src/app/services/auditory.service';

@Component({
  selector: 'app-list-harvest',
  templateUrl: './list-harvest.component.html',
  styleUrls: ['./list-harvest.component.css']
})
export class ListHarvestComponent implements OnInit {

  caidos = 0
  tag = ""
  lote = 0
  hacienda = ""
  arr:any = []
  arrdata:any = []
  constructor( public dialogRef: MatDialogRef<ListHarvestComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private auditoriasvc:AuditoryService ) {}
  ngOnInit(): void {
    this.arr = this.data.arr
    this.arrdata = this.data.data
    this.tag = this.data.inuse
    this.lote = this.selectlot(this.data.data[0].codec_lotes)
    this.hacienda = this.selectdeli(this.data.data[0].codec_lotes)
    this.contar_caidos()
  }
  ngOnDestroy(){
    this.dialogRef.close(this.arr);
  }
  selectitem(item:string){  
    var module = localStorage.getItem("name_module") || "Harvest"
    var arr = this.arr.find((x:any)=>x.codigo == item)
    var code = this.tag + item
    if(arr.state){
      arr.state = false
      this.auditoriasvc.saveaudit("Deseleciono como caido el codigo " + code, module)
    }else{
      arr.state = true
      this.auditoriasvc.saveaudit("Seleciono como caido el codigo " + code, module)
    }
    this.contar_caidos()
  }
  selectdeli(data:String):string{
    return data.split(".")[0].toString().replace("D", "")
  }
  selectlot(data:String):number{
    return Number(data.split(".")[1])
  }
  contar_caidos(){
    this.caidos = 0
    for(let i = 0;i < this.arr.length;i++){
      if(this.arr[i].state){
        this.caidos = this.caidos + 1
      }
    }
  }
  closed(){
    this.dialogRef.close(this.arr);
  }
  generate_codeqr(data:string):string{
    var qr = qrcode(0, 'M');
    qr.addData(`${this.tag + data}`);
    qr.make();
    return `${qr.createDataURL(3, 0)}`;
}
}
