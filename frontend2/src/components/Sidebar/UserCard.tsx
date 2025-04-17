import React from "react";
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  Badge,
} from "@mui/material";
import { OfferMessage, User } from "../../types/webRTCMessages";
import { webRTCService } from "../../services/WebRTCServices";
import { webSocketService } from "../../services/WebSocketService";
import { useStateContext } from "../../contexts/StateContext";

interface UserCardProps {
  user: User;
  status: "online" | "offline";
}

const UserCard: React.FC<UserCardProps> = ({ user, status }) => {
  const { state, dispatch } = useStateContext();

  const handleConnect = async () => {
    dispatch({ type: "SET_REMOTE_USER", payload: user });
    if (state.user) {
      webRTCService.cleanup();
      webRTCService.setupConnection(state.user, user, dispatch);
      webRTCService.createDummyDataChannel();
      const offer = await webRTCService.createOffer();
      if (!offer) {
        console.warn("failed to create offer while connecting");
        return;
      }
      const msg: OfferMessage = {
        type: "offer",
        data: {
          offer,
          from: state.user,
          to: user,
        },
      };
      webSocketService.send(msg);
    } else {
      console.warn("user state has not been setuped");
    }
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
          onClick={handleConnect}
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
