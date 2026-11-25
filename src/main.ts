import { provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './app/core/interceptors/auth.interceptor';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module';
import { TemplateModule } from './app/template/template.module';
import { JuristicModule } from './app/pages/juristic/juristic.module';
import { AppendixModule } from './app/pages/appendix/appendix.module';
import { LandingpageModule } from './app/pages/landingpage/landingpage.module';
import { UserProfileModule } from './app/pages/user-profile/user-profile.module';
import { PenaltyControlModule } from './app/pages/penalty-control/penalty-control.module';
import { EmployeeModule } from './app/pages/employee/employee.module';
import { VehiclesModule } from './app/pages/vehicles/vehicles.module';
import { CompanyModule } from './app/pages/company/company.module';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, AppRoutingModule, TemplateModule, JuristicModule, AppendixModule, LandingpageModule, UserProfileModule, PenaltyControlModule, EmployeeModule, VehiclesModule, CompanyModule),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ]
})
  .catch(err => console.error(err));
