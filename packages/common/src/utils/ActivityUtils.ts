export class ActivityUtils {
    /* returns price a a string rather than a number level (e.g. 3 => '$$$') */
    public static getPriceString(price?: number) {
        let priceString = undefined;

        if (price === undefined) {
            return;
        }

        if (price === 0) {
            priceString = "Free";
        } else if (price <= 5 && price > 0) {
            priceString = "$".repeat(price);
        }

        return priceString;
    }

    public static getPeopleAllowedString({ people, orMore, orLess }: { people?: number; orMore?: boolean, orLess?: boolean }) {
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
}