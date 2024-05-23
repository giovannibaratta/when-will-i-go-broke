import {createTheme} from "@mui/material/styles"

const LIGHT_GRAY = "#F5F5F5"
const DEEP_TEAL = "#0079A1"

export const theme = createTheme({
  components: {
    MuiListItemText: {
      styleOverrides: {
        root: {
          color: DEEP_TEAL
        }
      }
    }
  },
  palette: {
    primary: {
      main: DEEP_TEAL
    },
    secondary: {
      main: LIGHT_GRAY
    }
  }
})
