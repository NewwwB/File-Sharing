import { IconButton } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";

type Props = {
    toggleTheme: () => void;
    darkMode: boolean;
};

function DarkMode({toggleTheme, darkMode}: Props){
    return (
        <IconButton onClick={toggleTheme} color="inherit">
            {darkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
    );
}

export default DarkMode;