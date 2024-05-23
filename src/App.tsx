import "./App.css"
import {CarComponent} from "./components/CarComponent.tsx"
import {CostsProjectionComponent, Report} from "./components/CostsProjectionComponent.tsx"
import {
  Box,
  Container,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from "@mui/material"
import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone"
import {useAppSelector} from "./state/store.ts"
import {getFirstDayOfNextMonthsFrom} from "./utils/date.ts"
import {buildCarExpensesCalculator} from "./model/car.ts"
import {SummaryComponent} from "./components/SummaryComponent.tsx"
import {IncomeComponent} from "./components/IncomeComponent.tsx"
import {buildIncomeCalculator, GrowthOptions} from "./model/income.ts"
import EuroTwoToneIcon from "@mui/icons-material/EuroTwoTone"
import DirectionsCarFilledTwoToneIcon from "@mui/icons-material/DirectionsCarFilledTwoTone"
import TrendingUpTwoToneIcon from "@mui/icons-material/TrendingUpTwoTone"
import {HashRouter, Link, Route, Routes} from "react-router-dom"
import AnalyticsIcon from "@mui/icons-material/Analytics"
import SettingsTwoToneIcon from "@mui/icons-material/SettingsTwoTone"
import {SettingsComponent} from "./components/SettingsComponent.tsx"
import HouseIcon from "@mui/icons-material/House"
import {buildHouseExpensesCalculator} from "./model/house.ts"
import {buildFurnitureExpensesCalculator} from "./model/furniture.ts"
import {buildHouseAgencyExpensesCalculator, HouseAgencyCosts} from "./model/house-agency.ts"
import {HouseComponent} from "./components/HouseComponent.tsx"
import {Info} from "./components/InfoComponent.tsx"
import {MiscellaneousCostsComponent} from "./components/MiscellaneousComponent.tsx"
import MiscellaneousServicesTwoToneIcon from "@mui/icons-material/MiscellaneousServicesTwoTone"
import {buildMiscellaneousExpensesCalculator} from "./model/miscellaneous.ts"

const ONE_YEAR_IN_MS = 1 * 1000 * 60 * 60 * 24 * 365

const DRAWER_WIDTH = 240

function App() {
  const settingsState = useAppSelector(state => state.settings)
  const carState = useAppSelector(state => state.car)
  const incomeState = useAppSelector(state => state.income)
  const houseState = useAppSelector(state => state.house)
  const miscellaneousState = useAppSelector(state => state.miscellaneous)

  const records: Report[] = []

  const now = new Date(Date.now())
  const simulationStartDate = getFirstDayOfNextMonthsFrom(now, 1)
  let simulationCurrentDate = simulationStartDate
  const simulationEndingDate = new Date(simulationStartDate.getTime() + (ONE_YEAR_IN_MS * settingsState.yearsOfSimulation))

  const carExpensesCalculator = buildCarExpensesCalculator({
    type: "CarMonthlyRateAndUpfront",
    monthlyRate: carState.monthlyRate,
    duration: carState.duration,
    startDate: new Date(carState.startPaymentDateIsoString),
    upfront: carState.upfrontPayment
  })

  const growth: GrowthOptions = incomeState.yoyGrowth.type === "GrowthDisable" ? {
    type: "disabled"
  } : {
    type: "yearly",
    annualPercentageGrowth: incomeState.yoyGrowth.percentage,
    startDate: simulationStartDate
  }

  const incomeCalculator = buildIncomeCalculator({
    monthlyNetRate: incomeState.monthlyIncomeRate,
    quattordicesima: incomeState.quattordicesima,
    tredicesima: incomeState.tredicesima,
    growth
  })

  const houseCalculator = buildHouseExpensesCalculator({
    durationInYears: houseState.duration,
    startDate: new Date(houseState.startPaymentDateIsoString),
    totalHouseCost: houseState.totalHouseCost,
    interestRate: houseState.interestRate,
    ltvPercentage: houseState.ltvPercentage
  })

  const furnitureCalculator = buildFurnitureExpensesCalculator({
    kitchenCosts: houseState.furniture.kitchenCosts,
    livingRoomCosts: houseState.furniture.livingRoomCosts,
    bedroomCosts: houseState.furniture.bedroomCosts,
    bathroomCosts: houseState.furniture.bathroomCosts,
    interestRatePercentage: settingsState.defaultInterestRateInPercent,
    loanStartDate: new Date(houseState.furniture.loanStartDateIsoString),
    loanDurationInMonths: houseState.furniture.loanDurationInMonths
  })

  const agencyCostsTax: HouseAgencyCosts["tax"] = houseState.agencyCosts.beforeTax ? {
    type: "beforeTax",
    vatPercentage: settingsState.vatInPercent
  } : {
    type: "afterTax"
  }

  const houseAgencyCosts: HouseAgencyCosts = houseState.agencyCosts.type === "variable" ? {
    type: "variable",
    percentage: houseState.agencyCosts.percentage,
    tax: agencyCostsTax,
    houseTransactionDate: new Date(houseState.startPaymentDateIsoString),
    totalHouseCosts: houseState.totalHouseCost
  } : {
    type: "fixed",
    parcel: houseState.agencyCosts.parcel,
    tax: agencyCostsTax,
    houseTransactionDate: new Date(houseState.startPaymentDateIsoString),
    totalHouseCosts: houseState.totalHouseCost
  }

  const houseAgencyCalculator = buildHouseAgencyExpensesCalculator(houseAgencyCosts)
  const miscellaneousCostsCalculator = buildMiscellaneousExpensesCalculator({
    tari: miscellaneousState.tari,
    canoneRai: miscellaneousState.canoneRai
  })

  while (simulationCurrentDate.getTime() < simulationEndingDate.getTime()) {

    const period = {
      month: simulationCurrentDate.getMonth(),
      year: simulationCurrentDate.getFullYear()
    }

    const carReport = carExpensesCalculator.computeMonthlyReport(period)
    const incomeReport = incomeCalculator.computeMonthlyReport(period)
    const houseReport = houseCalculator.computeMonthlyReport(period)
    const furnitureReport = furnitureCalculator.computeMonthlyReport(period)
    const houseAgencyReport = houseAgencyCalculator.computeMonthlyReport(period)
    const miscellaneuousCostsReport = miscellaneousCostsCalculator.computeMonthlyReport(period)

    const record: Report = {
      date: simulationCurrentDate,
      income: incomeReport.totalIncome,
      totalMonthExpenses: carReport.totalExpenses +
        incomeReport.totalExpenses +
        houseReport.totalExpenses +
        furnitureReport.totalExpenses +
        houseAgencyReport.totalExpenses +
        miscellaneuousCostsReport.totalExpenses
    }

    records.push(record)
    simulationCurrentDate = getFirstDayOfNextMonthsFrom(simulationCurrentDate, settingsState.resolutionInMonths)
  }

  return (
    <HashRouter>
      <Box sx={{display: "flex"}}>
        <Drawer
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box"
            }
          }}
          variant="permanent"
          anchor="left"
        >
          <List>
            <ListItem key={"Info"} disablePadding>
              <Link to="/">
                <ListItemButton>
                  <ListItemIcon>
                    <InfoTwoToneIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Info"} />
                </ListItemButton>
              </Link>
            </ListItem>
            <Divider />
            <ListItem key={"Summary"} disablePadding>
              <Link to="/summary">
                <ListItemButton>
                  <ListItemIcon>
                    <AnalyticsIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Summary"} />
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem key={"Projection"} disablePadding>
              <Link to="/projection">
                <ListItemButton>
                  <ListItemIcon>
                    <TrendingUpTwoToneIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Projection"} />
                </ListItemButton>
              </Link>
            </ListItem>
            <Divider />
            <ListItem key={"Income"} disablePadding>
              <Link to="/income">
                <ListItemButton>
                  <ListItemIcon>
                    <EuroTwoToneIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Income"} />
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem key={"House"} disablePadding>
              <Link to="/house">
                <ListItemButton>
                  <ListItemIcon>
                    <HouseIcon />
                  </ListItemIcon>
                  <ListItemText primary={"House"} />
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem key={"Car"} disablePadding>
              <Link to="/car">
                <ListItemButton>
                  <ListItemIcon>
                    <DirectionsCarFilledTwoToneIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Car"} />
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem key={"Miscellaneous"} disablePadding>
              <Link to="/miscellaneous">
                <ListItemButton>
                  <ListItemIcon>
                    <MiscellaneousServicesTwoToneIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Miscellaneous"} />
                </ListItemButton>
              </Link>
            </ListItem>
            <Divider />
            <ListItem key={"Settings"} disablePadding>
              <Link to="/settings">
                <ListItemButton>
                  <ListItemIcon>
                    <SettingsTwoToneIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Settings"} />
                </ListItemButton>
              </Link>
            </ListItem>

          </List>
        </Drawer>

        <Container maxWidth="xl">

          <Routes>
            <Route path="/" element={<Info />} />
            <Route path="/summary" element={<SummaryComponent simulationStartDate={simulationStartDate}
                                                              simulationEndingDate={simulationEndingDate}
                                                              records={records} />} />
            <Route path="/projection" element={<CostsProjectionComponent data={records} />} />
            <Route path="/income" element={<IncomeComponent />} />
            <Route path="/car" element={<CarComponent disabled={false} />} />
            <Route path="/house" element={<HouseComponent />} />
            <Route path="/settings" element={<SettingsComponent />} />
            <Route path="/miscellaneous" element={<MiscellaneousCostsComponent />} />"
          </Routes>
        </Container>
      </Box>
    </HashRouter>
  )
}

export default App
