import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclesImportComponent } from './vehicles-import.component';

describe('VehiclesImportComponent', () => {
  let component: VehiclesImportComponent;
  let fixture: ComponentFixture<VehiclesImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VehiclesImportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiclesImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
