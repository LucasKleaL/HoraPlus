import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { environment } from "../environments/environment";
import { firstValueFrom } from "rxjs";
import { Department } from "../models/department.model";

@Injectable({
    providedIn: 'root'
})
export class DepartmentService {
    private api: string = environment.apiUrl + '/departments';

    constructor(private http: HttpClient) { }

    public async getAllDepartmentsByUser(userUid: string): Promise<HttpResponse<any>> {
        try {
            return await firstValueFrom(this.http.get<string>(this.api + '/user/' + userUid, { observe: 'response' }));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async getDepartmentsPaginated(userUid: string): Promise<HttpResponse<any>> {
        try {
            return await firstValueFrom(this.http.get<string>(this.api + '/paginated/' + userUid, { observe: 'response' }));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async addDepartment(department: Department): Promise<HttpResponse<any>> {
        try {
            return await firstValueFrom(this.http.post<Department>(this.api, department, { observe: 'response' }));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}