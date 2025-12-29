import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FineCodeFormComponent } from './fine-code-form.component';

describe('FineCodeFormComponent', () => {
  let component: FineCodeFormComponent;
  let fixture: ComponentFixture<FineCodeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FineCodeFormComponent]
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
