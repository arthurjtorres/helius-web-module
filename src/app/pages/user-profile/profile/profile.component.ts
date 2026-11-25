import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  user$ = inject(AuthService).getUser();

  ngOnInit(): void {
    
  }
}
