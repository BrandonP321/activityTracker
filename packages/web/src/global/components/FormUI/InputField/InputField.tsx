import classNames from 'classnames';
import React, { useState } from 'react'
import styles from "./InputField.module.scss";

export type InputFieldProps = {
    placeholder: string;
    onChange?: (value: string) => void;
    value: string;
    classes?: {
        inputWrapper?: string;
        placeholder?: string;
        inputField?: string;
        contentWrapper?: string;
    };
    errMsg?: string;
    disabled?: boolean;
}

export default function InputField(props: InputFieldProps) {
    const {
        placeholder, onChange, value, classes, disabled, errMsg
    } = props;

    const [isFocused, setIsFocused] = useState(false);
    
    return (
        <div className={classNames(styles.inputContentWrapper, classes?.contentWrapper)}>
            <div className={classNames(styles.inputFieldWrapper, classes?.inputWrapper, {[styles.focused]: isFocused || props.value})}>
                <div className={classNames(styles.placeholder, classes?.placeholder)}>{placeholder}</div>
                <input 
                    className={classNames(styles.inputField, classes?.inputField)} 
                    value={value} 
                    onChange={(e) => onChange && onChange(e?.target?.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    disabled={disabled}
                />
            </div>
            <p className={styles.fieldErr}>{errMsg}</p>
        </div>
    )
}