import { ExtendedFormControl } from './extended-form-control';
import { ExtendedFormGroup } from './extended-form-group';
import { FormControl } from '@angular/forms';

describe('ExtendedFormControl', () => {

  describe('assigns an onSubmit array of string keys', () => {

    it('if the formState has 2 keys, "value" and "onSubmit"', () => {
      const control = new ExtendedFormControl({ value: null, onSubmit: ['trim'] });
      expect(control.value).toBeNull();
      expect(control.onSubmit).toEqual(['trim']);
    });

    it('if the formState has 3 keys, "value", "disabled" and "onSubmit"', () => {
      const control = new ExtendedFormControl({ value: null, onSubmit: ['trim'], disabled: true });
      expect(control.value).toBeNull();
      expect(control.onSubmit).toEqual(['trim']);
    });

  });

  it('assigns a value and disabled properties if the formState has 2 keys, "value", and "disabled"', () => {
    const control = new ExtendedFormControl({ value: null, disabled: true });
    expect(control.value).toBeNull();
    expect(control.disabled).toBe(true);
    expect(control.onSubmit).toEqual([]);
  });

  it('sets the formState as the value if the formState is not a boxed value', () => {
    const control = new ExtendedFormControl({ value: null, onSubmit: ['trim'], disabled: true, mockKey: true });
    expect(control.value).toEqual({ value: null, onSubmit: ['trim'], disabled: true, mockKey: true });
  });

  it('should get the extended group', () => {
    const extendedForm = new ExtendedFormGroup({
      extended: new ExtendedFormGroup({
        common2: new FormControl(null)
      }),
      common: new ExtendedFormControl(null)
    });

    expect(extendedForm.getGroup('extended') instanceof ExtendedFormGroup).toBe(true);
    expect(extendedForm.getGroup('common')).toBe(null);
  });

});
