import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FineCodePageComponent } from './fine-code-page.component';

describe('FineCodePageComponent', () => {
  let component: FineCodePageComponent;
  let fixture: ComponentFixture<FineCodePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FineCodePageComponent]
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
