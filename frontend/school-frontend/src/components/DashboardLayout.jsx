import {Box,AppBar,Toolbar,Typography,Drawer,List,ListItemButton,ListItemText,} from "@mui/material";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";




const drawerWidth = 240;

const DashboardLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const role = auth?.role; 
  const teacherLinks = [
    { to: "/dashboard/students", label: "Students" },
    { to: "/exams/create",      label: "Create Exam" },
  ];
  const studentLinks = [
    { to: "/dashboard/exams",             label: "Exams" },
    { to: "/dashboard/profile", label: "My Details" },
  ];
  const adminLinks = [
    { to: "/dashboard/teachers", label: "Teachers" },
    { to: "/dashboard/students", label: "Students" },
  ];

  let links = [];
  if (role === "Admin") links = adminLinks;
  else if (role === "Teacher") links = teacherLinks;
  else if (role === "Student") links = studentLinks;

         


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
          {links.map(({ to, label }) => (
            <ListItemButton key={label} component={Link} to={to}>
              <ListItemText primary={label} />
            </ListItemButton>))}

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
