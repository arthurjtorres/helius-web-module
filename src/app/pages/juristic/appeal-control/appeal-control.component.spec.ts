import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealControlComponent } from './appeal-control.component';

describe('AppealControlComponent', () => {
  let component: AppealControlComponent;
  let fixture: ComponentFixture<AppealControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppealControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppealControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
