import React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { color } from "../Components/style/Color";

const BreadcrumbsDinamico = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    const formatName = (path) => {
        // Primero decodifica los caracteres especiales (como %C3%B3 -> ó)
        const decodedPath = decodeURIComponent(path);

        // Luego formatea el nombre (convierte "nombre-ruta" a "Nombre Ruta")
        return decodedPath
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // Genera todos los breadcrumbs con sus rutas completas
    const generateBreadcrumbs = () => {
        let breadcrumbs = [];
        let accumulatedPath = '';

        // Breadcrumb "Inicio" (siempre presente)
        breadcrumbs.push({
            name: 'Inicio',
            path: '/dashboard',
            isCurrent: false
        });

        // Breadcrumbs dinámicos basados en la ruta
        pathnames.forEach((name, index) => {
            // Decodifica el nombre para la visualización
            const decodedName = decodeURIComponent(name);
            accumulatedPath += `/${name}`; // Mantiene la codificación en la URL

            const isLast = index === pathnames.length - 1;

            breadcrumbs.push({
                name: formatName(decodedName),
                path: accumulatedPath,
                isCurrent: isLast
            });
        });

        return breadcrumbs;
    };

    const breadcrumbs = generateBreadcrumbs();

    return (
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            {breadcrumbs.map((crumb, index) => (
                crumb.isCurrent ? (
                    <Typography
                        key={index}
                        sx={{
                            color: color.rojo,
                            fontWeight: 'bold',
                        }}
                    >
                        {crumb.name}
                    </Typography>
                ) : (
                    <Link
                        key={index}
                        component={RouterLink}
                        to={crumb.path}
                        sx={{
                            color: color.azul,
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            '&:hover': {
                                textDecoration: 'underline',
                            }
                        }}
                    >
                        {crumb.name}
                    </Link>
                )
            ))}
        </Breadcrumbs>
    );
};

export default BreadcrumbsDinamico;