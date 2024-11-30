import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { UserAuth } from 'src/app/auth/User.Auth';
import { DayOff } from 'src/app/models/day-off.model';
import { DayOffService } from 'src/app/services/day-off.service';

@Component({
  selector: 'app-add-days-off',
  templateUrl: './add-days-off.component.html',
  styleUrls: ['./add-days-off.component.css']
})
export class AddDaysOffComponent extends AppComponent implements OnInit {
  dayOffForm!: FormGroup;
  title = new FormControl('', [Validators.required]);
  description = new FormControl('', []);
  department = new FormControl('', [Validators.required]);
  employee = new FormControl('', [Validators.required]);
  date = new FormControl('', [Validators.required]);
  amountHours = new FormControl('00:00', [Validators.required, this.amountHoursValidator()]);
  isDateFocused: boolean = false;
  isAmountHoursFocused: boolean = false;
  amountHoursErrorLabel = '';
  
  constructor(
    _snackBar: MatSnackBar,
    router: Router,
    private dayOffService: DayOffService, 
    private userAuth: UserAuth, 
    private datePipe: DatePipe
  ) {
    super(_snackBar, router);
  }

  ngOnInit(): void {
    const date = new Date();
    const formatDate = this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm');
    this.date.setValue(formatDate);
    this.dayOffForm = new FormGroup({
      title: this.title,
      description: this.description,
      department: this.department,
      employee: this.employee,
      date: this.date,
      amountHours: this.amountHours,
    });
  }

  async addDayOff() {
    try {
      this.isLoading = true;
      const userUid = this.userAuth.currentUser?.uid ?? '';
      const title = this.dayOffForm.get("title")?.value;
      const description = this.dayOffForm.get("description")?.value;
      const employeeUid = this.dayOffForm.get("employee")?.value;
      const date = new Date(this.dayOffForm.get("date")?.value);
      const amountHours = this.dayOffForm.get("amountHours")?.value;
      const dayOff = new DayOff(
        userUid,
        employeeUid,
        title,
        date,
        amountHours,
        description,
      );

      await this.dayOffService.addDayOff(dayOff)
        .then((response) => {
          this.openSnackBar('Folga adicionada com sucesso!', 'Ok', 'success-snackbar');
          this.isLoading = false;
          this.changeActiveRoute('/daysoff');
        }).catch((error) => {
          console.error(error);
          this.isLoading = false;
          this.openSnackBar('Ocorreu um erro ao adicionar a folda.', 'Ok', 'error-snackbar');
          throw error;
        });
    } catch (error) {
      console.error(error);
      this.isLoading = false;
      this.openSnackBar('Ocorreu um erro ao adicionar a folda.', 'Ok', 'error-snackbar');
      throw error;
    }
  }

  amountHoursValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const isValidFormat = /^\d{1,2}:[0-5][0-9]$/.test(value);
      if (isValidFormat) {
        this.amountHoursErrorLabel = 'O formato de horário deve ser HH:mm.';
      }
      const isZero = value === '00:00';
      if (isZero) {
        this.amountHoursErrorLabel = 'A quantidade de horas deve ser maior que 00:00.';
      }
      if (!isValidFormat || isZero) {
        return { invalidAmountHours: true };
      }
      return null;
    };
  }
}
