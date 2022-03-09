import { faSpinnerThird } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styles from "./LoadingContainer.module.scss";

type LoadingContainerProps = {
    loading: boolean;
    children?: JSX.Element;
}

export default function LoadingContainer(props: LoadingContainerProps) {
    if (!props.loading) {
        return props.children ?? null;
    }

    return (
        <div className={styles.loadingContainer}>
            <FontAwesomeIcon icon={faSpinnerThird} className={styles.spinner}/>
        </div>
    )
}