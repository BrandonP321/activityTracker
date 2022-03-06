import { faSpinnerThird } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React, { Children, FormEventHandler, useState } from 'react'
import InputField, { InputFieldProps } from '../InputField/InputField';
import styles from "./BasicForm.module.scss";

export type BasicFormField = {
    placeholder: string;
}

export type BasicFormErr = {
    field: string,
    errMsg: string;
}

export type BasicFormFields<FieldNames extends string> = {
    [key in FieldNames]: BasicFormField
}

export type BasicFormFieldsOrder<FieldNames extends string> = FieldNames[];

export type BasicFormSubmitValues<FieldNames extends string> = {[key in FieldNames]: string}

export type BasicFormProps = {
    title?: string;
    fieldsOrder: BasicFormFieldsOrder<string>;
    fields: BasicFormFields<string>
    onSubmit: (values: BasicFormSubmitValues<string>) => void;
    fieldProps?: InputFieldProps;
    classes?: {
        formWrapper?: string;
        form?: string;
        submitBtnWrapper?: string;
        submitBtn?: string;
        formTitle?: string;
    }
    loading?: boolean;
    fieldErr?: BasicFormErr;
    generalErr?: string;
    children?: React.ReactNode;
}

export default function BasicForm(props: BasicFormProps) {
    const {
        fields, onSubmit, fieldsOrder, fieldProps, classes, loading, title, children, fieldErr, generalErr
    } = props;
    
    /* reorders fields based on ordered list of field names */
    const getOrderedFields = () => {
        return fieldsOrder.map(f => fields[f] && {...fields[f], name: f});
    }

    const [orderedFields] = useState(getOrderedFields());

    /* constrcuts object of field names with empty string values */
    const getEmptyValues = () => {
        const fieldValues: {[key: string]: string} = {}

        getOrderedFields().forEach(f => {
            fieldValues[f.name] = "";
        })

        return fieldValues;
    }

    const [values, setValues] = useState<{[key in keyof typeof fields]: string}>(getEmptyValues())

    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        if (!loading) {
            onSubmit(values);
        }
    }

    const handleInputChange = (value: string, field: string) => {
        setValues({...values, [field]: value});
    }

    const fieldClasses: InputFieldProps["classes"] = {
        inputField: classNames(fieldProps?.classes?.inputField, styles.inputField),
        inputWrapper: classNames(fieldProps?.classes?.inputWrapper, styles.fieldWrapper),
        contentWrapper: classNames(fieldProps?.classes?.contentWrapper, styles.fieldOuterWrapper),
        placeholder: fieldProps?.classes?.placeholder
    }

    return (
        <div className={classNames(styles.formWrapper, classes?.formWrapper)}>
            {title &&
                <h3 className={classNames(styles.formTitle, classes?.formTitle)}>{title}</h3>
            }
            <p className={styles.generalErr}>{generalErr}</p>
            <form className={classNames(styles.form, classes?.form)} onSubmit={handleSubmit}>
                <div>
                    {orderedFields.map((f, i) => {
                        return (
                            <InputField
                                {...(fieldProps ?? {})}
                                key={i}
                                placeholder={f.placeholder}
                                value={values[f.name]}
                                onChange={(v) => handleInputChange(v, f.name)}
                                classes={fieldClasses}
                                disabled={loading}
                                errMsg={(fieldErr?.field === f.name) ? fieldErr?.errMsg : undefined}
                            />
                        )
                    })}
                </div>
                <div className={classNames(styles.submitBtnWrapper, classes?.submitBtnWrapper)}>
                    <button className={classNames(styles.submitBtn, classes?.submitBtn)}>Login</button>
                </div>

                {children}
            </form>
            <div className={classNames(styles.loadingOverlay, {[styles.loading]: loading})}>
                <FontAwesomeIcon icon={faSpinnerThird} className={styles.spinner}/>
            </div>
        </div>
    )
}