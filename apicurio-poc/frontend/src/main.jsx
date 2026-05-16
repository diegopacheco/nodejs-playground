import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRouter,
  RouterProvider,
  createRootRoute,
  createRoute,
  Outlet,
  Link
} from "@tanstack/react-router";
import MoviesPage from "./routes/movies.jsx";
import RentalsPage from "./routes/rentals.jsx";
import SchemaPage from "./routes/schema.jsx";
import "./styles.css";

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: () => (
    <div className="app">
      <header>
        <h1>Movie Rental</h1>
        <nav>
          <Link to="/">Movies</Link>
          <Link to="/rentals">Rentals</Link>
          <Link to="/schema">Schema</Link>
        </nav>
      </header>
      <main><Outlet /></main>
    </div>
  )
});

const moviesRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: MoviesPage });
const rentalsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/rentals", component: RentalsPage });
const schemaRoute = createRoute({ getParentRoute: () => rootRoute, path: "/schema", component: SchemaPage });

const router = createRouter({
  routeTree: rootRoute.addChildren([moviesRoute, rentalsRoute, schemaRoute])
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
