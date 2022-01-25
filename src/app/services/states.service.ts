import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class StatesService {
  public port: string = environment.port;
  private apiURL = `https://alp-cloud.com:${this.port}/api`;

  constructor(private http: HttpClient) { }

  private arrCabMaster: any = [];
  saveCabeceraMaster( codigo: string, nombre: string, nomtag: string, gestion: string ) {

    this.arrCabMaster = {      
      master:  '',
      codigo:  codigo,
      nombre:  nombre,
      valor:   0.00,
      nomtag:  nomtag,
      gestion: gestion,
      pideval: 0,
      campo1:  '',
      grupo:   '',
      sgrupo:  'HCIE_GR',
      campo2:  '',
      lencod:  0.00

    }
    return this.http.post( this.apiURL + '/control_alp_master_tabla/save_alp_master', this.arrCabMaster );

  }   
// insert into alptabla (master,    codigo, nombre,     valor nomtag gestion pideval campo1 grupo sgrupo campo2 lencod) 
//             values ('ILYIMP', '001'   'Leyenda 1', 0.00  '' '' 0 '' '' '' '' 0)
  
  private arrDetMaster: any = [];
  saveDetailMaster(master: string, codecSecuence: string, nombre: string, grupo: string, hectareaje: number) {

    this.arrDetMaster = {      
      master:  master,
      codigo:  codecSecuence,
      nombre:  nombre,
      valor:   hectareaje,
      nomtag:  '',
      gestion: '',
      pideval: 0,
      campo1:  '',
      grupo:   grupo,
      sgrupo:  '',
      campo2:  '',
      lencod:  0.00
    }
    return this.http.post( this.apiURL + '/control_alp_master_tabla/save_alp_master', this.arrDetMaster );

  }
  
  getMaster(nomtag: string, properties: string, order:string) {  
    return this.http.get( this.apiURL + '/control_alp_master_tabla/geMaster/' + nomtag + '/' + properties + '/' + order);
  }
  getMaster2(master: string) {  
    return this.http.get( this.apiURL + '/control_alp_master_tabla/getLotesByHac/' + master);
  }


  //control_alp_master_tabla/delMasterData/PRUE_MASTER/001
  delLotes(master: string, codec: string) {
    return this.http.get( this.apiURL + '/control_alp_master_tabla/delMasterData/' + master + '/' + codec);
  }

  updtaeNamesHaciendas( nomtag: string, nameHae: string ) {
    return this.http.get( this.apiURL + '/control_alp_master_tabla/updateMasterData/HCIE_GR/' + nomtag + '/'  + nameHae);
  }

  getFilterHac( data: string, opt: string ) {
    return this.http.get( this.apiURL + '/control_alp_master_tabla/FilterDataModuleGBarCode/' + data + '/'  + opt);
  }
}