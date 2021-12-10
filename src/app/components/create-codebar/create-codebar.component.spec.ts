import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCodebarComponent } from './create-codebar.component';

describe('CreateCodebarComponent', () => {
  let component: CreateCodebarComponent;
  let fixture: ComponentFixture<CreateCodebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCodebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCodebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
