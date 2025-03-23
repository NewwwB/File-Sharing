import React from "react";
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  Badge,
} from "@mui/material";
import { useWebRTC } from "../../context/WebRTC";
import { User } from "../../types/webrtcMessages";

interface UserCardProps {
  user: User;
  status: "online" | "offline";
}

const UserCard: React.FC<UserCardProps> = ({ user, status }) => {
  const handleClick = (user: User) => {
    const { handleConnect } = useWebRTC();

    handleConnect(user);
  };

  return (
    <>
      <Card
        sx={{
          // width: 250,
          display: "flex",
          alignItems: "center",
          padding: 2,
          borderRadius: 2,
          flexShrink: 0,
        }}
      >
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={
            <span
              style={{
                width: 10,
                height: 10,
                backgroundColor: "#00C853",
                borderRadius: "50%",
              }}
            ></span>
          }
        >
          <Avatar sx={{ width: 50, height: 50, backgroundColor: "#ccc" }}>
            {" "}
          </Avatar>
        </Badge>
        <CardContent sx={{ flex: 1, padding: "0 10px" }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {user.name.split(" ")[0]}
          </Typography>
          <Typography variant="subtitle1">{user.name.split(" ")[1]}</Typography>
          <Typography variant="caption" color="text.secondary">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Typography>
        </CardContent>
        <Button
          variant="contained"
          onClick={() => handleClick(user)}
          size="small"
          sx={{ textTransform: "none" }}
        >
          Connect
        </Button>
      </Card>
    </>
  );
};

export default UserCard;
