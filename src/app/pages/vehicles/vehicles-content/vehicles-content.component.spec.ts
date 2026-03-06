import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclesContentComponent } from './vehicles-content.component';

describe('VehiclesContentComponent', () => {
  let component: VehiclesContentComponent;
  let fixture: ComponentFixture<VehiclesContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VehiclesContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiclesContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
