import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EmployeeService } from '../employee.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployeeInterface } from '../employee.interface';

@Component({
  selector: 'app-employee-page-form',
  standalone: false,
  templateUrl: './employee-page-form.component.html',
  styleUrl: './employee-page-form.component.scss'
})
export class EmployeePageFormComponent implements OnInit{
  employeeForm!: FormGroup;
  isEdit: boolean = false;
  
  employeeData: FormGroup

  constructor (
    private fb: FormBuilder,
    private service: EmployeeService,
    private dialogRef: MatDialogRef<EmployeePageFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmployeeInterface
  ) {
    this.employeeData = new FormGroup({}) //apagar
  }

  ngOnInit(): void {
    this.isEdit = !!this.data;

    this.employeeForm = this.fb.group({})
  }


  onSave(): void {
    
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
