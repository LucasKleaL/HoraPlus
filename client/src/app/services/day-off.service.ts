import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { environment } from "../environments/environment";
import { firstValueFrom } from "rxjs";
import { ExtraHour } from "../models/extra-hour.model";
import { DayOff } from "../models/day-off.model";

@Injectable({
    providedIn: 'root'
})
export class DayOffService {
    private api: string = environment.apiUrl + '/daysoff';

    constructor(private http: HttpClient) { }

    public async getDaysOffPaginated(userUid: string): Promise<HttpResponse<any>> {
        try {
            return await firstValueFrom(this.http.get<string>(this.api + '/paginated/' + userUid, { observe: 'response' }));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async addDayOff(dayOff: DayOff): Promise<HttpResponse<any>> {
        try {
            return await firstValueFrom(this.http.post<DayOff>(this.api, dayOff, { observe: 'response' }));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

}