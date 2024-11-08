import { Injectable } from '@angular/core'; 
import { BehaviorSubject } from 'rxjs'; 
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersSubject = new BehaviorSubject<User[]>(this.getUsersFromLocalStorage());
  users$ = this.usersSubject.asObservable();

  constructor() {}

  getUsersFromLocalStorage(): User[] {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  saveUsersToLocalStorage(users: User[]) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  addUser(user: User) {
    const users = this.getUsersFromLocalStorage();
    users.push({ ...user, id: new Date().getTime() });
    this.saveUsersToLocalStorage(users);
    this.usersSubject.next(users);
  }

  editUser(updatedUser: User) {
    const users = this.getUsersFromLocalStorage().map(user =>
      user.id === updatedUser.id ? updatedUser : user
    );
    this.saveUsersToLocalStorage(users);
    this.usersSubject.next(users);
  }

  deleteUser(userId: number) {
    const users = this.getUsersFromLocalStorage().filter(user => user.id !== userId);
    this.saveUsersToLocalStorage(users);
    this.usersSubject.next(users);
  }
}
