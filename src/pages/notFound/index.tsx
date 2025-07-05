import { useEffect } from "react";
import styles from './style.module.css';


const NotFound = () => {


    useEffect(() => {

    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.mainContent}>
                <h1>404 Not Found</h1>
            </div>
        </div>
    );
};

export default NotFound;
