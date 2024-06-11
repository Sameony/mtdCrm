import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './layout/Home.tsx';
import Login from './features/Login/Login.tsx';
import Dashboard from './features/dashboard.tsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />, // Use MainLayout for routes that need the sidebar
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      // Add other routes that should include the sidebar here
    ],
  },
  {
    path: "/login",
    element: <Login />, // No sidebar for the login page
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
     <RouterProvider router={router} />
  </React.StrictMode>,
)
