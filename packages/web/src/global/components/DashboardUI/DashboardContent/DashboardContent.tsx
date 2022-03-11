import classNames from 'classnames';
import React, { useEffect, useState } from 'react'
import { BrowserUtils } from '../../../../utils/BrowserUtils';
import AsideDashHeader from '../AsideDashHeader/AsideDashHeader';
import TopDashHeader from '../TopDashHeader/TopDashHeader';
import styles from "./DashboardContent.module.scss";

type DashboardContentProps = {
  children: React.ReactNode;
}

export default function DashboardContent(props: DashboardContentProps) {
  const [showAsideHeader, setShowAsideHeader] = useState(false);

  useEffect(() => {
    if (showAsideHeader) {
      BrowserUtils.LockScroll();
    } else {
      BrowserUtils.UnlockScroll();
    }
  }, [showAsideHeader])

  const toggleAsideHeader = () => {
    setShowAsideHeader(!showAsideHeader)
  }

  return (
    <div className={styles.dashContentWrapper}>
      <div className={classNames(styles.pageOverlay, {[styles.show]: showAsideHeader})} onClick={toggleAsideHeader}/>
      <div className={classNames(styles.asideHeaderWrapper, {[styles.show]: showAsideHeader})}>
        <AsideDashHeader toggleShow={toggleAsideHeader}/>
      </div>
      <div className={styles.innerContentWrapper}>
        <TopDashHeader toggleAsideHeader={toggleAsideHeader}/>

        {props.children}
      </div>
    </div>
  )
}