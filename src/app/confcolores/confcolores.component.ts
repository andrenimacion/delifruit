import { Component, OnInit } from '@angular/core';
import { ConfcolorsService } from '../services/confcolors.service';

@Component({
  selector: 'app-confcolores',
  templateUrl: './confcolores.component.html',
  styleUrls: ['./confcolores.component.css']
})
export class ConfcoloresComponent implements OnInit {


  public _valor: string = '';
  public _color: string = '';
  public data_head: any;

  constructor(public smas: ConfcolorsService) { }

  ngOnInit(): void {
    this.gcolor();
    this.ghead();
  }


  ghead() {
    this.data_head = localStorage.getItem('name_module');
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

    this.arrmaster = {
      hex_cod_color : color,
      name_labor    : value,
      descrip_labor : 'conf_color',
      s_codec: `${localStorage.getItem('count-secuence')}`
    }

    console.log( this.arrmaster );

    this.smas.conf_code_color(this.arrmaster).subscribe( x => {
      console.log('Bien!!')
      console.log(x);

      this.gcolor();

    }, () => {
      console.warn('MAl!')
    })

  }

  public arrGcolor: any = [];
  gcolor() {
    this.smas.gecolor('conf_color').subscribe( color => {
      this.arrGcolor = color;
    })
  }


  dcolor( np: string ) {
    this.smas.decolor('conf_color', np).subscribe( x => {
      this.gcolor();
    })
  }
}
