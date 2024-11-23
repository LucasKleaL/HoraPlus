type User = {
    uid?: string,
    user_uid: string,
    name: string,
    email: string,
    password: string,
    system_role: string,
    role: {
        uid: string,
        description: string,
    },
    department: {
        uid: string,
        description: string,
    },
};

export default User;