export class RouteHelper {
    public static Areas = {
        Auth: "/Auth",
        Dashboard: "/Dashboard"
    }

    public static SiteLink = (area: typeof this.Areas[keyof typeof this.Areas], path?: string) => {
        return `${area}${path ?? ""}`;
    }

    public static goToUrl = (url: ReturnType<typeof this.SiteLink>) => {
        if (url) {
            window.location.href = url;
        }
    }

    /* AUTH */
    public static Login = () => this.SiteLink(this.Areas.Auth, "/Login");

    /* DASHBOARD */
    public static UserDashboard = () => this.SiteLink(this.Areas.Dashboard);
    public static DashboardLists = () => this.SiteLink(this.Areas.Dashboard, "/Lists");
    public static DashboardActivities = () => this.SiteLink(this.Areas.Dashboard, "/Activities");
    public static DashboardFriends = () => this.SiteLink(this.Areas.Dashboard, "/Friends");
}