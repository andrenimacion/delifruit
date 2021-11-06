import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimapacketsService } from '../services/animapackets.service';
import { ControlModulesService } from '../services/control-modules.service';
import { TimeService } from '../services/time.service';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent implements OnInit {
 
  constructor( 
    public mods: ControlModulesService,   
    public an: AnimapacketsService,
    public dt: TimeService,
    private router: Router) { }

    public modsArr: any = [];
    public user: any;

  ngOnInit() {
    this.gMods();    
    this.user = sessionStorage.getItem('User_Name');        
  }

  public count: number = 0;

  gMods() {
    this.mods.getModulesGeneral().subscribe( m => {
      this.modsArr = m;
      for( let i = 0; i<=this.modsArr.length; i++ )
      {
        this.an.objectAnim( i, this.modsArr[i].id, 'enteranim ease 1.5s 1', 100 );
      }
    })
  }

  relink(link: string, id: any, name: string) {

    this.dt.timeSetformatSQL(link, 'init');

    localStorage.setItem(`name_module`, name);
    this.an.objectAnim( 1, id, 'outanim ease 1.5s 1', 100)
    console.log(link);
    
    setTimeout(() => {
      this.router.navigate([`/${link}`]);
    }, 1000);
  
  }


}
