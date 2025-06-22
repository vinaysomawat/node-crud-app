import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddUserComponent } from './add-user/add-user';
import { ToastrService } from 'ngx-toastr';

export interface IUser {
  firstName: string;
  lastName: string;
  userEmail: string;
  phone: string;
  role: string;
  _id: string;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  providers: [],
})
export class App implements OnInit {
  protected title = 'open-api';
  users: WritableSignal<IUser[]> = signal([]);
  constructor(private http: HttpClient, private matDialog: MatDialog, private toastService:ToastrService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.http.get('http://localhost:3000/users').subscribe((data: any) => {
      this.users.set(data);
    });
  }

  addUser() {
    this.matDialog
      .open(AddUserComponent)
      .afterClosed()
      .subscribe(() => {
        this.getUsers();
      });
  }

  editUser(user: IUser) {
    this.matDialog
      .open(AddUserComponent, {
        data: user,
      })
      .afterClosed()
      .subscribe(() => {
        this.getUsers();
      });
  }

  deleteUser(user: IUser) {
  this.http
    .post('http://localhost:3000/deleteUser', {id: user._id})
    .subscribe(
      (response) => {
        this.toastService.success('User deleted successfully');
        this.getUsers();
      },
      (error) => {
        console.error('Error adding user:', error);
      }
    );
    this.getUsers();
  }
}
