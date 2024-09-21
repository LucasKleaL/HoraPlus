type ExtraHour = {
    uid?: string,
    user_uid: string,
    title: string,
    description?: string,
    date: string,
    amount: Float32Array,
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