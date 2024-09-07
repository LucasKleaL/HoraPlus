import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { environment } from "../environments/environment";
import { User } from "../models/user.model";
import { firstValueFrom } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private api: string = environment.apiUrl + '/users';

    constructor(private http: HttpClient) { }

    public async addUser(user: User): Promise<HttpResponse<any>> {
        try {
            const body = {
                email: user.email,
                password: user.password,
                name: user.name, 
            }

            return await firstValueFrom(this.http.post<string>(this.api, body, { observe: 'response' }));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async login(email: string, password: string): Promise<HttpResponse<any>> {
        try {
            const body = { email: email, password: password }
            return await firstValueFrom(this.http.post<string>(this.api + '/login', body, { observe: 'response' }));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}