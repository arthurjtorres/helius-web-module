import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenaltyDetailsComponent } from './penalty-details.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PenaltyControlModule } from '../penalty-control.module';

describe('PenaltyDetailsComponent', () => {
  let component: PenaltyDetailsComponent;
  let fixture: ComponentFixture<PenaltyDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenaltyControlModule, NoopAnimationsModule],
      providers: [{ provide: MatDialogRef, useValue: { close: () => undefined } }, { provide: MAT_DIALOG_DATA, useValue: {} }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PenaltyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
