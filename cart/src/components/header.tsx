import styles from './header.module.scss';

export const Header = () => {
    return (
        <div className={styles.header}>
            <p className={styles.logo}>Test Store.</p>
        </div>
    )
};