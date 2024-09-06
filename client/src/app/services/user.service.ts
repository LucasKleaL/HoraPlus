import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { User } from "../models/user.model";
import { firstValueFrom } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private api: string = environment.apiUrl + '/users';

    constructor(private http: HttpClient) { }

    public async AddUser(user: User): Promise<string> {
        try {
            const body = {
                email: user.email,
                password: user.password,
                name: user.name, 
            }

            return await firstValueFrom(this.http.post<string>(this.api, body));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}