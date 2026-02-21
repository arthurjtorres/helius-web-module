import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivePageComponent } from './motive-page.component';

describe('MotivePageComponent', () => {
  let component: MotivePageComponent;
  let fixture: ComponentFixture<MotivePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MotivePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotivePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
