import Button, {ButtonProps} from "@mui/material/Button";
import { alpha, styled } from '@mui/material/styles';


const MenuButton = styled(Button)<ButtonProps>(({theme}) => ({

    textTransform: 'none',
    margin: 10,
    padding: 20,
    width: 125,
    height: 35,
    boxShadow: 'none',
    background: "white",
    color: "black",
    border: '1px solid grey',
    '&:hover':{
        border: '1px solid black',
        background: "white",
        boxShadow: 'none',
    },
    '&:active':{
        border: '1px solid black',
        background: "white",
        boxShadow: 'none',
    }
}));

export default MenuButton;