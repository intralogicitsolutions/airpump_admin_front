import {
  AbstractControl,
  ValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';

export const CustomValidators: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('new_password');
  const confirmPassword = control.get('confirm_password');

  return password?.value === confirmPassword?.value
    ? null
    : { notmatched: true };
};
