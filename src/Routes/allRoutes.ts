// auth
import LoginBoxed from "../pages/AuthenticationInner/Login/LoginBoxed";
import InvoiceListView from "../pages/Invoices/ListView";
import Ecommerce from "../pages/Dashboards/Ecommerce";
import HomePage from "../pages/Landing/HomePage";
import LandingPage from "../pages/Landing/LandingPage";

interface RouteObject {
  path: string;
  component: React.ComponentType<any>; // Use React.ComponentType to specify the type of the component
  exact?: boolean;
}

const authRoutes: Array<RouteObject> = [
  // profile
  { path: "/dashboard", component: Ecommerce },
  { path: "/apps-invoice-list", component: InvoiceListView },
];

const publicRoutes = [
  // auth
  { path: "/", component: HomePage },
  { path: "/welcome", component: LandingPage },
  { path: "/login", component: LoginBoxed },
];

export { authRoutes, publicRoutes };
