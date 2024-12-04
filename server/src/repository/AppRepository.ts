import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../util/firebase";
import { format } from "date-fns";

class AppRepository {

    constructor() {
        initializeApp(firebaseConfig);
    }

    public getDateTime() {
        return format(new Date(), "dd/MM/yyyy HH:mm:ss");
    }

    public formatDateTime(date: Date) {
        return format(date, "dd/MM/yyyy HH:mm:ss");
    }

    timeStringToMinutes(time: string): number {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    }
    
    minutesToTimeString(minutes: number): string {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${String(hours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}`;
    }

}

export default AppRepository;