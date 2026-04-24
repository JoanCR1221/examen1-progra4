import { createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import Home from './components/Home';
import CarParts from './components/CarParts';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// 1. Creamos la ruta raíz (Layout principal)
export const rootRoute = createRootRoute({
  component: () => (
    <>
      <Navbar />
      <main>
        <Outlet /> {/* Aquí es donde se renderizarán las páginas */}
      </main>
      <Footer />
    </>
  ),
});

// 2. Definimos las rutas específicas
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const carPartsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/parts',
  component: CarParts,
});

// 3. Creamos el árbol de rutas
export const routeTree = rootRoute.addChildren([indexRoute, carPartsRoute]);