import { useState, useEffect } from "react";
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
import { webRTCService } from "../../services/WebRTCServices";
import { useStateContext } from "../../contexts/StateContext";
import { v4 as uuidv4 } from "uuid";

const FileDropzone: React.FC = () => {
  const theme = useTheme();
  const { dispatch } = useStateContext();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleFiles = (files: FileList | File[]) => {
    const newFiles = Array.from(files).filter(
      (file) => !selectedFiles.some((f) => f.name === file.name)
    );

    const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));

    setSelectedFiles((prev) => [...prev, ...newFiles]);
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  const handleRemoveFile = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendFiles = () => {
    selectedFiles.forEach((file) => {
      const transferId = uuidv4();
      const channel = webRTCService.createFileDataChannel(transferId, file);

      if (!channel) {
        dispatch({
          type: "ADD_FILE_TRANSFER",
          payload: {
            id: transferId,
            name: file.name,
            size: file.size,
            progress: 0,
            status: "error",
            direction: "outgoing",
          },
        });
        console.error("channel not found while sending");
        return;
      }

      dispatch({
        type: "ADD_FILE_TRANSFER",
        payload: {
          id: transferId,
          name: file.name,
          size: file.size,
          progress: 0,
          status: "uploading",
          direction: "outgoing",
        },
      });
    });

    setSelectedFiles([]);
    setPreviewUrls([]);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          width: "100%",
          border: 2,
          borderRadius: 2,
          borderColor: isDragging ? theme.palette.primary.main : "divider",
          backgroundColor: isDragging
            ? theme.palette.action.hover
            : theme.palette.background.paper,
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: theme.palette.primary.main,
          },
        }}
      >
        {selectedFiles.length > 0 ? (
          <Box display="flex" flexDirection="column" gap={2} p={2}>
            <TableContainer sx={{ maxHeight: 200 }}>
              <Table size="small">
                <TableBody>
                  {selectedFiles.map((file, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ py: 0.5 }}>
                        {file.type.startsWith("image/") ? (
                          <img
                            src={previewUrls[index]}
                            alt="Preview"
                            style={{
                              width: 60,
                              height: 60,
                              borderRadius: 1,
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <Typography variant="body2">{file.name}</Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ py: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {(file.size / 1024).toFixed(1)} KB
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveFile(index)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSendFiles}
            >
              Send {selectedFiles.length} File
              {selectedFiles.length > 1 ? "s" : ""}
            </Button>
          </Box>
        ) : (
          <Box
            component="label"
            htmlFor="fileInput"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 4,
              cursor: "pointer",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Drag & Drop Files
            </Typography>
            <Typography variant="body2" color="text.secondary">
              or click to browse
            </Typography>
            <input
              type="file"
              multiple
              hidden
              id="fileInput"
              onChange={handleFileChange}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default FileDropzone;
