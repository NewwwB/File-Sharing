import React, { useState } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import { useDropzone } from "react-dropzone";

const FileDropzone: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={2}>
      <Paper
        {...getRootProps()}
        sx={{
          width: 300,
          height: 150,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px dashed gray",
          cursor: "pointer",
        }}
      >
        <input {...getInputProps()} />
        <Typography>Drag & drop a file here, or click to select one</Typography>
      </Paper>
      {selectedFile && (
        <Box mt={2} display="flex" alignItems="center" gap={2}>
          <Typography>{selectedFile.name}</Typography>
          <Button variant="contained" color="primary">
            Send
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default FileDropzone;
