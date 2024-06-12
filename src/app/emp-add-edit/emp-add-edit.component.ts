import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../core/core.service';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-emp-add-edit',
  templateUrl: './emp-add-edit.component.html',
  styleUrls: ['./emp-add-edit.component.scss'],
})
export class EmpAddEditComponent implements OnInit {
  empForm: FormGroup;

  education: string[] = [
    'Matric',
    'Diploma',
    'Intermediate',
    'Graduate',
    'Post Graduate',
  ];

  constructor(
    private _fb: FormBuilder,
    private _empService: EmployeeService,
    private _dialogRef: MatDialogRef<EmpAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService
  ) {
    this.empForm = this._fb.group({
      firstName: '',
      lastName: '',
      email: '',
      dob: '',
      gender: '',
      education: '',
      company: '',
      experience: '',
      package: '',
      id:''
    });
  }

  ngOnInit(): void {
 
    this.empForm.patchValue(this.data);
  }

  onFormSubmit() {
    if (this.empForm.valid) {
      if (this.data) {
console.log(this.data,this.empForm.value)
    fetch(`http://localhost:5001/applicant/${this.empForm.value.id}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.empForm.value)
  })
  .then(response => {
    
    this._empService
      .getEmployeeList()
      .subscribe({
        next: (val: any) => {
          this._coreService.openSnackBar('Employee detail updated!');
          this._dialogRef.close(true);
        },
        error: (err: any) => {
          console.error(err);
        },
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return response.json();
  })
  .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
     
  });

      } else {
        if (this.empForm.valid) {
          
        
          fetch("http://localhost:5001/applicant", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.empForm.value),
          }).then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            
           console.log(data.email,this.empForm.value);
            this._empService.addEmployee(this.empForm.value).subscribe({
                  next: (val: any) => {
                    this._coreService.openSnackBar('Employee added successfully');
                    this._dialogRef.close(true);
                  },
                  error: (err: any) => {
                    console.error(err);
                  },
                });
            console.log('Success:', data);
          })
          .catch(error => {
            console.error('Error:', error);
          });

        this._empService.addEmployee(this.empForm.value).subscribe({
          next: (val: any) => {
        
            this._coreService.openSnackBar('Employee added successfully');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      }
    }
  }
}
}
