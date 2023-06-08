import React, { lazy } from "react";
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
  Navigate,
} from "react-router-dom";

import ScrollToTop from "./components/scroll-to-top";
import AppRoutes from "./lib/routes";

import PrivateRoute from "./components/private-route";

import GroceryList from "./pages/grocery/grocery-list";
import Profile from "./pages/profile";
import EditProfile from "./pages/profile/edit-profile";

import Register from "./pages/home/register";
import Settings from "./pages/profile/settings";
import Disclaimer from "./pages/profile/disclaimer";
import Account from "./pages/profile/account";
import GroceryDetail from "./pages/grocery/grocery-detail";
import WriteGrocery from "./pages/grocery/create-grocery/write-grocery";
import GroceryItemDetail from "./pages/grocery/grocery-item-detail";

const Home = React.lazy(() => import("./pages/home"));

export default function Routes() {
  const privateRoutes = [
    {
      path: AppRoutes.WriteGrocery,
      element: <WriteGrocery />,
    },
    {
      path: AppRoutes.Groceries,
      element: <GroceryList />,
    },
    {
      path: `${AppRoutes.Groceries}/:groceryId`,
      element: <GroceryDetail />,
    },
    {
      path: `${AppRoutes.Groceries}/:groceryId${AppRoutes.GroceryItems}/:groceryItemId`,
      element: <GroceryItemDetail />,
    },
    // {
    //   path: AppRoutes.Settings,
    //   element: <Settings />,
    // },
    {
      path: AppRoutes.Profile,
      element: <Profile />,
    },
    {
      path: AppRoutes.EditProfile,
      element: <EditProfile />,
    },
    {
      path: AppRoutes.ProfileAccount,
      element: <Account />,
    },
  ];

  return (
    <Router>
      <ScrollToTop />

      <Switch>
        {/* public routes */}
        <Route path="*" element={<Navigate to={AppRoutes.Home} />} />

        <Route path={AppRoutes.Home} element={<Home />} />

        <Route path={AppRoutes.Signup} element={<Register />} />

        <Route path={AppRoutes.Disclaimer} element={<Disclaimer />} />

        {/*
        <Route path={AppRoutes.VerifyEmail} element={<EmailVerification />} /> */}

        <Route element={<PrivateRoute />}>
          {privateRoutes?.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Switch>
    </Router>
  );
}
