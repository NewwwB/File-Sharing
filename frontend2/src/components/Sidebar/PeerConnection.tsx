import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Avatar,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useWebRTC } from "../../context/WebRTC";

interface IncomingRequest {
  requesterId: string;
  requesterName?: string;
  requesterProfilePic?: string;
}

interface PeerConnectionProps {
  userId: string;
  onConnect: (peerId: string) => Promise<void>; // Updated to return a promise for async handling
  onApprove?: () => void;
  onReject?: () => void;
  isConnected: boolean;
  peerName?: string;
  peerProfilePic?: string;
  incomingRequest?: IncomingRequest;
}

const StatusIndicator = styled("div")<{ connected: boolean }>(
  ({ connected, theme }) => ({
    display: "inline-block",
    marginLeft: theme.spacing(1),
    color: connected ? theme.palette.success.main : theme.palette.error.main,
    fontWeight: "bold",
  })
);

export const PeerConnection: React.FC<PeerConnectionProps> = ({
  userId,
  onConnect,
  onApprove,
  onReject,
  isConnected,
  peerName,
  peerProfilePic,
  incomingRequest,
}) => {
  const [peerId, setPeerId] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false); // New state for loading indicator

  const handleConnect = async () => {
    if (peerId.trim()) {
      setLoading(true); // Start loading
      try {
        await onConnect(peerId.trim()); // Await the connection process
      } catch (error) {
        console.error("Connection failed", error);
      }
      setLoading(false); // Stop loading
    }
  };

  const { incomingConnection } = useWebRTC();

  // this is new branch

  return (
    <Paper elevation={1} sx={{ p: 2, maxWidth: 400, marginBottom: "16px" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6">
          {isConnected ? "Connected" : "Disconnected"}
          <StatusIndicator connected={isConnected}>●</StatusIndicator>
        </Typography>
        {isConnected && (
          <IconButton onClick={() => setExpanded(!expanded)}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        )}
      </Box>

      {incomingConnection && (
        <Box sx={{ mt: 2, mb: 2, display: "flex", alignItems: "center" }}>
          <Avatar
            src={incomingConnection.client.profilePic || ""}
            alt={incomingConnection.client.name || "Requester"}
            sx={{ width: 48, height: 48, mr: 2 }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1">
              {incomingConnection.client.name || incomingConnection.client.id}{" "}
              wants to connect.
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={onApprove}
                sx={{ mr: 1 }}
              >
                Approve
              </Button>
              <Button variant="outlined" color="error" onClick={onReject}>
                Reject
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {(!isConnected || expanded) && !incomingRequest && (
        <Box sx={{ mt: 2 }}>
          {isConnected && (
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                src={peerProfilePic || ""}
                alt={peerName || "Peer"}
                sx={{ width: 48, height: 48, mr: 2 }}
              />
              <Typography variant="body1">
                {peerName || "Unknown Peer"}
              </Typography>
            </Box>
          )}

          <TextField
            label="Your ID"
            variant="outlined"
            value={userId}
            disabled
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Connect to Peer"
            variant="outlined"
            placeholder="Enter peer ID"
            value={peerId}
            onChange={(e) => setPeerId(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleConnect}
            disabled={loading || !peerId.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : null} // Loading indicator
          >
            {loading ? "Connecting..." : "Connect"}
          </Button>
        </Box>
      )}
    </Paper>
  );
};
