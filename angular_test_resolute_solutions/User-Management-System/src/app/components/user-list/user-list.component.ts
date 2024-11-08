import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../services/user.service';
import { AddEditUserComponent } from '../add-edit-user/add-edit-user.component';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'role', 'actions'];
  dataSource = new MatTableDataSource<User>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private userService: UserService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userService.users$.subscribe((users) => {
      this.dataSource.data = users;
      this.dataSource.paginator = this.paginator;
    });
  }

  openAddEditDialog(user: User | null): void {
    const dialogRef = this.dialog.open(AddEditUserComponent, { data: user });
    dialogRef.afterClosed().subscribe(() => this.refreshUsers());
  }

  applyFilter(event: Event): void {
    const input = event.target as HTMLInputElement;  
    if (input) {
      this.dataSource.filter = input.value.trim().toLowerCase();  
    }
  }

  deleteUser(userId: number): void {
    this.userService.deleteUser(userId);
  }

  private refreshUsers(): void {
    const users = this.userService.getUsersFromLocalStorage();
    this.dataSource.data = users;
  }
}
