import { ResponsiveState, screenResized } from "../../features/responsive/responsiveSlice";
import { store } from "../store";

export class Responsive {
    private _maxWidth = 1600;
    private _largeWidth = 1300;
    private _mediumWidth = 1000;
    private _mobileWidth = 787;
    private _tinyWidth = 450;
    
    constructor() {
        this.handleScreenResize();

        window.addEventListener("resize", () => this.handleScreenResize())
    }

    private testMax(vw: number) {return vw >= this._maxWidth}
    private testLarge(vw: number) {return vw <= this._largeWidth}
    private testMedium(vw: number) {return vw <= this._mediumWidth}
    private testMobile(vw: number) {return vw <= this._mobileWidth}
    private testTiny(vw: number) {return vw <= this._tinyWidth}

    public static Initialize() {
        return new Responsive();
    }

    /* updates redux state on resize */
    private handleScreenResize() {
        const vw = window.innerWidth;

        const newState: ResponsiveState = {
            max: this.testMax(vw),
            large: this.testLarge(vw),
            medium: this.testMedium(vw),
            mobile: this.testMobile(vw),
            tiny: this.testTiny(vw)
        }

        store.dispatch(screenResized(newState));
    }
}

export const initializeResponsiveStore = () => {
    new Responsive();
}