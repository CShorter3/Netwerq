import { createBrowserRouter } from 'react-router-dom';
// import LoginFormPage from '../components/LoginFormPage';
// import SignupFormPage from '../components/SignupFormPage';
import SplashPage from '../components/SplashPage/SplashPage';
import Dashboard from '../components/Dashboard';
import ContactProfilePage from '../components/ContactProfilePage';
import Layout from './Layout';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: < SplashPage />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      // {
      //   path: "login",
      //   element: <LoginFormPage />,
      // },
      // {
      //   path: "signup",
      //   element: <SignupFormPage />,
      // },
      {
        path: "contacts/new",
        element: <ContactProfilePage isNewContact={true} />
      },
      {
        path: "contacts/:contactId",
        element: <ContactProfilePage />
      },
      {
        path: "contacts/:contactId/edit",
        element: <ContactProfilePage />
      }
    ],
  },
]);