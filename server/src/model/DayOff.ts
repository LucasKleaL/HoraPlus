type DayOff = {
    uid?: string,
    user_uid: string,
    title: string,
    description?: string,
    date: Date,
    amount: Float32Array,
    employe_uid: string,
};

export default DayOff;