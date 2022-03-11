import { faCubes, faList, faPersonRunning, faUsers, faX } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import { RouteHelper } from '../../../Navigation/RouteHelper';
import styles from "./AsideDashHeader.module.scss";

type AsideDashHeaderProps = {
  toggleShow: () => void;
}

const navLinks = [
  { title: "Dashboard", url: RouteHelper.UserDashboard(), icon: faCubes },
  { title: "My Lists", url: RouteHelper.DashboardLists(), icon: faList },
  { title: "My Activities", url: RouteHelper.DashboardActivities(), icon: faPersonRunning },
  { title: "Friends", url: RouteHelper.DashboardFriends(), icon: faUsers },
];

export default function AsideDashHeader(props: AsideDashHeaderProps) {
  const location = useLocation();

  return (
    <div className={styles.header}>
      <FontAwesomeIcon icon={faX} className={styles.exitIcon} onClick={props.toggleShow}/>
      <a href={"/"} className={styles.brand}>###BRAND###</a>
      <div className={styles.navLinks}>
        {navLinks.map((link, i) => {
          let windowPath = location.pathname

          // if last char of path is "/" remove last char from path
          if (windowPath[windowPath.length - 1] === "/") {
            windowPath = windowPath.split("").slice(0, windowPath.length - 1).join("");
          }

          const isActiveLink = windowPath === link.url;

          return (
            <Link
              to={link.url} 
              className={classNames(styles.link, {[styles.active]: isActiveLink})}
              key={i}
              onClick={props.toggleShow}
            >
              <span>
                <FontAwesomeIcon icon={link.icon} className={styles.linkIcon}/>
              </span>
              {link.title}
            </Link>
          )
        })}
      </div>
    </div>
  )
}