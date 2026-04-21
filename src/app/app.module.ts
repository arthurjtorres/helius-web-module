import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TemplateModule } from './template/template.module';
import { HomeComponent } from './pages/home/home.component';
import { JuristicModule } from './pages/juristic/juristic.module';
import { AppendixModule } from './pages/appendix/appendix.module';
import { LandingpageModule } from './pages/landingpage/landingpage.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { UserProfileModule } from './pages/user-profile/user-profile.module';
import { PenaltyControlModule } from './pages/penalty-control/penalty-control.module';
import { EmployeeModule } from './pages/employee/employee.module';
import { VehiclesModule } from './pages/vehicles/vehicles.module';




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TemplateModule,
    JuristicModule,
    AppendixModule,
    LandingpageModule,
    UserProfileModule,
    PenaltyControlModule,
    EmployeeModule,
    VehiclesModule,
],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
