import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenaltyPageComponent } from './penalty-page.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PenaltyControlModule } from '../penalty-control.module';

describe('PenaltyPageComponent', () => {
  let component: PenaltyPageComponent;
  let fixture: ComponentFixture<PenaltyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenaltyControlModule, NoopAnimationsModule],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PenaltyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
