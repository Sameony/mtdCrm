import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import Home from './layout/Home.tsx';
import Login from './features/Login/Login.tsx';
import Dashboard from './features/Dashboard/Dashboard.tsx';
import ViewCustomers from './features/Customers/ViewCustomer.tsx';
import AddCustomer from './features/Customers/AddCustomer.tsx';
import { ToastContainer } from 'react-toastify';
import ViewOrder from './features/Orders/ViewOrder.tsx';
import CreateOrder from './features/Orders/CreateOrder.tsx';
import PaymentLayout from './features/Payments/PaymentLayout.tsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />, // Use MainLayout for routes that need the sidebar
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/users",
        element: <ViewCustomers />
      },
      {
        path: "/users/add",
        element: <AddCustomer />
      },
      {
        path: "/orders",
        element: <ViewOrder />
      },
      {
        path: "/orders/add",
        element: <CreateOrder />
      },
      {
        path: "/orders/payment",
        element: <PaymentLayout />
      },
      {
        path: "/orders/add",
        element: <CreateOrder />
      }
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
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover/>
  </React.StrictMode>,
)
