import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Box, Stack } from "@mui/material";
import Content from "./layouts/Content";
import SideBar from "./layouts/SideBar";
import NavBar from "./layouts/NavBar";
import ThemeProviderWrapper from "../src/theme/ThemeProviderWrapper";
import { AppProvider } from "./contexts/AppContext";
import { StateProvider } from "./contexts/StateContext";

function App() {
  return (
    <StateProvider>
      <AppProvider>
        <ThemeProviderWrapper>
          <Box sx={{ height: "100vh", overflow: "hidden" }}>
            <NavBar />
            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              height="calc(100vh - 64px)"
            >
              <SideBar />
              <Content />
            </Stack>
          </Box>
        </ThemeProviderWrapper>
      </AppProvider>
    </StateProvider>
  );
}

export default App;
