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
import { useNavigate, useLocation } from "react-router-dom";

import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import SignpostOutlinedIcon from '@mui/icons-material/SignpostOutlined';

import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';


const ProjectDrawer = ({ open }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Estados separados para cada menú
  const [openMantenimiento, setOpenMantenimiento] = useState(false);
  const [openSeguridad, setOpenSeguridad] = useState(false);

  // Refs y estados para los menús flotantes
  const mantenimientoAnchorRef = useRef(null);
  const seguridadAnchorRef = useRef(null);
  const [mantenimientoMenuOpen, setMantenimientoMenuOpen] = useState(false);
  const [seguridadMenuOpen, setSeguridadMenuOpen] = useState(false);

  const handleMantenimientoMenuOpen = (event) => {
    if (!open) {
      setMantenimientoMenuOpen(true);
    }
  };

  const handleSeguridadMenuOpen = (event) => {
    if (!open) {
      setSeguridadMenuOpen(true);
    }
  };

  const handleMenuClose = () => {
    setMantenimientoMenuOpen(false);
    setSeguridadMenuOpen(false);
  };

  const handleItemClick = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const isActive = (path) => location.pathname === path;
  const isMantenimientoActive =
    isActive("/Departamentos") ||
    isActive("/Municipios") ||
    isActive("/Aldeas");

  const isSeguridadActive = isActive("/Usuarios");

  const getMenuItemStyles = (path, isParent = false, parentActive = false) => {
    const active = isParent ? parentActive : isActive(path);

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

  const MenuItem = ({ path, icon, text, onClick, isParent, parentActive, menuRef, onMouseEnter, onMouseLeave }) => (
    <ListItemButton
      onClick={onClick}
      sx={getMenuItemStyles(path, isParent, parentActive)}
      ref={menuRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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
      {open && isParent && ((isParent === "mantenimiento" ? openMantenimiento : openSeguridad) ? <ExpandLess /> : <ExpandMore />)}
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
          onClick={() => (open ? setOpenMantenimiento(!openMantenimiento) : null)}
          isParent="mantenimiento"
          parentActive={isMantenimientoActive}
          menuRef={mantenimientoAnchorRef}
          onMouseEnter={handleMantenimientoMenuOpen}
          onMouseLeave={handleMenuClose}
        />

        {open && (
          <Collapse in={openMantenimiento} timeout="auto" unmountOnExit sx={{ ml: 3 }}>
            <List component="div" disablePadding>
              <MenuItem
                path="/Departamentos"
                icon={<PublicOutlinedIcon />}
                text="Departamentos"
                onClick={() => navigate("/Departamentos")}
              />
              <MenuItem
                path="/Municipios"
                icon={<RoomOutlinedIcon />}
                text="Municipios"
                onClick={() => navigate("/Municipios")}
              />
              <MenuItem
                path="/Aldeas"
                icon={<SignpostOutlinedIcon />}
                text="Aldeas"
                onClick={() => navigate("/Aldeas")}
              />
            </List>
          </Collapse>
        )}

        {/* Menú flotante de Mantenimiento */}
        <Menu
          anchorEl={mantenimientoAnchorRef.current}
          open={mantenimientoMenuOpen && !open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "center",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "center",
            horizontal: "left",
          }}
          PaperProps={{
            sx: {
              marginTop: 27,
              ml: 8,
              boxShadow: 3,
              minWidth: 200,
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
              <PublicOutlinedIcon
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
              <RoomOutlinedIcon
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
              <SignpostOutlinedIcon
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

      {/* Seguridad con menú flotante */}
      <List>
        <MenuItem
          path="/seguridad"
          icon={<AdminPanelSettingsOutlinedIcon />}
          text="Seguridad"
          onClick={() => (open ? setOpenSeguridad(!openSeguridad) : null)}
          isParent="seguridad"
          parentActive={isSeguridadActive}
          menuRef={seguridadAnchorRef}
          onMouseEnter={handleSeguridadMenuOpen}
          onMouseLeave={handleMenuClose}
        />

        {open && (
          <Collapse in={openSeguridad} timeout="auto" unmountOnExit sx={{ ml: 3 }}>
            <List component="div" disablePadding>
              <MenuItem
                path="/Usuarios"
                icon={<PeopleAltOutlinedIcon />}
                text="Usuarios"
                onClick={() => navigate("/Usuarios")}
              />
            </List>
          </Collapse>
        )}

        {/* Menú flotante de Seguridad */}
        <Menu
          anchorEl={seguridadAnchorRef.current}
          open={seguridadMenuOpen && !open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "center",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "center",
            horizontal: "left",
          }}
          PaperProps={{
            sx: {
              marginTop: 35,
              ml: 8,
              boxShadow: 3,
              minWidth: 200,
            },
          }}
          disableAutoFocusItem
        >
          <MuiMenuItem
            onClick={() => handleItemClick("/Usuarios")}
            sx={{
              "&:hover": {
                backgroundColor: isActive("/Usuarios")
                  ? "#88CFE0"
                  : "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <ListItemIcon>
              <PeopleAltOutlinedIcon
                fontSize="small"
                color={isActive("/Usuarios") ? "primary" : "inherit"}
              />
            </ListItemIcon>
            <ListItemText
              primary="Usuarios"
              primaryTypographyProps={{
                color: isActive("/Usuarios") ? "primary" : "inherit",
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