import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalbanComponent } from './calban.component';

describe('CalbanComponent', () => {
  let component: CalbanComponent;
  let fixture: ComponentFixture<CalbanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalbanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalbanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
