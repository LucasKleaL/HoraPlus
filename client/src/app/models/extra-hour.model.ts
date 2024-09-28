export class ExtraHour {
    constructor(
        public user_uid: string,
        public title: string,
        public date: Date,
        public amount: string,
        public employee: {
            uid: string,
            name: string,
        },
        public department: {
            uid: string,
            description: string,
        },
        public description?: string,
        public uid?: string,
    ) {}
}