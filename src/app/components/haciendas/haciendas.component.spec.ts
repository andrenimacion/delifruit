import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaciendasComponent } from './haciendas.component';

describe('HaciendasComponent', () => {
  let component: HaciendasComponent;
  let fixture: ComponentFixture<HaciendasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HaciendasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HaciendasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
