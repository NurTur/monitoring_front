import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../core/services/auth.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'my-org-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})
export class ResetComponent implements OnInit {
  resetForm: FormGroup;
  confirmForm: FormGroup;
  passwordForm: FormGroup;
  step = 'step1';
  errorMessage = '';

  constructor(
    private auth: AuthService,
    public fb: FormBuilder,
    public router: Router
  ) {
    this.resetForm = this.fb.group({
      email: ['', Validators.required],
    });

    this.confirmForm = this.fb.group({
      email: this.resetForm.value.email,
      code: [''],
    });

    this.passwordForm = this.fb.group({
      new: [''],
      repeat: [''],
    });
  }

  ngOnInit(): void {}

  reset() {
    this.auth.reset(this.resetForm.value).subscribe(
      (data: any[]) => {
        this.step = 'step2';
        this.errorMessage = '';
      },
      (error) => {
        for (const err in error.error) {
          if (err in this.resetForm.value) {
            this.resetForm.get(err)?.setErrors({ error: error.error[err] });
            this.resetForm.get(err)?.markAsTouched();
          } else {
            this.errorMessage = error.error[err];
          }
        }
      }
    );
  }

  confirm() {
    this.confirmForm.value.email = this.resetForm.value.email;
    this.auth.confirm(this.confirmForm.value).subscribe(
      (data: any[]) => {
        this.step = 'step3';
        this.errorMessage = '';
        this.auth.saveUser(data);
      },
      (error) => {
        for (const err in error.error) {
          if (err in this.confirmForm.value) {
            this.confirmForm.get(err)?.setErrors({ error: error.error[err] });
            this.confirmForm.get(err)?.markAsTouched();
          } else {
            this.errorMessage = error.error[err];
          }
        }
      }
    );
  }

  password() {
    if (this.passwordForm.value.new === this.passwordForm.value.repeat) {
      this.auth
        .sendPassword({ password: this.passwordForm.value.new })
        .subscribe(
          (data: any[]) => {
            this.router.navigate(['/']);
          },
          (error) => {
            for (const err in error.error) {
              if (err in this.confirmForm.value) {
                this.confirmForm
                  .get(err)
                  ?.setErrors({ error: error.error[err] });
                this.confirmForm.get(err)?.markAsTouched();
              } else {
                this.errorMessage = error.error[err];
              }
            }
          }
        );
    } else {
      this.errorMessage = 'Пароли не совпадают!';
    }
  }
}
