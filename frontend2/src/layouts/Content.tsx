import { Box } from "@mui/material";
import FileTransferGrid from "../components/Main Content/FileTransferGrid";
import FileDropzone from "../components/Main Content/FileDropZone";

function Content() {
  return (
    <>
      <Box flex={5} p={2}>
        <FileTransferGrid />
        <FileDropzone />
      </Box>
    </>
  );
}

export default Content;
