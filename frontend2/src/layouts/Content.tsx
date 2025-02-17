import { Box, Typography, Button } from "@mui/material";

function Content() {
  return (
    <Box
      flex={1}
      p={2}
      bgcolor="skyblue"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        height: "calc(100vh - 64px)", // Adjust for navbar height
      }}
    >
      {/* Section 1: Connection Status */}
      <Box width="60%" bgcolor="white" p={3} borderRadius={2} boxShadow={3} textAlign="center">
        <Typography variant="h6">Connection Section</Typography>
        <Typography color="gray">Status: Connected</Typography>
      </Box>

      {/* Section 2: File Drag & Select */}
      <Box
        width="60%"
        height="200px"
        bgcolor="white"
        p={3}
        borderRadius={2}
        boxShadow={3}
        display="flex"
        alignItems="center"
        justifyContent="center"
        border="2px dashed gray"
      >
        <Typography>
          Drag & Drop files here or{" "}
          <label htmlFor="fileInput" style={{ color: "blue", cursor: "pointer" }}>
            click to upload
          </label>
        </Typography>
        <input type="file" id="fileInput" style={{ display: "none" }} />
      </Box>

      {/* Section 3: Send Button */}
      <Button variant="contained" color="primary" sx={{ width: "60%", py: 1.5 }}>
        Send
      </Button>
    </Box>
  );
}

export default Content;
