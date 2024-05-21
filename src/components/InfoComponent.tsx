import React from "react"
import {Alert, Box, Container, List, ListItemText, Typography} from "@mui/material"
import logo from "../../public/logo-no-background.png"

interface InfoComponentProps {
}

export const Info: React.FC<InfoComponentProps> = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{my: 4}}>
        <img src={logo} alt="Logo" style={{width: "100px", height: "auto", margin: "10px"}} />
        <Typography variant="h4" component="h1" gutterBottom>
          What can you do in this web app?
        </Typography>
        <Typography paragraph>
          This web app allows you to simulate your future financial situation based on your current income, expenses,
          and assets.
        </Typography>
        <List>
          <ListItemText
            primary={"💸 See how much money you will have left at the end of each month after paying your expenses."} />

          <ListItemText
            primary={"📈 Project your financial situation over a period of time, taking into account your income growth, " +
              "expenses, and investments."} />

          <ListItemText
            primary={"💭 See how different scenarios, such as changing your income or expenses, will affect your financial future."} />

        </List>
        <Alert severity="warning" sx={{maxWidth: "60%", margin: "auto", my: 3}}>The web app is still under
          development,
          but it
          already has a
          number of features that
          may help you</Alert>

      </Box>
      <Box sx={{my: 10}}>
        <Typography variant="h4" gutterBottom>
          How to use the web app
        </Typography>
        <Typography paragraph>
          Use the menu on the left side of the screen to navigate through the different sections of the web app. Open
          each section and fill the data based on your needs.
          After you filled all the data, go to the Summary section and to Projection to see the results of your expected
          financial situation.
        </Typography>
      </Box>
    </Container>
  )
}
