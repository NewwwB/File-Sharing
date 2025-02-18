import FileTransferGrid from "../components/Main Content/FileTransferGrid";
import { useState } from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function Content() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
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

        {/* Section 2: File Drag & Select with Preview */}
        <Box
          width="60%"
          height="200px"
          bgcolor="white"
          p={3}
          borderRadius={2}
          boxShadow={3}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          border="2px dashed gray"
        >
          {selectedFile ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={1}
            >
              <Typography variant="body1">{selectedFile.name}</Typography>
              <Typography variant="body2" color="gray">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </Typography>
              <IconButton color="error" onClick={handleRemoveFile}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ) : (
            <Typography>
              Drag & Drop files here or{" "}
              <label
                htmlFor="fileInput"
                style={{ color: "blue", cursor: "pointer" }}
              >
                click to upload
              </label>
            </Typography>
          )}
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </Box>

        {/* Section 3: Send Button */}
        <Button
          variant="contained"
          color="primary"
          sx={{ width: "60%", py: 1.5 }}
          disabled={!selectedFile}
        >
          {selectedFile ? "Send File" : "Select a File First"}
        </Button>
      </Box>
    </>
  );
}

export default Content;
