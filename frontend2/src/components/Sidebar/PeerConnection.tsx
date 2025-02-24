import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Avatar,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

interface IncomingRequest {
  requesterId: string;
  requesterName?: string;
  requesterProfilePic?: string;
}

interface PeerConnectionProps {
  userId: string;
  onConnect: (peerId: string) => void; // callback for sending a connection request
  onApprove?: () => void; // callback when user approves incoming request
  onReject?: () => void; // callback when user rejects incoming request
  isConnected: boolean; // whether connection is established
  peerName?: string; // connected peer's name
  peerProfilePic?: string; // connected peer's profile picture URL
  incomingRequest?: IncomingRequest; // optional incoming request info
}

// Example styled status indicator
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

  const handleConnect = () => {
    if (peerId.trim()) {
      onConnect(peerId.trim());
    }
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <Paper elevation={1} sx={{ p: 2, maxWidth: 400, marginBottom: "16px" }}>
      {/* Header: Connection Status */}
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

        {/* Toggle for connected state */}
        {isConnected && (
          <IconButton onClick={toggleExpanded}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        )}
      </Box>

      {/* Incoming Request UI */}
      {incomingRequest && (
        <Box sx={{ mt: 2, mb: 2, display: "flex", alignItems: "center" }}>
          <Avatar
            src={incomingRequest.requesterProfilePic || ""}
            alt={incomingRequest.requesterName || "Requester"}
            sx={{ width: 48, height: 48, mr: 2 }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1">
              {incomingRequest.requesterName || incomingRequest.requesterId}{" "}
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

      {/* Collapsed view (only when connected and not expanded, and no incoming request) */}
      {isConnected && !expanded && !incomingRequest && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mt: 2,
            mb: 2,
          }}
        >
          <Avatar
            src={peerProfilePic || ""}
            alt={peerName || "Peer"}
            sx={{ width: 40, height: 40, mr: 2 }}
          />
          <Typography variant="body1">{peerName || "Unknown Peer"}</Typography>
        </Box>
      )}

      {/* Expanded view OR when not connected */}
      {(!isConnected || expanded) && !incomingRequest && (
        <Box sx={{ mt: 2 }}>
          {isConnected && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
              }}
            >
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
            disabled={!peerId.trim()}
          >
            Connect
          </Button>
        </Box>
      )}
    </Paper>
  );
};
