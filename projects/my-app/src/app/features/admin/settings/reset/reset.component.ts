import { ProjectsService } from 'projects/my-app/src/app/core/services/projects.service';
import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../../core/services/auth.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'my-org-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})
export class ResetComponent implements OnInit {
  passwordForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  projects: any;
  constructor(
    private protects: ProjectsService,
    private auth: AuthService,
    public fb: FormBuilder,
    public router: Router
  ) {
    this.passwordForm = this.fb.group({
      password: [''],
      repeat: [''],
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.protects.projectList().subscribe((projects: any) => {
        this.projects = projects;
        console.log(projects);
      });
    }, 100);
  }

  password() {
    console.log(this.passwordForm);
    if (this.passwordForm.value.password === this.passwordForm.value.repeat) {
      this.auth
        .sendPassword({ password: this.passwordForm.value.password })
        .subscribe(
          (data: any[]) => {
            // this.router.navigate(['/settings']);
            this.successMessage = 'Пароль успешно сохранен';
            setTimeout(() => {this.successMessage = ''; }, 1000);
            this.errorMessage = '';
            this.passwordForm.reset();
          },
          (error) => {
            for (const err in error.error) {
              if (err in this.passwordForm.value) {
                this.passwordForm
                  .get(err)
                  ?.setErrors({ error: error.error[err] });
                this.passwordForm.get(err)?.markAsTouched();
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
