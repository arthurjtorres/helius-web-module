import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppendixContentComponent } from './appendix-content.component';

describe('AppendixContentComponent', () => {
  let component: AppendixContentComponent;
  let fixture: ComponentFixture<AppendixContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppendixContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppendixContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
