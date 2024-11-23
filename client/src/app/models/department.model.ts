export class Department {
    constructor(
        public user_uid: string,
        public title: string,
        public description?: string,
        public uid?: string,
    ) {}
}