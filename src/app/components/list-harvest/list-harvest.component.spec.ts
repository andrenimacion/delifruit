import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListHarvestComponent } from './list-harvest.component';

describe('ListHarvestComponent', () => {
  let component: ListHarvestComponent;
  let fixture: ComponentFixture<ListHarvestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListHarvestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListHarvestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
