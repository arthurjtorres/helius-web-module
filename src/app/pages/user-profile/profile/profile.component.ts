import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { MatCard, MatCardHeader, MatCardAvatar, MatCardTitle, MatCardSubtitle, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/list';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
    imports: [MatCard, MatCardHeader, MatCardAvatar, MatIcon, MatCardTitle, MatCardSubtitle, MatCardContent, MatDivider, AsyncPipe]
})
export class ProfileComponent {
  user$ = inject(AuthService).getUser();
}
