import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecusadoComponent } from './recusado.component';

describe('RecusadoComponent', () => {
  let component: RecusadoComponent;
  let fixture: ComponentFixture<RecusadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecusadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecusadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
