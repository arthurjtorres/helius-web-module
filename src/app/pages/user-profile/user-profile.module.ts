import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserProfileRoutingModule } from './user-profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';


@NgModule({
    imports: [
        CommonModule,
        UserProfileRoutingModule,
        MatCardModule,
        MatIconModule,
        MatDividerModule,
        ProfileComponent,
    ]
})
export class UserProfileModule { }
