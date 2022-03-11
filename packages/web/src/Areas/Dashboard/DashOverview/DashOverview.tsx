import { GetUserDashData, GetUserDashDataRequest } from '@activitytracker/common/src/api/requests/user';
import { ActivityUtils } from '@activitytracker/common/src/utils/ActivityUtils';
import { faHexagon, faList, faUsers } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import LoadingContainer from '../../../global/components/LoadingContainer/LoadingContainer';
import { APIFetch } from '../../../utils/APIUtils';
import { tempData } from '../mockData';
import styles from "./DashOverview.module.scss";

type DashOverviewProps = {

}

const tempProfilePic = "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg";

export default function DashOverview(props: DashOverviewProps) {
  // const [userData, setUserData] = useState<GetUserRequest.Request["ReqBody"] | null>(null)
  const [userData, setUserData] = useState<GetUserDashDataRequest.Request["ResBody"] | null>(null)
  const [selectedList, setSelectedList] = useState(0);
  const maxListLength = 10;

  useEffect(() => {
    APIFetch<GetUserDashDataRequest.Request>(() => GetUserDashData({}, {}, {}))
      .then(res => {
        console.log(res.data)
        setUserData(res.data);
      })
      .catch((err: GetUserDashDataRequest.ErrResponse) => {
        console.log(err.response);
      })
  }, [])

  if (!userData) {
    return <LoadingContainer loading />
  }

  const quickStats = [
    { title: "Total Lists", value: "105", icon: faList, url: "" },
    { title: "Activities Created", value: "42", icon: faList },
    { title: "Friends Followed", value: "28", icon: faList },
    { title: "Friends Followed", value: "28", icon: faList },
  ];

  const currentList = tempData?.lists[selectedList];

  const activities = userData?.userActivities;

  return (
    <div className={styles.dashOverviewWrapper}>
      <div className={styles.quickStatsWrapper}>
        {quickStats.map((stat, i) => {
          return (
            <a className={styles.quickStat} key={i} href={stat?.url}>
              <div className={styles.statIconWrapper}>
                <FontAwesomeIcon icon={faHexagon} className={styles.hexagonIcon} />
                <FontAwesomeIcon icon={stat?.icon} className={styles.statIcon} />
              </div>
              <p className={styles.statTitle}>{stat?.title}</p>
              <p className={styles.statValue}>{stat?.value}</p>
            </a>
          )
        })}
      </div>

      <div className={styles.listsFlexWrapper}>
        <div className={styles.listsWrapper}>
          <div className={styles.listHeading}>
            <h2 className={styles.sectionHeading}>My Lists</h2>
            <a href={"/"} className={styles.viewMoreBtn}>View All</a>
          </div>

          {tempData?.lists?.slice(0, maxListLength).map((list, i) => {
            const isSelected = selectedList === i;

            return (
              <div key={i} className={classNames(styles.listItem, { [styles.selected]: isSelected })} onClick={() => setSelectedList(i)}>
                <p className={styles.listName}>{list.name}</p>
              </div>
            )
          })}
        </div>
        <div className={styles.activitiesWrapper}>
          <div className={styles.listHeading}>
            <h2 className={styles.sectionHeading}>{currentList?.name}</h2>
            <a href={"/"} className={styles.viewMoreBtn}>View All</a>
          </div>
          {activities.map((a, i) => {
            const peopleAllowed = ActivityUtils.getPeopleAllowedString({people: a?.numbPeople?.amount, orMore: a?.numbPeople?.orMore, orLess: a?.numbPeople?.orLess});
            const price = ActivityUtils.getPriceString(a?.price ?? null);

            return (
              <Link className={classNames(styles.listItem)} to={a.url ?? ""} key={i}>
                <span>{a.name}</span>
                <div>
                  {price &&
                    <span className={styles.activityPrice}>{price}</span>
                  }
                  {peopleAllowed &&
                    <span className={styles.peopleAmnt}>
                      <FontAwesomeIcon icon={faUsers} className={styles.peopleIcon}/>
                      {peopleAllowed}
                    </span>
                  }
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}