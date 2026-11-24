import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuItemComponent } from './menu-item.component';
import { provideRouter } from '@angular/router';
import { TemplateModule } from '../template.module';

describe('MenuItemComponent', () => {
  let component: MenuItemComponent;
  let fixture: ComponentFixture<MenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateModule],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('item', { label: 'Início', route: '/', icon: 'home' });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
