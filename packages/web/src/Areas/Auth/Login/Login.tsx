import { LoginUser, LoginUserErrors, LoginUserRequest, RegisterUser, RegisterUserErrors, RegisterUserRequest } from '@activitytracker/common/src/api/requests/auth';
import React, { useState } from 'react'
import BasicForm, { BasicFormErr, BasicFormFields, BasicFormFieldsOrder, BasicFormSubmitValues } from '../../../global/components/FormUI/BasicForm/BasicForm';
import { TLoginFields, TRegistrationFields } from "@activitytracker/common/src/utils/AuthUtils";
import styles from "./Login.module.scss";
import { RouteHelper } from '../../../global/Navigation/RouteHelper';

type LoginProps = {
    showRegistration?: boolean;
}

export default function Login({ showRegistration }: LoginProps) {
    const [showLogin, setShowLogin] = useState(!showRegistration);

    const toggleForm = () => {
        setShowLogin(!showLogin);
    }

    return (
        <div className={styles.login}>
            {showLogin
                ? <LoginForm toggleForm={toggleForm}/>
                : <RegistrationForm toggleForm={toggleForm}/>
            }
            
        </div>
    )
}

type FormProps = {
    toggleForm: () => void;
}

type LoginFields = keyof TLoginFields;
const loginFields: BasicFormFields<LoginFields> = {
    email: { placeholder: "Email" },
    password: { placeholder: "Password" }
}
const orderedLoginFields: BasicFormFieldsOrder<LoginFields> = ["email", "password"];

function LoginForm(props: FormProps) {
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [inputErr, setInputErr] = useState<BasicFormErr | undefined>(undefined);
    const [generalErr, setGeneralErr] = useState<string | undefined>(undefined);

    const clearErrors = () => {
        setInputErr(undefined);
        setGeneralErr(undefined);
    }

    const handleSubmit = (values: BasicFormSubmitValues<LoginFields>) => {
        setIsFormLoading(true);
        clearErrors();

        LoginUser({}, values, {})
            .then(res => {
                RouteHelper.goToUrl(RouteHelper.UserDashboard());
            })
            .catch(({ response: { data } }: LoginUserRequest.ErrResponse) => {
                switch (data.error) {
                    case LoginUserErrors.ErrorCodes.IncorrectEmailOrPassword:
                        setGeneralErr(data.errorMsg);
                        break;
                    case LoginUserErrors.ErrorCodes.MissingUserInput:
                        setInputErr({ errMsg: data.errorMsg, field: data.field })
                        break;
                    default:
                }
            })
            .finally(() => {
                setIsFormLoading(false);
            })
    }

    return (
        <BasicForm
            fields={loginFields}
            fieldsOrder={orderedLoginFields}
            onSubmit={handleSubmit}
            classes={{
                formWrapper: styles.loginFormWrapper
            }}
            fieldErr={inputErr}
            generalErr={generalErr}
            title={"Login"}
            loading={isFormLoading}
        >
            <p className={styles.formToggleLink}><span onClick={props.toggleForm}>Don't have an account?  Create one here!</span></p>
        </BasicForm>
    )
}

type RegisterFields = keyof TRegistrationFields;
const registerFields: BasicFormFields<RegisterFields> = {
    email: { placeholder: "Email" },
    password: { placeholder: "Password" },
    fullName: { placeholder: "Full Name" },
    passwordReEnter: { placeholder: "Re-Enter Password" },
    phone: { placeholder: "Phone (optional)" },
    username: { placeholder: "Username" }
}
const orderedRegisterFields: BasicFormFieldsOrder<RegisterFields> = ["fullName", "username", "email", "password", "passwordReEnter", "phone"];

function RegistrationForm(props: FormProps) {
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [inputErr, setInputErr] = useState<BasicFormErr | undefined>(undefined);
    const [generalErr, setGeneralErr] = useState<string | undefined>(undefined);

    const clearErrors = () => {
        setInputErr(undefined);
        setGeneralErr(undefined);
    }

    const handleSubmit = (values: BasicFormSubmitValues<RegisterFields>) => {
        setIsFormLoading(true);
        clearErrors();

        RegisterUser({}, values, {})
            .then(({data}) => {
                console.log(data);
            })
            .catch(({ response: { data } }: RegisterUserRequest.ErrResponse) => {
                RouteHelper.goToUrl(RouteHelper.UserDashboard());
                switch(data.error) {
                    case RegisterUserErrors.ErrorCodes.EmailOrUsernameTaken:
                        setInputErr({ errMsg: data.errorMsg, field: data.credTaken })
                        break;
                    case RegisterUserErrors.ErrorCodes.InvalidUserInput:
                        setInputErr({ errMsg: data.errorMsg, field: data.field })
                        break;
                }
            })
            .finally(() => {
                setIsFormLoading(false);
            })
    }

    return (
        <BasicForm
            fields={registerFields}
            fieldsOrder={orderedRegisterFields}
            onSubmit={handleSubmit}
            classes={{
                formWrapper: styles.loginFormWrapper
            }}
            fieldErr={inputErr}
            generalErr={generalErr}
            title={"Register"}
            loading={isFormLoading}
        >
            <p className={styles.formToggleLink}><span onClick={props.toggleForm}>Don't have an account?  Create one here!</span></p>
        </BasicForm>
    )
}