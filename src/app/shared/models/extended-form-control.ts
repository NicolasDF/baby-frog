import { AbstractControlOptions, AsyncValidatorFn, FormControl, ValidatorFn } from '@angular/forms';

export class ExtendedFormControl extends FormControl {
  onSubmit: string[] = [];

  constructor(
    formState?: any,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
    super(formState, validatorOrOpts, asyncValidator);

    if (formState && formState.onSubmit) {
      this.onSubmit = formState.onSubmit;
    }
  }

}
