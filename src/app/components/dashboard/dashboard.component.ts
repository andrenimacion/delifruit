import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimatpacketsService } from 'src/app/services/animatpackets.service';
import { ControlModuleService } from 'src/app/services/control-module.service';
import { TimeService } from 'src/app/services/time.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor( 
    public mods: ControlModuleService,   
    public an: AnimatpacketsService,
    public dt: TimeService,
    private router: Router) { }

    public modsArr: any = [];
    public user: any;
    statemenu = true
  ngOnInit() {
    this.gMods();    
    this.user = sessionStorage.getItem('User_Name');    
    this.verificacion()    
  }
  logout(){
    sessionStorage.removeItem('Code_user');
    sessionStorage.removeItem('User_Name');
    sessionStorage.removeItem('Estado');
    this.verificacion()
  }
  verificacion() {     
    if (sessionStorage.getItem('User_Name') == '' || sessionStorage.getItem('User_Name') == null) {
      this.router.navigate(['/login']);
      console.log('/login')
    } 
  }
  changenewtab(){
    if(this.statemenu){
      this.statemenu = false
    }else{
      this.statemenu = true
    }
  }
  public count: number = 0;

  gMods() {
    this.mods.getModulesGeneral().subscribe( m => {
      console.log(m)
      sessionStorage.setItem('items_menu', JSON.stringify(m)); 
      this.modsArr = m;
      for( let i = 0; i<=this.modsArr.length; i++ )
      {
        this.an.objectAnim( i, this.modsArr[i].id, 'enteranim ease .5s 1', 100 );
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
