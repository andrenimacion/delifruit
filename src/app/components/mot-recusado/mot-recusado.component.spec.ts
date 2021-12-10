import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotRecusadoComponent } from './mot-recusado.component';

describe('MotRecusadoComponent', () => {
  let component: MotRecusadoComponent;
  let fixture: ComponentFixture<MotRecusadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotRecusadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MotRecusadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
