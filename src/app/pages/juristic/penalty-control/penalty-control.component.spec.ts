import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenaltyControlComponent } from './penalty-control.component';

describe('PenaltyControlComponent', () => {
  let component: PenaltyControlComponent;
  let fixture: ComponentFixture<PenaltyControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PenaltyControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PenaltyControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
