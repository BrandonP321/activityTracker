import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ResponsiveState {
    max: boolean;
    large: boolean;
    medium: boolean;
    mobile: boolean;
    tiny: boolean;
}

const initialState: ResponsiveState = {
    max: false,
    large: false,
    medium: false,
    mobile: false,
    tiny: false
}

/**
 * responsiveSlice tracks the viewport width for conditional rendering in components
 */
const responsiveSlice = createSlice({
    name: "responsive",
    initialState,
    reducers: {
        /* updates redux state on screen resize */
        screenResized(state, action: PayloadAction<ResponsiveState>) {
            // not sure why I can't update the state as a whole, so this will do for now
            state.max = action.payload.max;
            state.large = action.payload.large;
            state.medium = action.payload.medium;
            state.mobile = action.payload.mobile;
            state.tiny = action.payload.tiny;
        }
    }
})

export const { screenResized } = responsiveSlice.actions;
export default responsiveSlice.reducer;