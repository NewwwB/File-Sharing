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
} from "@mui/material";
import { Pause, Cancel } from "@mui/icons-material";

interface FileTransfer {
  id: number;
  name: string;
  progress: number;
  speed: string;
  remaining: string;
  status: "uploading" | "paused";
}

const initialFiles: FileTransfer[] = [
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
];

const FileTransferGrid: React.FC = () => {
  const [files, setFiles] = useState<FileTransfer[]>(initialFiles);

  const handlePause = (id: number) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.id === id
          ? {
              ...file,
              status: file.status === "paused" ? "uploading" : "paused",
            }
          : file
      )
    );
  };

  const handleCancel = (id: number) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  };

  return (
    <TableContainer>
      <Table>
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
          {files.map((file) => (
            <TableRow key={file.id}>
              <TableCell>{file.name}</TableCell>
              <TableCell>
                <LinearProgress variant="determinate" value={file.progress} />
                {file.progress}%
              </TableCell>
              <TableCell>{file.speed}</TableCell>
              <TableCell>{file.remaining}</TableCell>
              <TableCell>
                <Button onClick={() => handlePause(file.id)}>
                  <Pause
                    color={file.status === "paused" ? "primary" : "inherit"}
                  />
                </Button>
                <Button onClick={() => handleCancel(file.id)}>
                  <Cancel color="error" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FileTransferGrid;
