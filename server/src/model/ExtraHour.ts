import Employee from "./Employee";

type ExtraHour = {
    uid?: string,
    user_uid: string,
    employee_uid: string,
    title: string,
    description?: string,
    date: string,
    amount: string,
    employee?: Employee,
}

export default ExtraHour;