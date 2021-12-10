import { Component, OnInit } from '@angular/core';
import { AuditoriaService } from 'src/app/services/auditoria.service';

@Component({
  selector: 'app-auditoria',
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.css']
})
export class AuditoriaComponent implements OnInit {

 panelOpenState = false; 
  constructor( public ars: AuditoriaService ) { }

  ngOnInit(): void {
    const usx: any = sessionStorage.getItem('User_Name');
    this.getAudMods();
    this.getAudit(usx, '_');
  }

  public arrSync: any = [];
  getAudMods() {
    this.ars.getMenuAudit().subscribe( x => {
      this.arrSync = x;
      console.log(x);
    }) 
  }

  public ArrAudit: any = [];
  //Esta funcion nos devuelve las cantidad de ipresiones por usuario
  getAudit( a: string, b: string ) {
    this.ars.getAuditPrint(a, b).subscribe( y => {
      this.ArrAudit = y;
      console.log(this.ArrAudit);
    })
  }

}
