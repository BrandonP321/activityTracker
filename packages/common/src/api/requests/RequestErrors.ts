export const RequestErrors = {
    /* CLIENT ERRORS */
    InvalidUserInput: "Barbell",
    InvalidUserCredentialInput: "Kettlebell",
    InvalidUserCredentials: "EZ-Bar",
    OneOrMoreInvalidUserIds: "Spotter",
    InvalidId: "Cables",

    /* MONGOOSE ERRORS */
    UniqueFieldTaken: "Dumbbell",

    /* SERVER ERRORS */
    UnexpectedCondition: "Treadmill",
    // a fatal error has occurred that was caught at the top level of an endpoint
    APIRouteFailure: "Burpee",
    ExpiredAccessToken: "Stubbed Toe",
    UserMustReAuth: "Broken Toe"
} as const;