import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Button,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import { Pause, Cancel, CheckCircle, HighlightOff } from "@mui/icons-material";

interface FileTransfer {
  id: number;
  name: string;
  progress: number; // 0-100
  speed: string;
  remaining: string;
  status: "uploading" | "paused" | "downloading" | "incoming";
}

const initialFiles: FileTransfer[] = [
  // Ongoing transmissions
  {
    id: 1,
    name: "file1.txt",
    progress: 40,
    speed: "500 KB/s",
    remaining: "2 MB",
    status: "uploading",
  },
  {
    id: 2,
    name: "file2.zip",
    progress: 70,
    speed: "1 MB/s",
    remaining: "5 MB",
    status: "uploading",
  },
  {
    id: 3,
    name: "image.png",
    progress: 100,
    speed: "0 KB/s",
    remaining: "0 MB",
    status: "downloading",
  },
  {
    id: 4,
    name: "video.mp4",
    progress: 25,
    speed: "700 KB/s",
    remaining: "15 MB",
    status: "uploading",
  },
  {
    id: 5,
    name: "document.pdf",
    progress: 90,
    speed: "300 KB/s",
    remaining: "1 MB",
    status: "uploading",
  },
  {
    id: 6,
    name: "archive.rar",
    progress: 100,
    speed: "0 KB/s",
    remaining: "0 MB",
    status: "paused",
  },
  // Incoming files
  {
    id: 7,
    name: "new_document.pdf",
    progress: 0,
    speed: "N/A",
    remaining: "N/A",
    status: "incoming",
  },
  {
    id: 8,
    name: "presentation.pptx",
    progress: 0,
    speed: "N/A",
    remaining: "N/A",
    status: "incoming",
  },
];

const FileTransferGrid: React.FC = () => {
  const [files, setFiles] = useState<FileTransfer[]>(initialFiles);

  // Toggle pause/resume for ongoing transmissions only
  const handlePause = (id: number) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.id === id && file.status !== "incoming"
          ? {
              ...file,
              status: file.status === "paused" ? "uploading" : "paused",
            }
          : file
      )
    );
  };

  // Cancel any file transmission (ongoing or incoming)
  const handleCancel = (id: number) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  };

  // Accept an incoming file: move it into transmission state
  const handleAccept = (id: number) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.id === id && file.status === "incoming"
          ? {
              ...file,
              status: "uploading",
              progress: 1,
              speed: "Initializing",
              remaining: "Calculating",
            }
          : file
      )
    );
  };

  // Reject an incoming file: remove from list
  const handleReject = (id: number) => {
    setFiles((prevFiles) =>
      prevFiles.filter((file) => file.id !== id || file.status !== "incoming")
    );
  };

  // Bulk accept all incoming files
  const handleAcceptAll = () => {
    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.status === "incoming"
          ? {
              ...file,
              status: "uploading",
              progress: 1,
              speed: "Initializing",
              remaining: "Calculating",
            }
          : file
      )
    );
  };

  // Bulk reject all incoming files
  const handleRejectAll = () => {
    setFiles((prevFiles) =>
      prevFiles.filter((file) => file.status !== "incoming")
    );
  };

  // Separate files by status
  const ongoingFiles = files.filter((file) => file.status !== "incoming");
  const incomingFiles = files.filter((file) => file.status === "incoming");

  return (
    <Box m={0} width={"100%"}>
      <Typography variant="h5" gutterBottom>
        File Transfers
      </Typography>
      <Paper variant="outlined">
        <TableContainer
          sx={{
            maxHeight: 350,
            overflowY: "auto",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>File Name</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Speed</TableCell>
                <TableCell>Remaining</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Render ongoing transmissions */}
              {ongoingFiles.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>{file.name}</TableCell>
                  <TableCell>
                    {file.progress < 100 ? (
                      <>
                        <LinearProgress
                          variant="determinate"
                          value={file.progress}
                        />
                        {file.progress}%
                      </>
                    ) : (
                      "Completed"
                    )}
                  </TableCell>
                  <TableCell>{file.speed}</TableCell>
                  <TableCell>{file.remaining}</TableCell>
                  <TableCell>
                    {file.progress < 100 && (
                      <Button onClick={() => handlePause(file.id)}>
                        <Pause
                          color={
                            file.status === "paused" ? "primary" : "inherit"
                          }
                        />
                      </Button>
                    )}
                    <Button onClick={() => handleCancel(file.id)}>
                      <Cancel color="error" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {/* Render incoming files */}
              {incomingFiles.length > 0 && (
                <>
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mt={2}
                      >
                        <Typography variant="h6">Incoming Files</Typography>
                        <Box>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={handleAcceptAll}
                            sx={{ mr: 1 }}
                          >
                            Accept All
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={handleRejectAll}
                          >
                            Reject All
                          </Button>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                  {incomingFiles.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell>{file.name}</TableCell>
                      <TableCell>N/A</TableCell>
                      <TableCell>N/A</TableCell>
                      <TableCell>N/A</TableCell>
                      <TableCell>
                        <Button onClick={() => handleAccept(file.id)}>
                          <CheckCircle color="success" />
                        </Button>
                        <Button onClick={() => handleReject(file.id)}>
                          <HighlightOff color="error" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default FileTransferGrid;
