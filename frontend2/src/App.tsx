import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Box, Stack } from "@mui/material";
import Content from "./layouts/Content";
import SideBar from "./layouts/SideBar";
import NavBar from "./layouts/NavBar";

function App() {
  return (
    <>
      <Box>
        <NavBar />
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <SideBar />
          <Content />
        </Stack>
      </Box>
    </>
  );
}

export default App;
