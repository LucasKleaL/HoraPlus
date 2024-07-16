import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../util/firebase";
import { format } from "date-fns";
import { firebaseAdmin } from "../util/admin";

class AppRepository {

    constructor() {
        initializeApp(firebaseConfig);
        firebaseAdmin.firestore().settings({ignoreUndefinedProperties:true});
    }

    public getDateTime() {
        return format(new Date(), "dd/MM/yyyy HH:mm:ss");
    }

}

export default AppRepository;