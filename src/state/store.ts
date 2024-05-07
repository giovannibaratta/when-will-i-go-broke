import {configureStore} from "@reduxjs/toolkit"
import carReducer from "./car/car-reducer.ts"
import {useDispatch, useSelector} from "react-redux"


const store = configureStore({
  reducer: {
    car: carReducer
  }
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Provide types hooks for the store to use in other components
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
