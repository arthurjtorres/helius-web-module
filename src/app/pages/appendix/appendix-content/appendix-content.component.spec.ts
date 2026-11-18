import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppendixContentComponent } from './appendix-content.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppendixModule } from '../appendix.module';

describe('AppendixContentComponent', () => {
  let component: AppendixContentComponent;
  let fixture: ComponentFixture<AppendixContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppendixModule, NoopAnimationsModule],
      providers: [provideHttpClient(), provideHttpClientTesting()]
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
