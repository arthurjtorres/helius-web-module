import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { VehiclesContentComponent } from './vehicles-content.component';

describe('VehiclesContentComponent', () => {
  let component: VehiclesContentComponent;
  let fixture: ComponentFixture<VehiclesContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [VehiclesContentComponent],
    // Só a casca de abas: os filhos têm specs próprios.
    schemas: [NO_ERRORS_SCHEMA]
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
