import { Box } from "@mui/material";
import FileDropzone from "../components/Main Content/FileDropZone";
import FileTransferGrid from "../components/Main Content/FileTransferGrid";
import { useState } from "react";

function Content() {
  const [] = useState<File[]>([]);

  // Handle file selection

  // Remove a file from the list

  return (
    <>
      <Box
        flex={1}
        p={2}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          // justifyContent: "center",
          overflow: "hidden",
          gap: 4,
          height: "calc(100vh - 64px)", // Adjust for navbar height
        }}
      >
        <FileTransferGrid />
        <FileDropzone />
      </Box>
    </>
  );
}

export default Content;
