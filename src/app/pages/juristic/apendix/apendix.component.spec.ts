import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApendixComponent } from './apendix.component';

describe('ApendixComponent', () => {
  let component: ApendixComponent;
  let fixture: ComponentFixture<ApendixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApendixComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApendixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
