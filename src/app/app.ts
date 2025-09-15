// import { Component, signal } from '@angular/core';
// import { RouterLink, RouterOutlet } from '@angular/router';
// import { Login } from './login/login';
// import { Registration } from './registration/registration';

// @Component({
//   selector: 'app-root',
//   imports: [RouterOutlet, Login, Registration, RouterLink],
//   templateUrl: './app.html',
//   styleUrl: './app.css',
// })
// export class App {
//   protected readonly title = signal('Angular_Practice');
//   user: string = '';
//   isLoggedin: Boolean = false;
//   constructor() {
//     this.user = localStorage.getItem('user');
//     this.checkedLogin();
//   }

//   checkedLogin() {
//     if (this.user != null) {
//       this.isLoggedin = true;
//     }
//   }

//   logout() {
//     localStorage.removeItem('user');
//     this.isLoggedin = false;
//   }
// }

import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // orgname: string = 'cognizant';
  // uname: string = '';
  // isLoggedIn: boolean = false;
  // constructor(private router: Router, private userService: User) {
  //   console.log('App component initialized');
  //   this.userService.getUser().subscribe((data) => {
  //     console.log(data);
  //   });
  //   this.uname = localStorage.getItem('user');
  //   this.checkLoggedIn();
  // }

  // checkLoggedIn() {
  //   if (this.uname == null || this.uname == '') {
  //     this.isLoggedIn = false;
  //   } else {
  //     this.isLoggedIn = true;
  //   }
  // }
  // logout() {
  //   localStorage.clear();
  //   this.router.navigate(['login']);
  //   this.checkLoggedIn();
  // }
}
