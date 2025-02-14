import { Stack, Box, Button, Typography } from "@mui/material";

type ConnectionStatus = "connected" | "disconnected" | "loading";

type ConnectionPropType = {
  connectionStatus: ConnectionStatus;
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const Connection: React.FC<ConnectionPropType> = ({
  connectionStatus,
  handleClick,
}) => {
  return (
    <Stack
      direction="row"
      spacing={6}
      mb={2}
      mt={2}
      alignItems="center" // Centers items vertically
      justifyContent="space-between"
      sx={{ width: "100%" }}
    >
      <Box
        display="flex"
        gap={1}
        alignItems="center"
        justifyContent="start"
        p={1}
        sx={{ minWidth: "120px" }}
      >
        <StatusIndicator connectionStatus={connectionStatus} />
        <Typography>{connectionStatus}</Typography>
      </Box>
      <Button
        size="small"
        onClick={handleClick}
        loading={connectionStatus === "loading"}
        disabled={connectionStatus === "loading"}
        loadingPosition="end"
        variant="contained"
        sx={{ minWidth: "120px" }}
      >
        {connectionStatus === "connected" ? "disconnect" : "connect"}
      </Button>
    </Stack>
  );
};

export default Connection;

const StatusIndicator: React.FC<{ connectionStatus: ConnectionStatus }> = ({
  connectionStatus,
}) => {
  let backgroundColor = "";

  switch (connectionStatus) {
    case "connected":
      backgroundColor = "#48bb78"; // bg-green-500
      break;
    case "disconnected":
      backgroundColor = "#f56565"; // bg-red-500
      break;
    default:
      backgroundColor = "#ecc94b"; // bg-yellow-500
      break;
  }

  const style = {
    width: "0.5rem", // w-2 in Tailwind
    height: "0.5rem", // h-2 in Tailwind
    borderRadius: "9999px", // rounded-full in Tailwind
    backgroundColor: backgroundColor,
  };

  return <div style={style} />;
};
