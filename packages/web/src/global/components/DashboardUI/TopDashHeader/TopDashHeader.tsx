import classNames from 'classnames';
import React, { useEffect, useState } from 'react'
import styles from "./TopDashHeader.module.scss";

type TopDashHeaderProps = {}

const tempProfilePic = "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg";

type HeaderMenuItem = {
    title: string;
    url: string;
    icon?: React.ReactNode;
}

const menuItems: HeaderMenuItem[] = [
    { title: "Profile Link", url: "" },
    { title: "Profile Link", url: "" },
    { title: "Profile Link", url: "" },
    { title: "Profile Link", url: "" },
]

export default function TopDashHeader(props: TopDashHeaderProps) {
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    useEffect(() => {
        // hide menu whenever body is clicked
        document.body.addEventListener("click", () => setShowProfileMenu(false));

        return () => {
            document.body.removeEventListener("click", () => setShowProfileMenu(false));
        }
    }, [])

    const toggleProfileMenu = () => {
        // request frame so body 'click' listener has a chance to fire before toggling menu
        requestAnimationFrame(() => {
            setShowProfileMenu(!showProfileMenu);
        })
    }

    return (
        <header className={styles.header}>
            <div className={styles.leftContent}>
                <h1 className={styles.heading}>Dashboard</h1>
            </div>
            <div className={styles.rightContent}>
                <div className={styles.profileMenuWrapper}>
                    <img src={tempProfilePic ?? tempProfilePic} alt={"Profile"} className={styles.profileImg}  onClick={toggleProfileMenu}/>
                    <div className={classNames(styles.profileMenu, {[styles.show]: showProfileMenu})}>
                        {menuItems.map((item, i) => {
                            return (
                                <a key={i} href={item.url}>{item.title}</a>
                            )
                        })}
                    </div>
                </div>
            </div>
        </header>
    )
}