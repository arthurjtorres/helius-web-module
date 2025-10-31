import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CTDOPControlComponent } from './ctdop-control.component';

describe('CtdopControlComponent', () => {
  let component: CTDOPControlComponent;
  let fixture: ComponentFixture<CTDOPControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CTDOPControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CTDOPControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
