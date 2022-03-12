import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
// useAppSelectore is aliasing useSelector but adding the types of the RootState
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;