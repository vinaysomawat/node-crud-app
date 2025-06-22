import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IUser } from '../app';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.html',
  styleUrls: ['./add-user.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
})
export class AddUserComponent {
  protected title = 'Add User';
  response = '';
  userForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IUser,
    public dialogRef: MatDialogRef<AddUserComponent>,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private toastrService: ToastrService
  ) {
    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userEmail: ['', [Validators.required, Validators.email]],
      phone: [''],
      role: ['', Validators.required],
    });

    if (data) {
      this.title = 'Edit User';
      this.userForm.patchValue({
        firstName: data.firstName,
        lastName: data.lastName,
        userEmail: data.userEmail,
        phone: data.phone,
        role: data.role,
      });
    }
  }

  submit() {
    if (!this.userForm.valid) {
      this.response = 'Please fill all required fields correctly.';
      return;
    }
    const URL = this.data
      ? `http://localhost:3000/updateUser`
      : 'http://localhost:3000/createUser';

    const msg = this.data ? 'User updated successfully!' : 'User added successfully!';
    this.http
      .post(URL, {...this.userForm.value, id: this.data ? this.data._id : undefined})
      .subscribe(
        (response) => {
            this.toastrService.success(msg);
            this.dialogRef.close();
        },
        (error) => {
            this.dialogRef.close();
        }
      );
    this.userForm.reset();
  }
}
