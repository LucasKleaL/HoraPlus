type ExtraHour = {
    uid?: string,
    user_uid: string,
    title: string,
    description?: string,
    date: string,
    amount: string,
    employee: {
        uid: string,
        name: string,
    },
    department: {
        uid: string,
        description: string,
    }
}

export default ExtraHour;