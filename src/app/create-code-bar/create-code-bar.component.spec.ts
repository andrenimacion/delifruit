import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCodeBarComponent } from './create-code-bar.component';

describe('CreateCodeBarComponent', () => {
  let component: CreateCodeBarComponent;
  let fixture: ComponentFixture<CreateCodeBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCodeBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCodeBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
