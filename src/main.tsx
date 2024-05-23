import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
import {Provider} from "react-redux"
import store, {persistor} from "./state/store.ts"
import {LocalizationProvider} from "@mui/x-date-pickers"
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs"
import {PersistGate} from "redux-persist/integration/react"
import {ThemeProvider} from "@mui/material"
import {theme} from "./theme.ts"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </LocalizationProvider>
      </PersistGate>

    </Provider>
  </React.StrictMode>
)
