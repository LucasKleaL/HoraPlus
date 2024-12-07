import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { UserAuth } from 'src/app/auth/User.Auth';
import { Employee } from 'src/app/models/employee.model';
import { ExtraHour } from 'src/app/models/extra-hour.model';
import { EmployeeService } from 'src/app/services/employees.service';
import { ExtraHourService } from 'src/app/services/extra-hour.service';

@Component({
  selector: 'app-add-extra-hours',
  templateUrl: './add-extra-hours.component.html',
  styleUrls: ['./add-extra-hours.component.scss']
})
export class AddExtraHoursComponent extends AppComponent implements OnInit {
  extraHourForm!: FormGroup;
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
    private extraHourService: ExtraHourService,
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
    this.extraHourForm = new FormGroup({
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
    return this.extraHourForm.get('employee') as FormControl;
  }

  async addExtraHour() {
    try {
      this.isLoading = true;
      const userUid = this.userAuth.currentUser?.uid ?? '';
      const employeeUid = this.extraHourForm.get("employee")?.value.uid;
      const title = this.extraHourForm.get("title")?.value;
      const description = this.extraHourForm.get("description")?.value;
      const date = new Date(this.extraHourForm.get("date")?.value);
      const amountHours = this.extraHourForm.get("amountHours")?.value;
      const extraHour = new ExtraHour(
        userUid,
        employeeUid,
        title,
        date,
        amountHours,
        description,
      );

      await this.extraHourService.addExtraHour(extraHour)
        .then((response) => {
          this.openSnackBar('Hora extra adicionada com sucesso!', 'Ok', 'success-snackbar');
          this.isLoading = false;
          this.changeActiveRoute('/extrahours');
        }).catch((error) => {
          console.error(error);
          this.isLoading = false;
          this.openSnackBar('Ocorreu um erro ao adicionar a hora extra.', 'Ok', 'error-snackbar');
          throw error;
        });
    } catch (error) {
      console.error(error);
      this.isLoading = false;
      this.openSnackBar('Ocorreu um erro ao adicionar a hora extra.', 'Ok', 'error-snackbar');
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
