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

import Diversity2OutlinedIcon from '@mui/icons-material/Diversity2Outlined';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';

import SchemaOutlinedIcon from '@mui/icons-material/SchemaOutlined';
import BlindOutlinedIcon from '@mui/icons-material/BlindOutlined';
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

  const isActive = (path) => {
    // Decodifica tanto la ruta actual como la ruta que estamos comparando
    const decodedCurrentPath = decodeURIComponent(location.pathname);
    const decodedComparePath = decodeURIComponent(path);
    return decodedCurrentPath === decodedComparePath;
  };
  const isMantenimientoActive =
    isActive("/Mantenimiento/Departamentos") ||
    isActive("/Mantenimiento/Municipios") ||
    isActive("/Mantenimiento/Aldeas") ||
    isActive("/Mantenimiento/Etnias") ||
    isActive("/Mantenimiento/Área-Formación") ||
    isActive("/Mantenimiento/Tipo-Educador") ||
    isActive("/Mantenimiento/Discapacidades")
    ;

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
        width: open ? 255 : 75,
        flexShrink: 0,
        whiteSpace: "nowrap",
        "& .MuiDrawer-paper": {
          width: open ? 257 : 110,
          overflowX: "hidden",
          alignItems: open ? "" : "center",
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
          <Collapse in={openMantenimiento} timeout="auto" unmountOnExit sx={{ ml: 2.5 }}>
            <List component="div" disablePadding>
              <MenuItem
                path="/Mantenimiento/Departamentos"
                icon={<PublicOutlinedIcon />}
                text="Departamentos"
                onClick={() => navigate("/Mantenimiento/Departamentos")}
              />
              <MenuItem
                path="/Mantenimiento/Municipios"
                icon={<RoomOutlinedIcon />}
                text="Municipios"
                onClick={() => navigate("/Mantenimiento/Municipios")}
              />
              <MenuItem
                path="/Mantenimiento/Mantenimiento/Aldeas"
                icon={<SignpostOutlinedIcon />}
                text="Aldeas"
                onClick={() => navigate("/Mantenimiento/Aldeas")}
              />
              <MenuItem
                path="/Mantenimiento/Etnias"
                icon={<Diversity2OutlinedIcon />}
                text="Etnias"
                onClick={() => navigate("/Mantenimiento/Etnias")}
              />
              <MenuItem
                path="/Mantenimiento/Tipo-Educador"
                icon={<Groups2OutlinedIcon />}
                text="Tipo Educador"
                onClick={() => navigate("/Mantenimiento/Tipo-Educador")}
              />
              <MenuItem
                path="/Mantenimiento/Área-Formación"
                icon={<SchemaOutlinedIcon />}
                text="Áreas de Formación"
                onClick={() => navigate("/Mantenimiento/Área-Formación")}
              />
              <MenuItem
                path="/Mantenimiento/Discapacidades"
                icon={<BlindOutlinedIcon />}
                text="Discapacidades"
                onClick={() => navigate("/Mantenimiento/Discapacidades")}
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
            onClick={() => handleItemClick("/Mantenimiento/Departamentos")}

          >
            <ListItemIcon>
              <PublicOutlinedIcon
                fontSize="small"
                color={isActive("/Mantenimiento/Departamentos") ? "error" : "inherit"}
              />
            </ListItemIcon>
            <ListItemText
              primary="Departamentos"
              primaryTypographyProps={{
                color: isActive("/Mantenimiento/Departamentos") ? "error" : "inherit",
              }}
            />
          </MuiMenuItem>

          <MuiMenuItem
            onClick={() => handleItemClick("/Mantenimiento/Municipios")}

          >
            <ListItemIcon>
              <RoomOutlinedIcon
                fontSize="small"
                color={isActive("/Mantenimiento/Municipios") ? "error" : "inherit"}
              />
            </ListItemIcon>
            <ListItemText
              primary="Municipios"
              primaryTypographyProps={{
                color: isActive("/Mantenimiento/Municipios") ? "error" : "inherit",
              }}
            />
          </MuiMenuItem>

          <MuiMenuItem
            onClick={() => handleItemClick("/Mantenimiento/Aldeas")}

          >
            <ListItemIcon>
              <Diversity2OutlinedIcon
                fontSize="small"
                color={isActive("/Mantenimiento/Aldeas") ? "error" : "inherit"}
              />
            </ListItemIcon>
            <ListItemText
              primary="Aldeas"
              primaryTypographyProps={{
                color: isActive("/Mantenimiento/Aldeas") ? "error" : "inherit",
              }}
            />
          </MuiMenuItem>
          <MuiMenuItem
            onClick={() => handleItemClick("/Mantenimiento/Tipo-Educador")}

          >
            <ListItemIcon>
              <Groups2OutlinedIcon
                fontSize="small"
                color={isActive("/Mantenimiento/Tipo-Educador") ? "error" : "inherit"}
              />
            </ListItemIcon>
            <ListItemText
              primary="Tipo Educador"
              primaryTypographyProps={{
                color: isActive("/Mantenimiento/Tipo-Educador") ? "error" : "inherit",
              }}
            />
          </MuiMenuItem>
          <MuiMenuItem
            onClick={() => handleItemClick("/Mantenimiento/Área-Formación")}

          >
            <ListItemIcon>
              <BlindOutlinedIcon
                fontSize="small"
                color={isActive("/Mantenimiento/Área-Formación") ? "error" : "inherit"}
              />
            </ListItemIcon>
            <ListItemText
              primary="Áreas de Formación"
              primaryTypographyProps={{
                color: isActive("/Mantenimiento/Área-Formación") ? "error" : "inherit",
              }}
            />
          </MuiMenuItem>

          <MuiMenuItem
            onClick={() => handleItemClick("/Mantenimiento/Discapacidades")}
          >
            <ListItemIcon>
              <SchemaOutlinedIcon
                fontSize="small"
                color={isActive("/Mantenimiento/Discapacidades") ? "error" : "inherit"}
              />
            </ListItemIcon>
            <ListItemText
              primary="Discapacidades"
              primaryTypographyProps={{
                color: isActive("/Mantenimiento/Discapacidades") ? "error" : "inherit",
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
          <Collapse in={openSeguridad} timeout="auto" unmountOnExit sx={{ ml: 2.5 }}>
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
                color={isActive("/Usuarios") ? "error" : "inherit"}
              />
            </ListItemIcon>
            <ListItemText
              primary="Usuarios"
              primaryTypographyProps={{
                color: isActive("/Usuarios") ? "error" : "inherit",
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