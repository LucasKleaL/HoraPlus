import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { environment } from "../environments/environment";
import { firstValueFrom } from "rxjs";
import { ExtraHour } from "../models/extra-hour.model";

@Injectable({
    providedIn: 'root'
})
export class ExtraHourService {
    private api: string = environment.apiUrl + '/extrahours';

    constructor(private http: HttpClient) { }

    public async getExtraHours(userUid: string): Promise<HttpResponse<any>> {
        try {
            console.log(userUid);
            return await firstValueFrom(this.http.get<string>(this.api + '/user/' + userUid, { observe: 'response' }));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async addExtraHour(extraHour: ExtraHour): Promise<HttpResponse<any>> {
        try {
            return await firstValueFrom(this.http.post<ExtraHour>(this.api, extraHour, { observe: 'response' }));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

}