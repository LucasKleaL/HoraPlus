export class UserAuthModel {
    constructor(
        public uid: string,
        public name: string,
        public email: string,
        public system_role: string,
        public role: Array<string>,
        public department: Array<string>,
    ) {}
}