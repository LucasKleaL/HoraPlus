import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { UserAuth } from 'src/app/auth/User.Auth';
import { DayOff } from 'src/app/models/day-off.model';
import { Employee } from 'src/app/models/employee.model';
import { DayOffService } from 'src/app/services/day-off.service';
import { EmployeeService } from 'src/app/services/employees.service';

@Component({
  selector: 'app-add-days-off',
  templateUrl: './add-days-off.component.html',
  styleUrls: ['./add-days-off.component.css']
})
export class AddDaysOffComponent extends AppComponent implements OnInit {
  dayOffForm!: FormGroup;
  title = new FormControl('', [Validators.required]);
  description = new FormControl('', []);
  employee = new FormControl<string | Employee>('', [Validators.required]);
  employees: Employee[] = [];
  date = new FormControl('', [Validators.required]);
  amountHours = new FormControl('00:00', [Validators.required, this.amountHoursValidator()]);
  isDateFocused: boolean = false;
  isAmountHoursFocused: boolean = false;
  amountHoursErrorLabel = '';
  
  constructor(
    _snackBar: MatSnackBar,
    router: Router,
    private dayOffService: DayOffService,
    private employeeService: EmployeeService,
    private userAuth: UserAuth, 
    private datePipe: DatePipe
  ) {
    super(_snackBar, router);
  }

  async ngOnInit(): Promise<void> {
    const date = new Date();
    const formatDate = this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm');
    this.date.setValue(formatDate);
    this.dayOffForm = new FormGroup({
      title: this.title,
      description: this.description,
      employee: this.employee,
      date: this.date,
      amountHours: this.amountHours,
    });
    await this.getEmployees();
  }

  async getEmployees(): Promise<void> {
    try {
      this.isLoading = true;
      const response = await this.employeeService.getAllEmployeesByUser(this.userAuth.currentUser?.uid ?? '');
      this.employees = response.body.employees;
      this.isLoading = false;
    } catch (error) {
      throw error;
    }
  }

  get employeeControl(): FormControl {
    return this.dayOffForm.get('employee') as FormControl;
  }

  async addDayOff() {
    try {
      this.isLoading = true;
      const userUid = this.userAuth.currentUser?.uid ?? '';
      const employeeUid = this.dayOffForm.get("employee")?.value.uid;
      const title = this.dayOffForm.get("title")?.value;
      const description = this.dayOffForm.get("description")?.value;
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
