import {
  AfterViewInit,
  Component,
  ElementRef, EventEmitter, Inject,
  Input,
  OnChanges,
  OnInit, Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ErrorMessage } from '../../../../../../ADL-Frontend/src/app/core/models/error-message';
import { DOCUMENT } from '@angular/common';
import { FormErrorService } from '../../../../../../ADL-Frontend/src/app/core/services/form-error.service';
import { timer } from 'rxjs';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'bf-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() label: string;
  @Input() labelIcon: string = null;
  @Input() tooltipText: string;
  @Input() showAsRequired = false;
  @Input() dateFilter: any;
  @Input() tooltipDelay: number[] = [0, 0];
  @Input() tooltipPosition = 'below';
  @Input() type: string;
  @Input() numeric = false;
  @Input() integer = false;
  @Input() placeholder = '';
  @Input() control: FormControl;
  @Input() showErrors: boolean;
  @Input() errorMessages: ErrorMessage[] = [];
  @Input() prefix: any | { icon: string, clickable: boolean };
  @Input() suffix: any | { icon: string, clickable: boolean };
  @Input() maxLength: number;
  @Input() minLength: number;
  @Input() autocomplete = 'on';
  @Input() typeahead: MatAutocomplete;
  @Input() allowError = true;
  @Input() inputClass = 'secure';
  @Input() mask: string = null;
  @Input() dropSpecialCharacters = true;
  @Input() hiddenInput: boolean;
  @Input() maskPatterns: any = { };
  @Input() maskValidation = true;
  @Input() thousandSeparator: string = null;
  @Input() separatorLimit: string = null;
  @Output() suffixClicked: EventEmitter<void> = new EventEmitter();
  @Output() inputBlur: EventEmitter<void> = new EventEmitter();
  @ViewChild('input', { static: false }) input: ElementRef;
  @ViewChild('datepicker', { static: false }) datepicker: MatDatepicker<Date>;

  hasFocus = false;
  isPassword = false;
  isHiddenInput = false;

  constructor(
    private formErrorService: FormErrorService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit() {
    this.setType();
    this.isPassword = this.type === 'password';
    this.isHiddenInput = this.hiddenInput;

    this.setSuffixAndPrefix();
    this.formatNumericInput();
  }

  ngAfterViewInit() {
    this.input.nativeElement.addEventListener('focus', () => this.toggleFocus());
    this.input.nativeElement.addEventListener('focusout', () => this.toggleFocus());

    if(this.datepicker) {
      this.datepicker.openedStream.subscribe(() => this.setCurrentDateIfInvalid());
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.type && !changes.type.isFirstChange()) {
      this.setType();
    }
  }

  toggleFocus(): void {
    this.hasFocus = this.document.activeElement === this.input.nativeElement;
  }

  setType(): void {
    const validTypes = [
      'password',
      'datepicker',
      'text'
    ];
    if(validTypes.indexOf(this.type) !== -1) {
      return;
    }
    this.type = 'text';
  }

  controlHasErrors(): boolean {
    return this.showErrors && this.formErrorService.controlHasErrors(this.control, this.errorMessages);
  }

  onSuffixClick(): void {
    if(this.isPassword || this.isHiddenInput ) {
      this.toggleInputVisibility();
    }

    if (this.type === 'datepicker') {
      this.datepicker.open();
    }

    this.suffixClicked.emit();
  }

  isTextIcon(value: string): boolean {
    return value === '%';
  }

  toggleInputVisibility(): void {
    this.input.nativeElement.focus();
    if(this.isPassword) {
      this.type = this.type === 'password' ? 'text' : 'password';
      this.suffix.icon = this.type === 'password' ? 'visibility_off' : 'visibility';
    }

    if(this.isHiddenInput) {
      this.hiddenInput = !this.hiddenInput;
      this.suffix.icon = this.hiddenInput ? 'visibility_off' : 'visibility';

      // Workaround for ngx-mask setting the control's dirty property when hiddenInput is toggled
      this.retainControlState();
    }
  }

  emitBlur(): void {
    this.inputBlur.emit();
  }

  setCurrentDateIfInvalid(): void {
    if (this.control.value) {
      return;
    }
    // this.control.setValue(moment());
  }

  private formatNumericInput(): void {
    this.control.valueChanges.subscribe(() => {
      if (this.numeric) {
        // Formatters.numeric(this.control.value, this.control);
      }
      if (this.integer) {
        // Formatters.integer(this.control.value, this.control);
      }
    });
  }

  private setSuffixAndPrefix(): void {
    if((this.type === 'password' && !this.suffix ) || this.hiddenInput ) {
      this.suffix = { icon: 'visibility_off', clickable: true };
    }

    if(this.type === 'datepicker' && !this.suffix ) {
      this.suffix = { icon: 'calendar_today', clickable: true };
    }

    if(typeof this.suffix === 'string') {
      this.suffix = { icon: this.suffix, clickable: false };
    }

    if(typeof this.prefix === 'string') {
      this.prefix = { icon: this.prefix, clickable: false };
    }
  }

  private retainControlState(): void {
    const isPristine = this.control.pristine;
    this.control.markAsDirty();
    timer().subscribe(() => {
      if(isPristine) {
        this.control.markAsPristine();
      }
    });
  }

}
