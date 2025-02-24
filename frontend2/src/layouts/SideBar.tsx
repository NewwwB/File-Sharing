import React, { useState, useEffect, useRef } from "react";
import { Divider, Box, Typography, Stack } from "@mui/material";
import UserCard from "../components/Sidebar/UserCard";
import Connection from "../components/Sidebar/Connection";
import { PeerConnection } from "../components/Sidebar/PeerConnection";

interface People {
  id: number;
  name: string;
  online: boolean;
  profilePic: string;
}

type StatusIndicatorProps = "connected" | "disconnected" | "loading";

const SideBar = () => {
  const [connectionStatus, setConnectionStatus] =
    useState<StatusIndicatorProps>("loading"); // 'loading', 'connected', 'disconnected'
  const [people, setPeople] = useState<People[]>([]);

  // Populate mock data
  useEffect(() => {
    setPeople([
      {
        id: 1,
        name: "John Doe",
        online: true,
        profilePic: "https://via.placeholder.com/40",
      },
      {
        id: 2,
        name: "Jane Smith",
        online: false,
        profilePic: "https://via.placeholder.com/40",
      },
      {
        id: 3,
        name: "Alice Johnson",
        online: true,
        profilePic: "https://via.placeholder.com/40",
      },
      {
        id: 4,
        name: "Robert Brown",
        online: false,
        profilePic: "https://via.placeholder.com/40",
      },
      {
        id: 5,
        name: "Emily Davis",
        online: true,
        profilePic: "https://via.placeholder.com/40",
      },
      {
        id: 6,
        name: "Michael Wilson",
        online: false,
        profilePic: "https://via.placeholder.com/40",
      },
      {
        id: 7,
        name: "Sarah Taylor",
        online: true,
        profilePic: "https://via.placeholder.com/40",
      },
      {
        id: 8,
        name: "David Anderson",
        online: false,
        profilePic: "https://via.placeholder.com/40",
      },
      {
        id: 9,
        name: "Sophia Martinez",
        online: true,
        profilePic: "https://via.placeholder.com/40",
      },
      {
        id: 10,
        name: "James Thomas",
        online: false,
        profilePic: "https://via.placeholder.com/40",
      },
    ]);
  }, []);

  // Simulate a connection check
  useEffect(() => {
    setTimeout(() => {
      setConnectionStatus("connected");
    }, 2000);
  }, []);

  const status = useRef<StatusIndicatorProps | null>(null);

  function handleClick(): void {
    status.current = connectionStatus;
    setConnectionStatus("loading");

    setTimeout(() => {
      setConnectionStatus(
        status.current === "connected" ? "disconnected" : "connected"
      );
    }, 2000);
  }

  const [connected, setConnected] = useState(false);
  const [peerName, setPeerName] = useState("");
  const [peerProfilePic, setPeerProfilePic] = useState("");
  const [incomingRequest, setIncomingRequest] = useState<{
    requesterId: string;
    requesterName?: string;
    requesterProfilePic?: string;
  } | null>(null);

  const handleConnect = (peerId: string) => {
    console.log("Sending connection request to:", peerId);
    // Here, you would send the connection request to the specified peer.
    // For demonstration, let's simulate an incoming request on the peer's end:
    setTimeout(() => {
      // On the receiving end, you might call setIncomingRequest with the requester's info.
      setIncomingRequest({
        requesterId: "user-1234",
        requesterName: "Alice",
        requesterProfilePic: "https://via.placeholder.com/150",
      });
    }, 500);
  };

  const handleApprove = () => {
    console.log("Incoming connection approved.");
    // Accept the incoming request and establish connection
    setConnected(true);
    setPeerName(incomingRequest?.requesterName || "Unknown Peer");
    setPeerProfilePic(incomingRequest?.requesterProfilePic || "");
    // Clear the incoming request
    setIncomingRequest(null);
  };

  const handleReject = () => {
    console.log("Incoming connection rejected.");
    // Reject the incoming request
    setIncomingRequest(null);
  };

  return (
    <Box p={2} display="flex" flexDirection="column" sx={{ width: "400px" }}>
      {/* Connection Section */}
      {/* <Connection
        connectionStatus={connectionStatus}
        handleClick={handleClick}
      /> */}

      <PeerConnection
        userId="user-63kpzktfr"
        onConnect={handleConnect}
        onApprove={handleApprove}
        onReject={handleReject}
        isConnected={connected}
        peerName={peerName}
        peerProfilePic={peerProfilePic}
        incomingRequest={incomingRequest || undefined}
      />

      <Divider />

      {/* Previous Connection Heading */}
      <Stack spacing={2} m={2} direction="row">
        <Typography sx={{ fontWeight: 500 }}>Previous Connection</Typography>
      </Stack>

      {/* Scrollable Content */}
      <Box
        flexGrow={1} // Takes all available space
        sx={{ overflowY: "auto" }} // Enables scrolling
        display="flex"
        flexDirection="column"
        p={1}
        gap={2}
      >
        {people.map((value) => (
          <UserCard
            key={value.id}
            name={value.name}
            status={value.online ? "online" : "offline"}
          />
        ))}
      </Box>
    </Box>
  );
};

export default SideBar;
