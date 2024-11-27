import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { environment } from "../environments/environment";
import { firstValueFrom } from "rxjs";
import { Employee } from "../models/employee.model";

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    private api: string = environment.apiUrl + '/employees';

    constructor(private http: HttpClient) { }

    public async getEmployees(userUid: string): Promise<HttpResponse<any>> {
        try {
            return await firstValueFrom(this.http.get<string>(this.api + '/user/' + userUid, { observe: 'response' }));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async addEmployee(employee: Employee): Promise<HttpResponse<any>> {
        try {
            return await firstValueFrom(this.http.post<Employee>(this.api, employee, { observe: 'response' }));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

}