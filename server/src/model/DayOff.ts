type DayOff = {
    uid?: string,
    user_uid: string,
    employee_uid: string,
    title: string,
    description?: string,
    date: Date,
    amount: Float32Array,
};

export default DayOff;