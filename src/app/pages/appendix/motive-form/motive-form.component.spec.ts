import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotiveFormComponent } from './motive-form.component';

describe('MotiveFormComponent', () => {
  let component: MotiveFormComponent;
  let fixture: ComponentFixture<MotiveFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MotiveFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotiveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
