import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
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
    setPreviewUrls((prev) => [
      ...prev,
      ...newFiles.map((file) => URL.createObjectURL(file)),
    ]);
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
        flex: "1",
        overflow: "hidden",
      }}
    >
      <Box
        p={2}
        borderRadius={2}
        boxShadow={3}
        display="flex"
        gap={1}
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        border="2px dashed gray"
        minHeight="150px"
        height="100%"
        width="100%"
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
        }}
      >
        {selectedFiles.length > 0 ? (
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-around"
            alignItems="center"
            width="100%"
            height="100%"
          >
            <Box width="100%" height="100%" sx={{ overflowY: "auto", flex: 6 }}>
              <TableContainer sx={{ height: "100%" }}>
                <Table>
                  <TableBody>
                    {selectedFiles.map((file, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ py: 0.5 }}>
                          {file.type.startsWith("image/") ? (
                            <img
                              src={previewUrls[index]}
                              alt="Preview"
                              style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "8px",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <Typography variant="body2">{file.name}</Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ py: 0.5 }}>
                          <Typography variant="body2" color="gray">
                            {(file.size / 1024).toFixed(2)} KB
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 0.5 }}>
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveFile(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <Box sx={{ maxHeight: "70px", flex: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => alert("Files Sent!")}
              >
                Send Files
              </Button>
            </Box>
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
          multiple
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </Box>
    </Box>
  );
};

export default FileDropzone;
