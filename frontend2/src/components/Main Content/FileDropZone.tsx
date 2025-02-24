import { useState } from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const FileDropzone: React.FC = () => {
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
    <Box
      m={0}
      sx={{
        width: "100%",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* File Drop Zone */}
      <Box
        flex="1"
        bgcolor="white"
        p={2}
        borderRadius={2}
        boxShadow={3}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-around"
        border="2px dashed gray"
        minHeight="150px"
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
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => alert("File Sent!")}
            >
              Send File
            </Button>
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
    </Box>
  );
};

export default FileDropzone;
