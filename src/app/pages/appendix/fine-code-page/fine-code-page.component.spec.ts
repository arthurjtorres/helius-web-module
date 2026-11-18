import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FineCodePageComponent } from './fine-code-page.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppendixModule } from '../appendix.module';

describe('FineCodePageComponent', () => {
  let component: FineCodePageComponent;
  let fixture: ComponentFixture<FineCodePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppendixModule, NoopAnimationsModule],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FineCodePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
