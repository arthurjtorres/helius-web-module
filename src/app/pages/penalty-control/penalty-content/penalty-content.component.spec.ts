import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenaltyContentComponent } from './penalty-content.component';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PenaltyControlModule } from '../penalty-control.module';

describe('PenaltyContentComponent', () => {
  let component: PenaltyContentComponent;
  let fixture: ComponentFixture<PenaltyContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenaltyControlModule, NoopAnimationsModule],
      providers: [provideHttpClient(withXhr()), provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PenaltyContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
