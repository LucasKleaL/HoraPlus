type User = {
    uid?: string,
    user_uid: string,
    name: string,
    email: string,
    password: string,
    system_role: string,
    role: Array<string>,
    department: Array<string>,
};

export default User;