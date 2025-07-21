import {Box,AppBar,Toolbar,Typography,Drawer,List,ListItemButton,ListItemText,} from "@mui/material";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


const drawerWidth = 240;

const DashboardLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();         
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: "#808080" }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap>
            School Control
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#f0f0f0",
          },
        }}
      >
        <Toolbar />
        <List>
          <ListItemButton component={Link} to="/dashboard/teachers">
            <ListItemText primary="Teachers" />
          </ListItemButton>
          <ListItemButton component={Link} to="/dashboard/students">
            <ListItemText primary="Students" />
          </ListItemButton>
          <ListItemButton onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItemButton>

        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
