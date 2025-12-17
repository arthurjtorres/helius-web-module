import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-register-employee',
  standalone: false,
  templateUrl: './register-employee.component.html',
  styleUrl: './register-employee.component.scss'
})
export class RegisterEmployeeComponent implements OnInit {
  employeeData: FormGroup

constructor(){
  this.employeeData = new FormGroup({})
}
ngOnInit(): void {
  
}
}
