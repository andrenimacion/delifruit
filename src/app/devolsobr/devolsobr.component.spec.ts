import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevolsobrComponent } from './devolsobr.component';

describe('DevolsobrComponent', () => {
  let component: DevolsobrComponent;
  let fixture: ComponentFixture<DevolsobrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevolsobrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevolsobrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
