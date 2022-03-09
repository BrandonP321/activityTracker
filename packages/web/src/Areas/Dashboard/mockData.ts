import { ActivityUtils } from "@activitytracker/common/src/utils/ActivityUtils";

const tempActivity = (price?: number) => ({
    name: "Some Activity",
    url: "",
    peopleAllowed: {
        amount: 3,
        orLess: false,
        orMore: false,
    },
    price: price
});

const listOne = [tempActivity(0, ), tempActivity(3), tempActivity(), tempActivity(1), tempActivity(6), tempActivity(7), tempActivity(2), tempActivity(9), ]

const tempList = {
  url: "",
  name: "Some List",
  users: [{ name: "User One" }, { name: "User One" }, { name: "User One" },],
  activities: [...listOne, ...listOne]
}

const tempFriend = {

}

export const tempData: { lists: (typeof tempList)[]; friends: (typeof tempFriend)[] } = {
  lists: Array(10).fill(tempList),
  friends: Array(10).fill(tempFriend)
}