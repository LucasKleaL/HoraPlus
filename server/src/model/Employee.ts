type Employee = {
    uid?: string,
    user_uid: string,
    name: string,
    role: {
        uid: string,
        title: string,
    },
    department: {
        uid: string,
        title: string,
    },
}

export default Employee;