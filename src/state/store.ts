import {combineReducers, configureStore} from "@reduxjs/toolkit"
import carReducer from "./car/car-reducer.ts"
import {useDispatch, useSelector} from "react-redux"
import incomeReducer from "./income/income-reducer.ts"
import settingsReducer from "./settings/settings-reducer.ts"
import storage from "redux-persist/lib/storage"
import {createMigrate, persistReducer, persistStore} from "redux-persist"
import houseReducer from "./house/house-reducer.ts"
import miscellaneousReducer, {
  CANONE_RAI_DEFAULT_VALUE,
  TARI_DEFAULT_VALUE
} from "./miscellaneous/miscellaneous-reducer.ts"

const migrations = {
  // @ts-expect-error The old state is not typed and redux-persist does
  // not expose the types
  0: (state) => {
    return {
      ...state
    }
  },
  // @ts-expect-error The old state is not typed and redux-persist does
  // not expose the types
  1: (state) => {
    return {
      ...state,
      miscellaneous: {
        canoneRai: CANONE_RAI_DEFAULT_VALUE,
        tari: TARI_DEFAULT_VALUE
      }
    }
  }
}

const persistConfig = {
  key: "when-i-will-go-broke-primary",
  storage,
  version: 1,
  migrate: createMigrate(migrations)
}

const reducers = combineReducers({
  car: carReducer,
  income: incomeReducer,
  house: houseReducer,
  settings: settingsReducer,
  miscellaneous: miscellaneousReducer
})

const persistedReducer = persistReducer(persistConfig, reducers)

const store = configureStore({
  reducer: persistedReducer
})

export default store

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Provide types hooks for the store to use in other components
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
