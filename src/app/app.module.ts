import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TemplateModule } from './template/template.module';
import { HomeComponent } from './pages/home/home.component';
import { JuristicModule } from './pages/juristic/juristic.module';
import { HumanResourcesModule } from './pages/human-resources/human-resources.module';
import { AppendixModule } from './pages/appendix/appendix.module';




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
    HumanResourcesModule,
    AppendixModule,
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
