import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenaltyContentComponent } from './penalty-content.component';

describe('PenaltyContentComponent', () => {
  let component: PenaltyContentComponent;
  let fixture: ComponentFixture<PenaltyContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PenaltyContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PenaltyContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
