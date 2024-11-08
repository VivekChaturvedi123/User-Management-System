import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
})
export class AddEditUserComponent implements OnInit {
  userForm: FormGroup;
  editMode = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<AddEditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User | null
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.editMode = true;
      this.userForm.patchValue(this.data);
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      const user: User = { ...this.userForm.value, id: this.data?.id || 0 };
      if (this.editMode) {
        this.userService.editUser(user);
      } else {
        this.userService.addUser(user);
      }
      this.dialogRef.close();
    }
  }
}
