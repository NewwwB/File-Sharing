import { useState } from "react";
import { Box, Typography, Button, IconButton, useTheme } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const FileDropzone: React.FC = () => {
  const theme = useTheme(); // Get the theme
  const isDarkMode = theme.palette.mode === "dark"; // Check if dark mode is enabled

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList | File[]) => {
    const newFiles = Array.from(files).filter(
      (file) => !selectedFiles.some((f) => f.name === file.name) // Prevent duplicates
    );

    setSelectedFiles((prev) => [...prev, ...newFiles]);
    setPreviewUrls((prev) => [...prev, ...newFiles.map((file) => URL.createObjectURL(file))]);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) handleFiles(event.target.files);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files.length) handleFiles(event.dataTransfer.files);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
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
      <Box
        flex="1"
        p={2}
        borderRadius={2}
        boxShadow={3}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-around"
        border="2px dashed gray"
        minHeight="150px"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          borderColor: isDragging ? "blue" : "gray",
          backgroundColor: isDragging
            ? isDarkMode
              ? "#333"
              : "#f0f8ff"
            : isDarkMode
            ? "#222"
            : "white",
          color: isDarkMode ? "#fff" : "#000",
          transition: "0.2s ease-in-out",
          width: "400px",
        }}
      >
        {selectedFiles.length > 0 ? (
          <Box display="flex" flexDirection="column" gap={1} alignItems="center">
            {selectedFiles.map((file, index) => (
              <Box key={index} display="flex" alignItems="center" gap={2}>
                {/* File Preview */}
                {file.type.startsWith("image/") ? (
                  <img
                    src={previewUrls[index]}
                    alt="Preview"
                    style={{ width: "60px", height: "60px", borderRadius: "8px", objectFit: "cover" }}
                  />
                ) : (
                  <Typography variant="body2">{file.name}</Typography>
                )}
                <Typography variant="body2" color="gray">
                  {(file.size / 1024).toFixed(2)} KB
                </Typography>
                <IconButton color="error" onClick={() => handleRemoveFile(index)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => alert("Files Sent!")}>
              Send Files
            </Button>
          </Box>
        ) : (
          <Typography>
            Drag & Drop files here or{" "}
            <label htmlFor="fileInput" style={{ color: "blue", cursor: "pointer" }}>
              click to upload
            </label>
          </Typography>
        )}
        <input type="file" id="fileInput" multiple style={{ display: "none" }} onChange={handleFileChange} />
      </Box>
    </Box>
  );
};

export default FileDropzone;
