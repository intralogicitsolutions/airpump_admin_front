import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CustomValidators } from './customValidator';
@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.scss'],
})
export class UserSettingComponent implements OnInit {
  panelOpenState: boolean = false;
  form: FormGroup;
  loading = false;
  submitted = false;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        old_password: ['', Validators.required],
        new_password: ['', Validators.required],
        confirm_password: ['', Validators.required],
      },
      { validators: CustomValidators }
    );
  }
  get f() {
    return this.form.controls;
  }
  onSubmit() {
    console.log('ddddddddddddddddddd', this.form.errors);
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const userData: any = localStorage.getItem('user');
    const parsedData = JSON.parse(userData);
    console.log(parsedData);
    this.authenticationService
      .resetPassword(
        this.f['old_password'].value,
        this.f['new_password'].value,
        parsedData.data._id
      )
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          console.log('ddddd', data);
          if (data.statusCode === 200 && data.data !== undefined) {
            this.toastr.success('Password change successfully');
            this.loading = false;
            // localStorage.clear();
            // this.router.navigate(['/login']);
          } else {
            this.toastr.error(data.message);
            this.loading = false;
          }
        },
        error: (error) => {
          console.log(error);
          this.toastr.success('Login Failed. User name or Password wrong.');
          this.loading = false;
        },
      });
  }
}
