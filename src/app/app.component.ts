
import { Component, OnInit } from '@angular/core';
import { CacheservsService } from './services/cacheservs.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  
  title = 'delf-app';

  constructor( public cache: CacheservsService ) {}

  ngOnInit(): void {
    this.execCache();
  }

  execCache() {
    this.cache.validateCaches();
  }

}
