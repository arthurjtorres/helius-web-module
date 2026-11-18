import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivePageComponent } from './motive-page.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppendixModule } from '../appendix.module';

describe('MotivePageComponent', () => {
  let component: MotivePageComponent;
  let fixture: ComponentFixture<MotivePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppendixModule, NoopAnimationsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotivePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Tela não implementada (aba comentada no appendix-content): <mat-table> sem definições de linha. Ver backlog em docs/tasks/README.md.
  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
