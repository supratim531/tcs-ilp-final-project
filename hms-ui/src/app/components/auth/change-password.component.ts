import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.css"],
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  loading = false;
  errorMessage = "";
  successMessage = "";
  userFound = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.changePasswordForm = this.fb.group(
      {
        username: ["", Validators.required],
        currentPassword: ["", Validators.required],
        newPassword: [
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
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get("newPassword");
    const confirmPassword = form.get("confirmPassword");
    return newPassword &&
      confirmPassword &&
      newPassword.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  }

  checkUser() {
    const username = this.changePasswordForm.get("username")?.value;
    if (!username) return;

    this.loading = true;
    this.errorMessage = "";

    this.authService.checkUserExists(username).subscribe({
      next: (exists) => {
        this.loading = false;
        if (exists) {
          this.userFound = true;
        } else {
          this.errorMessage = "Username does not exist";
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = "Error checking user";
      },
    });
  }

  onSubmit() {
    if (!this.changePasswordForm.valid) return;

    this.loading = true;
    this.errorMessage = "";

    const formData = this.changePasswordForm.value;
    const changePasswordDTO = {
      username: formData.username,
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    };

    this.authService.changePassword(changePasswordDTO).subscribe({
      next: (data) => {
        this.loading = false;
        this.successMessage = data?.message;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || "Failed to change password";
      },
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.changePasswordForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors["required"]) return `${fieldName} is required`;
      if (field.errors["minlength"])
        return `${fieldName} must be at least 6 characters`;
    }
    if (
      fieldName === "confirmPassword" &&
      this.changePasswordForm.errors?.["passwordMismatch"] &&
      field?.touched
    ) {
      return "Passwords do not match";
    }
    return "";
  }
}
