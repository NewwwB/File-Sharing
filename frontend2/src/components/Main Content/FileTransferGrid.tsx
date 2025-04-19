import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { useStateContext } from "../../contexts/StateContext";

const FileTransferGrid: React.FC = () => {
  const { state } = useStateContext();

  // Get transfers from global state
  const fileTransfers = state.fileTransfers || [];

  return (
    <Box m={0} width={"100%"}>
      <Typography variant="h5" gutterBottom>
        File Transfers
      </Typography>
      <Paper variant="outlined">
        <TableContainer sx={{ maxHeight: 350, overflowY: "auto" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>File Name</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fileTransfers.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell>{transfer.name}</TableCell>
                  <TableCell>
                    {transfer.status !== "completed" ? (
                      <>
                        <LinearProgress
                          variant="determinate"
                          value={transfer.progress}
                        />
                        {transfer.progress}%
                      </>
                    ) : (
                      <Box display="flex" alignItems="center">
                        <CheckCircle color="success" sx={{ mr: 1 }} />
                        Completed
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    {transfer.direction === "incoming"
                      ? "Receiving"
                      : "Sending"}
                  </TableCell>
                </TableRow>
              ))}
              {fileTransfers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No active file transfers
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default FileTransferGrid;
