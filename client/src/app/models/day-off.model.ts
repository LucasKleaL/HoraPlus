import { Employee } from "./employee.model";

export class DayOff {
    constructor(
        public user_uid: string,
        public employee_uid: string,
        public title: string,
        public date: Date,
        public amount: string,
        public employee?: Employee,
        public description?: string,
        public uid?: string,
    ) {}
}