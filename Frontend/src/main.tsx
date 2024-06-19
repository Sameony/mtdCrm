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
import ViewProducts from './features/Products/ViewProducts.tsx';
import ProductForm from './features/Products/AddProducts.tsx';


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
        path: "/customers",
        element: <ViewCustomers />
      },
      {
        path: "/customers/add",
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
        path: "/orders/:id/edit",
        element: <CreateOrder />
      },
      {
        path: "/orders/:id/payment",
        element: <PaymentLayout />
      },
      {
        path:"/products",
        element: <ViewProducts />
      },
      {
        path:"/products/add",
        element: <ProductForm />
      },
      {
        path:"/products/:id/edit",
        element: <ProductForm />
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
