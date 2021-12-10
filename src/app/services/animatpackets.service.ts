import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimatpacketsService {

  constructor() { }

  
  objectAnim(iterator: any, idObject: string, animationparam: string, time: number) {
        
    setTimeout( () =>{
      let a = <HTMLDivElement> document.getElementById(`${idObject}`)
      a.style.animation = animationparam;
      a.style.opacity = '1';
    },time * iterator )
    
  }

}
