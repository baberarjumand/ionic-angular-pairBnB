import { Observable } from 'rxjs';
import { AuthService, AuthResponseData } from './auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss']
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  authenticate(email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: 'Logging in...'
      })
      .then(loadingEl => {
        loadingEl.present();
        let authObs: Observable<AuthResponseData>;
        if (this.isLogin) {
          authObs = this.authService.login(email, password);
        } else {
          authObs = this.authService.signUp(email, password);
        }
        // send a request to sign up servers
        authObs.subscribe(
          resData => {
            console.log(resData);
            this.isLoading = false;
            loadingEl.dismiss();
            this.router.navigateByUrl('/places/tabs/discover');
          },
          errRes => {
            // console.log(errRes);
            loadingEl.dismiss();
            const errCode = errRes.error.error.message;
            let message = 'Could not sign you up, please try again.';
            if (errCode === 'EMAIL_EXISTS') {
              message = 'This email address is already registered!';
            } else if (errCode === 'EMAIL_NOT_FOUND') {
              message = 'Email address could not be found.';
            } else if (errCode === 'INVALID_PASSWORD') {
              message = 'Incorrect password entered!';
            }
            this.showAlert(message);
          }
        );
        // simulating a fake delay before implementing login functionality
        // setTimeout(() => {
        //   this.isLoading = false;
        //   loadingEl.dismiss();
        //   this.router.navigateByUrl('/places/tabs/discover');
        // }, 1500);
      });
  }

  onSubmit(form: NgForm) {
    // console.log(form);
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    // console.log(email, password);

    // if (this.isLogin) {
    //   // send a request to login servers
    // } else {
    //   // send a request to sign up servers
    // }

    this.authenticate(email, password);
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Authentication failed',
        message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }
}
