import { Box, Typography } from "@mui/material";
import { useState } from "react";
import AppBarComponent from "./AppBar";
import ProjectDrawer from "./Drawer";
import React from "react";
import BreadcrumbsDinamico from "./BreadcrumbsDinamico";

const Dashboard = ({ children }) => {
  const [openDrawer, setOpenDrawer] = useState(true);

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Pasa openDrawer como prop 'open' al AppBarComponent */}
      <AppBarComponent open={openDrawer} toggleDrawer={toggleDrawer} />

      <ProjectDrawer open={openDrawer} toggleDrawer={toggleDrawer} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 5,
          marginTop: "100px",
          marginLeft: openDrawer ? "20px" : "50px",
          marginRight: openDrawer ? "20px" : "50px",
          width: openDrawer ? "calc(100% - 250px)" : "calc(100% - 72px)",
          height: "calc(100vh - 80px)",
          overflow: "auto",
          transition: (theme) =>
            theme.transitions.create(["margin", "width"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          borderRadius: 5,
          backgroundColor: "#f2f2f2",
        }}
      >
        <BreadcrumbsDinamico />
        {children}

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 5, py: 2 }}
        >
          {"Copyright © "}
          Propiedad intelectual del Consejo Nacional de Educación
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
