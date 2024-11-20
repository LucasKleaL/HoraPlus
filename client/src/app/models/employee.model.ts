export class Employee {
    constructor(
        public user_uid: string,
        public name: string,
        public role: {
            uid: string,
            description: string,
        },
        public department: {
            uid: string,
            description: string,
        },
        public uid?: string,
    ) {}
}