import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../core/services/auth.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectsService } from '../../../core/services/projects.service';

@Component({
  selector: 'my-org-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  signInForm: FormGroup;
  errorMessage: string;
  constructor(
    private auth: AuthService,
    public fb: FormBuilder,
    public router: Router,
    private projects: ProjectsService
  ) {
    this.signInForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      // email: ['monitoring_admin@mail1.ru', Validators.required],
      // password: ['adminadmin', Validators.required],
    });
  }

  ngOnInit(): void {}

  login() {
    this.errorMessage = '';
    this.auth.login(this.signInForm.value).subscribe(
      (user) => {
        if (user) {
          this.auth.saveUser(user);
          this.projects.projectList().subscribe((projects: any) => {
            console.log('sadasd');
            if (projects.length === 0) {
              this.router.navigate(['/not-project/']);
            } else {
              this.router.navigate(['/projects/' + projects[0].id]);
            }
          });
        }
      },
      (error) => {
        for (const err in error.error) {
          if (err in this.signInForm.value) {
            this.signInForm.get(err)?.setErrors({ error: error.error[err] });
            this.signInForm.get(err)?.markAsTouched();
          } else {
            this.errorMessage = error.error[err];
          }
        }
      }
    );
  }
}
