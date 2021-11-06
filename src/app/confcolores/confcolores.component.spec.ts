import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfcoloresComponent } from './confcolores.component';

describe('ConfcoloresComponent', () => {
  let component: ConfcoloresComponent;
  let fixture: ComponentFixture<ConfcoloresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfcoloresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfcoloresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
