import { useState } from "react";
import { Box, Typography, Button, List, ListItem, ListItemText, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

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
        height: "calc(100vh - 64px)", 
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
        flexDirection="column"
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
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          multiple
          onChange={handleFileChange}
        />

        {/* File List Display */}
        {files.length > 0 && (
          <List sx={{ width: "100%", maxHeight: "100px", overflowY: "auto", mt: 2 }}>
            {files.map((file, index) => (
              <ListItem key={index} secondaryAction={
                <IconButton edge="end" onClick={() => removeFile(index)}>
                  <DeleteIcon />
                </IconButton>
              }>
                <ListItemText primary={file.name} secondary={`${(file.size / 1024).toFixed(2)} KB`} />
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Section 3: Send Button */}
      <Button variant="contained" color="primary" sx={{ width: "60%", py: 1.5 }} disabled={files.length === 0}>
        Send
      </Button>
    </Box>
  );
}

export default Content;
