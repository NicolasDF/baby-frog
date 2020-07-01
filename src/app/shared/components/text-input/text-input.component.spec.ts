import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TextInputComponent } from './text-input.component';
import { SimpleChange, NO_ERRORS_SCHEMA, EventEmitter, ElementRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from '../../../core/validators/custom-validators';
import { MatAutocompleteModule, MatDatepicker } from '@angular/material';
import { FormErrorService } from '../../../core/services/form-error.service';
import { FormErrorServiceMock } from '../../../core/mocks/form-error.service.mock';
import Spy = jasmine.Spy;
import * as moment from 'moment';

describe('TextInputComponent', () => {
  let component: TextInputComponent;
  let fixture: ComponentFixture<TextInputComponent>;
  let formErrorService: FormErrorService;
  let controlHasErrorsSpy: Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextInputComponent ],
      imports: [ ReactiveFormsModule, MatAutocompleteModule ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: FormErrorService, useClass: FormErrorServiceMock }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextInputComponent);
    component = fixture.componentInstance;
    component.control = new FormControl(null, Validators.required);
    formErrorService = TestBed.get(FormErrorService);
    controlHasErrorsSpy = spyOn(formErrorService, 'controlHasErrors').and.returnValue(true);
  });

  describe('should validate the suffix and prefix input', () => {

    it('and validate suffix icon as string', () => {
      component.suffix = 'visibility';
      fixture.detectChanges();
      expect(component.suffix).toEqual({ icon: 'visibility', clickable: false });
    });

    it('and validate prefix icon as string', () => {
      component.prefix = 'visibility';
      fixture.detectChanges();
      expect(component.prefix).toEqual({ icon: 'visibility', clickable: false });
    });

  });

  describe('should validate the type of the input', () => {

    it('and default to "text"', () => {
      fixture.detectChanges();
      component.ngOnChanges({ type: new SimpleChange(undefined, undefined, true)});
      expect(component.type).toBe('text');
    });

    it('and change any invalid type to "text"', () => {
      component.type = 'invalid';
      fixture.detectChanges();
      component.ngOnChanges({ type: new SimpleChange(undefined, 'invalid', false)});
      expect(component.type).toBe('text');
    });

    it('and accept "password"', () => {
      component.type = 'password';
      fixture.detectChanges();
      component.ngOnChanges({ type: new SimpleChange(undefined, 'password', true)});
      expect(component.type).toBe('password');
    });

  });

  describe('when the initial type is "password"', () => {

    beforeEach(() => {
      component.type = 'password';
      fixture.detectChanges();
    });

    it('should mark the input as a password input if the initial type is "password"', () => {
      expect(component.isPassword).toBe(true);
    });

    it('should add a suffix for the "Reveal password" button', () => {
      expect(component.suffix).toEqual({ icon: 'visibility_off', clickable: true });
    });

    it('should toggle the type and "Reveal password" icon when clicking on the suffix icon', fakeAsync(() => {
      component.onSuffixClick();
      tick(1);
      expect(component.type).toBe('text');
      expect(component.suffix).toEqual({ icon: 'visibility', clickable: true });

      component.onSuffixClick();
      tick(1);
      expect(component.type).toBe('password');
      expect(component.suffix).toEqual({ icon: 'visibility_off', clickable: true });
    }));

  });

  describe('when the initial type is "text" with hiddenInput', () => {

    beforeEach(() => {
      component.hiddenInput = true;
      fixture.detectChanges();
    });

    it('should toggle the hiddenInput and reveal hidden input icon when clicking on the suffix icon', fakeAsync(() => {
      component.onSuffixClick();
      tick(1);
      expect(component.hiddenInput).toBe(false);
      expect(component.suffix).toEqual({ icon: 'visibility', clickable: true });

      component.onSuffixClick();
      tick(1);
      expect(component.hiddenInput).toBe(true);
      expect(component.suffix).toEqual({ icon: 'visibility_off', clickable: true });
    }));

    it('should retain the control\'s state after toggling hiddenInput', fakeAsync(() => {
      component.control.markAsPristine();
      component.onSuffixClick();
      tick(1);
      expect(component.control.pristine).toBe(true);

      component.control.markAsDirty();
      component.onSuffixClick();
      tick(1);
      expect(component.control.dirty).toBe(true);
    }));

  });

  describe('when the field is a numeric type', () => {

    beforeEach(() => {
      component.numeric = true;
      fixture.detectChanges();
    });

    it('should not allow alfabetic characters', () => {
      component.control.setValue('456a');
      expect(component.control.value).toBe(456);

      component.control.setValue('asd45a6a');
      expect(component.control.value).toBe(456);

      component.control.setValue('456/%2');
      expect(component.control.value).toBe(4562);
    });

  });

  describe('when the field is an integer type', () => {

    beforeEach(() => {
      component.integer = true;
      fixture.detectChanges();
    });

    it('should not allow alfabetic characters', () => {
      component.control.setValue('456a');
      expect(component.control.value).toBe(456);

      component.control.setValue('4.');
      expect(component.control.value).toBe(4);

      component.control.setValue('2,');
      expect(component.control.value).toBe(2);

      component.control.setValue('asd45a6a');
      expect(component.control.value).toBe(456);

      component.control.setValue('456/%2');
      expect(component.control.value).toBe(4562);

      component.control.setValue('-400');
      expect(component.control.value).toBe(400);
    });

  });

  it('should toggle the type and "Reveal password" icon when clicking on the suffix icon if type is not "password"', () => {
    component.type = 'text';
    fixture.detectChanges();
    component.ngOnChanges({ placeholder: new SimpleChange(undefined, 'Placeholder', true)});
    spyOn(component, 'toggleInputVisibility');
    component.onSuffixClick();
    expect(component.toggleInputVisibility).not.toHaveBeenCalled();
  });

  it('should emit an event when the suffix is clicked', () => {
    component.type = 'text';
    fixture.detectChanges();
    spyOn(component.suffixClicked, 'emit');
    component.onSuffixClick();
    expect(component.suffixClicked.emit).toHaveBeenCalled();
  });

  it('should determine if a prefix or suffix is text if the value is "%"', () => {
    fixture.detectChanges();
    expect(component.isTextIcon('calendar')).toBe(false);
    expect(component.isTextIcon('%')).toBe(true);
  });

  describe('should mark the control with errors if "showErrors" is true, pristine', () => {
    let group: FormGroup;

    beforeEach(() => {
      group = new FormGroup({
        fieldA: new FormControl(null, Validators.required),
        fieldB: new FormControl(null)
      }, [ CustomValidators.equal(['fieldA', 'fieldB'])]);
      component.control = group.get('fieldA') as FormControl;
      component.showErrors = true;
    });

    it('and invalid', () => {
      fixture.detectChanges();
      component.control.markAsPristine();
      expect(component.controlHasErrors()).toBe(true);
    });

    it('and it\'s parent has an error that matches one in the errorMessages array', () => {
      component.errorMessages = [ { key: 'equals', message: 'Values don\'t match' } ];
      fixture.detectChanges();
      component.control.setValue('mockValue');
      component.control.markAsPristine();
      expect(component.controlHasErrors()).toBe(true);
    });

  });

  describe('handle the control\'s errors', () => {

    it('and show them if showErrors is true and the control has errors', () => {
      component.showErrors = true;
      expect(component.controlHasErrors()).toBe(true);
      expect(formErrorService.controlHasErrors).toHaveBeenCalledWith(component.control, component.errorMessages);

      controlHasErrorsSpy.and.returnValue(false);
      expect(component.controlHasErrors()).toBe(false);
    });

    it('and not show them if showErrors is false', () => {
      component.showErrors = false;
      expect(formErrorService.controlHasErrors).not.toHaveBeenCalled();
      expect(component.controlHasErrors()).toBe(false);
    });

  });

  describe('should detect when the component has focus;', () => {

    it('focused when the text input has focus', () => {
      fixture.detectChanges();
      component.input.nativeElement.focus();
      fixture.detectChanges();
      expect(component.hasFocus).toBe(true);
    });

    it('not focused when the text input loses focus', () => {
      fixture.detectChanges();
      component.input.nativeElement.blur();
      fixture.detectChanges();
      expect(component.hasFocus).toBe(false);
    });

  });

  describe('when the type is datepicker', () => {

    beforeEach(() => {
      component.type = 'datepicker';
      component.datepicker = {
        openedStream: new EventEmitter<void>(),
        open: () => { }
      } as MatDatepicker<Date>;
      component.input = new ElementRef<any>(document.createElement('input'));
      component.ngOnInit();
      component.ngAfterViewInit();
      component.datepicker.open = jasmine.createSpy();
    });

    it('should add a suffix for the calendar button', () => {
      expect(component.suffix).toEqual({ icon: 'calendar_today', clickable: true });
    });

    it('should set the default date if the solDate field has an invalid date when the user opens the calendar', () => {
      component.control.setValue(null);
      component.datepicker.openedStream.emit();
      expect(moment(component.control.value).unix()).toEqual(moment().unix());

      component.control.setValue('12/20/2019');
      component.datepicker.openedStream.emit();
      expect(component.control.value).toBe('12/20/2019');
    });

    it('when the suffix is click it should open the datepicker', () => {
      component.onSuffixClick();
      expect(component.datepicker.open).toHaveBeenCalled();
    });
  });

  it('should emit an "inputBlur" event when the input loses focus', () => {
    spyOn(component.inputBlur, 'emit');
    component.emitBlur();
    expect(component.inputBlur.emit).toHaveBeenCalled();
  });

});
