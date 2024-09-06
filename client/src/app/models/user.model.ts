
export class User {
    constructor(
        public email?: string,
        public password?: string,
        public name?: string,
        public system_role?: string,
        public role?: Array<string>,
        public department?: Array<string>,
        public uid?: string,
    ) {}
}