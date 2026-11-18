import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FineCodeFormComponent } from './fine-code-form.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppendixModule } from '../appendix.module';

describe('FineCodeFormComponent', () => {
  let component: FineCodeFormComponent;
  let fixture: ComponentFixture<FineCodeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppendixModule, NoopAnimationsModule],
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: MatDialogRef, useValue: { close: () => undefined } }, { provide: MAT_DIALOG_DATA, useValue: {} }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FineCodeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
