import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  errorMessage = "";
  successMessage = "";
  generatedUserId = "";

  countryCodes = [
    { code: "+1", country: "US" },
    { code: "+91", country: "IN" },
    { code: "+44", country: "UK" },
    { code: "+61", country: "AU" },
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group(
      {
        fullName: [
          "",
          [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern(/^[a-zA-Z\s]+$/),
          ],
        ],
        email: ["", [Validators.required, Validators.email]],
        countryCode: ["+91", Validators.required],
        phone: ["", [Validators.required, Validators.pattern(/^\d{8,10}$/)]],
        address: ["", [Validators.required, Validators.minLength(10)]],
        username: [
          "",
          [
            Validators.required,
            Validators.minLength(5),
            Validators.pattern(/^\S+$/),
          ],
        ],
        password: [
          "",
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
            ),
          ],
        ],
        confirmPassword: ["", Validators.required],
        role: ["", Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get("password");
    const confirmPassword = form.get("confirmPassword");

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else if (confirmPassword?.errors?.["passwordMismatch"]) {
      delete confirmPassword.errors["passwordMismatch"];
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null);
      }
    }
    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = "";

      const formData = { ...this.registerForm.value };
      formData.phone = formData.countryCode + formData.phone;
      delete formData.countryCode;
      delete formData.confirmPassword;

      this.authService.register(formData).subscribe({
        next: (response) => {
          this.loading = false;
          this.successMessage = "Registration Successful!";
          this.generatedUserId = response.userId;
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage =
            error.error?.message || "Registration failed. Please try again.";
        },
      });
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors["required"]) {
        return `${this.getFieldLabel(fieldName)} is required.`;
      }
      if (field.errors["minlength"]) {
        const minLength = field.errors["minlength"].requiredLength;
        return `${this.getFieldLabel(
          fieldName
        )} must be at least ${minLength} characters long.`;
      }
      if (field.errors["email"]) {
        return "Enter a valid email address.";
      }
      if (field.errors["pattern"]) {
        return this.getPatternError(fieldName);
      }
      if (field.errors["passwordMismatch"]) {
        return "Passwords do not match.";
      }
    }
    return "";
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      fullName: "Name",
      email: "Email",
      phone: "Mobile Number",
      address: "Address",
      username: "Username",
      password: "Password",
      confirmPassword: "Confirm Password",
      role: "Role",
    };
    return labels[fieldName] || fieldName;
  }

  private getPatternError(fieldName: string): string {
    switch (fieldName) {
      case "fullName":
        return "Name must contain only letters and spaces.";
      case "phone":
        return "Enter a valid mobile number (8-10 digits).";
      case "username":
        return "Username must be at least 5 characters and contain no spaces.";
      case "password":
        return "Password must include uppercase, lowercase, number, and special character.";
      default:
        return "Invalid format.";
    }
  }

  resetForm() {
    this.registerForm.reset();
    this.errorMessage = "";
    this.successMessage = "";
    this.generatedUserId = "";
  }

  goToLogin() {
    this.router.navigate(["/auth/login"]);
  }
}
