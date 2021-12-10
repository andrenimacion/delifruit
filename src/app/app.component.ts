import { Component } from '@angular/core';
import { CacheService } from './services/cache.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor( public cache: CacheService ) {}
  title = 'last-delifruit';
    ngOnInit(): void {
    this.execCache();
  }

  execCache() {
    this.cache.validateCaches();
  }
}
