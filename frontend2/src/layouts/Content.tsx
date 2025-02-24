import { Box } from "@mui/material";
import FileDropzone from "../components/Main Content/FileDropZone";
import FileTransferGrid from "../components/Main Content/FileTransferGrid";
import { useState } from "react";

function Content() {
  const [files, setFiles] = useState<File[]>([]);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles([...files, ...Array.from(event.target.files)]);
    }
  };

  // Remove a file from the list
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <>
      <Box
        flex={1}
        p={2}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
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
