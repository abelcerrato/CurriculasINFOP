import React, { useState, useRef } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Menu,
  MenuItem as MuiMenuItem,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import LocalLibraryOutlinedIcon from "@mui/icons-material/LocalLibraryOutlined";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { useNavigate, useLocation } from "react-router-dom";

const ProjectDrawer = ({ open }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openPages, setOpenPages] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuAnchorRef = useRef(null);

  const handleMenuOpen = (event) => {
    if (!open) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleItemClick = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const menuOpen = Boolean(anchorEl);
  const isActive = (path) => location.pathname === path;
  const isParentActive =
    isActive("/Departamentos") ||
    isActive("/Municipios") ||
    isActive("/Aldeas");

  const getMenuItemStyles = (path, isParent = false) => {
    const active = isParent ? isParentActive : isActive(path);

    return {
      justifyContent: open ? "initial" : "center",
      px: 2.5,
      borderRadius: 2,
      mx: 1,
      backgroundColor: active ? "red" : "inherit",
      "&:hover": {
        backgroundColor: active
          ? "#88CFE0"
          : !open
          ? "red"
          : "rgba(0, 0, 0, 0.04)",
        "& .MuiListItemIcon-root, & .MuiListItemText-root": {
          color: active || !open ? "white" : "inherit",
        },
      },
      "& .MuiListItemIcon-root": {
        color: active ? "white" : "inherit",
      },
      "& .MuiListItemText-root": {
        color: active ? "white" : "inherit",
      },
    };
  };

  const MenuItem = ({ path, icon, text, onClick, isParent }) => (
    <ListItemButton
      onClick={onClick}
      sx={getMenuItemStyles(path, isParent)}
      ref={isParent && !open ? menuAnchorRef : null}
      onMouseEnter={isParent && !open ? handleMenuOpen : undefined}
      onMouseLeave={isParent && !open ? handleMenuClose : undefined}
    >
      <ListItemIcon
        sx={{
          minWidth: 0,
          mr: open ? 3 : "auto",
          justifyContent: "center",
          "& .MuiSvgIcon-root": {
            fontSize: open ? "1.5rem" : "2rem",
          },
        }}
      >
        {icon}
      </ListItemIcon>
      {open && <ListItemText primary={text} />}
      {open && isParent && (openPages ? <ExpandLess /> : <ExpandMore />)}
    </ListItemButton>
  );

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? 250 : 72,
        flexShrink: 0,
        whiteSpace: "nowrap",
        "& .MuiDrawer-paper": {
          width: open ? 240 : 92,
          overflowX: "hidden",
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: open
                ? theme.transitions.duration.enteringScreen
                : theme.transitions.duration.leavingScreen,
            }),
          boxShadow: "none",
          border: "none",
        },
      }}
    >
      {/* Dashboard */}
      <List sx={{ marginTop: 12 }}>
        <MenuItem
          path="/dashboard"
          icon={<DashboardOutlinedIcon />}
          text="Dashboard"
          onClick={() => navigate("/dashboard")}
        />
      </List>

      {open && <Divider />}

      <List>
        <MenuItem
          path="/Maestros"
          icon={<LocalLibraryOutlinedIcon />}
          text="Maestros"
          onClick={() => navigate("/Maestros")}
        />
      </List>

      {open && <Divider />}

      {/* Mantenimiento con menú flotante */}
      <List>
        <MenuItem
          path="/mantenimiento"
          icon={<BuildOutlinedIcon />}
          text="Mantenimiento"
          onClick={() => (open ? setOpenPages(!openPages) : null)}
          isParent
        />

        {open && (
          <Collapse in={openPages} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <MenuItem
                path="/Departamentos"
                icon={<LoginIcon />}
                text="Departamentos"
                onClick={() => navigate("/Departamentos")}
              />
              <MenuItem
                path="/Municipios"
                icon={<AppRegistrationIcon />}
                text="Municipios"
                onClick={() => navigate("/Municipios")}
              />
              <MenuItem
                path="/Aldeas"
                icon={<AppRegistrationIcon />}
                text="Aldeas"
                onClick={() => navigate("/Aldeas")}
              />
            </List>
          </Collapse>
        )}

        {/* Menú flotante al lado del icono */}
        <Menu
          anchorEl={anchorEl}
          open={menuOpen && !open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "center", // Centrado verticalmente con el icono
            horizontal: "right", // Aparece a la derecha del icono
          }}
          transformOrigin={{
            vertical: "center", // Se alinea verticalmente
            horizontal: "left", // Comienza desde la izquierda del anchor
          }}
          PaperProps={{
            sx: {
              marginTop: 27,
              ml: 8, // Margen izquierdo pequeño
              boxShadow: 3, // Sombra más pronunciada
              minWidth: 200, // Ancho mínimo
            },
          }}
          disableAutoFocusItem
        >
          <MuiMenuItem
            onClick={() => handleItemClick("/Departamentos")}
            sx={{
              "&:hover": {
                backgroundColor: isActive("/Departamentos")
                  ? "#88CFE0"
                  : "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <ListItemIcon>
              <LoginIcon
                fontSize="small"
                color={isActive("/Departamentos") ? "primary" : "inherit"}
              />
            </ListItemIcon>
            <ListItemText
              primary="Departamentos"
              primaryTypographyProps={{
                color: isActive("/Departamentos") ? "primary" : "inherit",
              }}
            />
          </MuiMenuItem>

          <MuiMenuItem
            onClick={() => handleItemClick("/Municipios")}
            sx={{
              "&:hover": {
                backgroundColor: isActive("/Municipios")
                  ? "#88CFE0"
                  : "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <ListItemIcon>
              <AppRegistrationIcon
                fontSize="small"
                color={isActive("/Municipios") ? "primary" : "inherit"}
              />
            </ListItemIcon>
            <ListItemText
              primary="Municipios"
              primaryTypographyProps={{
                color: isActive("/Municipios") ? "primary" : "inherit",
              }}
            />
          </MuiMenuItem>

          <MuiMenuItem
            onClick={() => handleItemClick("/Aldeas")}
            sx={{
              "&:hover": {
                backgroundColor: isActive("/Aldeas")
                  ? "#88CFE0"
                  : "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <ListItemIcon>
              <AppRegistrationIcon
                fontSize="small"
                color={isActive("/Aldeas") ? "primary" : "inherit"}
              />
            </ListItemIcon>
            <ListItemText
              primary="Aldeas"
              primaryTypographyProps={{
                color: isActive("/Aldeas") ? "primary" : "inherit",
              }}
            />
          </MuiMenuItem>
        </Menu>
      </List>

      {open && <Divider />}
    </Drawer>
  );
};

export default ProjectDrawer;
