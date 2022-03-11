import { CreateActivityRequest } from "../api/requests/activity";

export namespace ActivityCreation {
    export type Fields = CreateActivityRequest.Request["ReqBody"];

    export type InputErr = { msg: string, field: keyof Fields };
}

export class ActivityUtils {
    /* returns price a a string rather than a number level (e.g. 3 => '$$$') */
    public static getPriceString(price: number | null) {
        let priceString = null;

        if (price === null) {
            return;
        }

        if (price === 0) {
            priceString = "Free";
        } else if (price <= 5 && price > 0) {
            priceString = "$".repeat(price);
        }

        return priceString;
    }

    public static getPeopleAllowedString({ people, orMore, orLess }: { people: number | null; orMore: boolean | null, orLess: boolean | null }) {
        let peopleAllowed = undefined;

        if (!people) {
            return;
        }

        /* if people allowed for an activity is set as 0 keep it as undefined since 0 people can't go to an activity */
        if (people >= 1) {
            peopleAllowed = `${people}${orLess ? " or less" : orMore ? "+" : ""}`
        }

        return peopleAllowed;
    }

    public static validateCreationFields(fields: ActivityCreation.Fields) {
        const { location, name, numbPeople, price, tags, url, creatorId } = fields;

        let errObj: null | ActivityCreation.InputErr = null;

        const stringValues = { location, name, url, creatorId };
        const numberValues = { price, numbPeople: numbPeople.amount };

        let stringField: keyof typeof stringValues;

        // check if any inputs that should be strings aren't either a string or null
        for (stringField in stringValues) {
            // stop iterating if error has been found
            if (errObj) {
                break;
            }

            const value = stringValues[stringField];
            const valueType = typeof value;

            if (stringField === "name" && !value) {
                errObj = { field: stringField, msg: "Activity name required" };
            } else if (stringField === "creatorId" && !value) {
                errObj = { field: stringField, msg: "Creator ID required for new activity" };
            } else if (value !== null && valueType !== "string") {
                errObj = { field: stringField, msg: `Input field ${stringField} must be of type 'null' or 'string'` }
            }
        }

        let numbField: keyof typeof numberValues;

        // check if any inputs that should be numbers aren't either a number or null
        for (numbField in numberValues) {
            // stop iterating if error has been found
            if (errObj) {
                break;
            }

            const value = numberValues[numbField];
            const valueType = typeof value;

            if (value !== null && valueType !== "number") {
                errObj = { field: numbField, msg: `Input field ${numbField} must be of type 'null' or 'number'` };
                break;
            }
        }

        // make sure all tags are only strings
        for (const tag of tags) {
            if (typeof tag !== "string") {
                errObj = { field: "tags", msg: `Activity tags must only be strings` }
                break;
            }
        }

        return errObj;
    }
}