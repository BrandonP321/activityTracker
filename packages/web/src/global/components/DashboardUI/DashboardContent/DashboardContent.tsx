import React from 'react'
import AsideDashHeader from '../AsideDashHeader/AsideDashHeader';
import TopDashHeader from '../TopDashHeader/TopDashHeader';
import styles from "./DashboardContent.module.scss";

type DashboardContentProps = {
  children: React.ReactNode;
}

export default function DashboardContent(props: DashboardContentProps) {
  return (
    <div className={styles.dashContentWrapper}>
      <div className={styles.asideHeaderWrapper}>
        <AsideDashHeader />
      </div>
      <div className={styles.innerContentWrapper}>
        <TopDashHeader/>

        {props.children}
      </div>
    </div>
  )
}