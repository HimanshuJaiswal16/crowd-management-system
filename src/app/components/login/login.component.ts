import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly showPassword = signal(false);

  readonly loginForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  // Shortcuts used by the template
  get username() { return this.loginForm.controls.username; }
  get password() { return this.loginForm.controls.password; }

  // Show an error only after the user has touched the field (or tried to submit)
  showError(control: AbstractControl): boolean {
    return control.invalid && (control.touched || control.dirty);
  }

  login(): void {
    if (this.loading()) return; // ignore double clicks

    // Invalid form: reveal all errors and stop
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.getRawValue();

    this.error.set(null);
    this.loading.set(true);

    // AuthService expects { email, password }; rename if your API expects "username"
    this.authService.login({ email: username, password })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          // Token is saved by AuthService, so just navigate
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/overview';
          this.router.navigateByUrl(returnUrl);
        },
        error: (err) => {
          this.error.set(err?.error?.message ?? err?.message ?? 'Login failed. Please try again.');
        }
      });
  }
}