import App from "@/App";
import AdminLayout from "@/layout/AdminLayout";
import AddNewCustomer from "@/pages/Admin/AddNewCustomer";
import Analytics from "@/pages/Admin/Analytics";
import CreateQuote from "@/pages/Admin/CreateQuote";
import Customers from "@/pages/Admin/Customers";
import Dashboard from "@/pages/Admin/Dashboard";
import Invoices from "@/pages/Admin/Invoices";
import JobBoard from "@/pages/Admin/JobBoard";
import Messages from "@/pages/Admin/Messages";
import Mockups from "@/pages/Admin/Mockups";
import Payment from "@/pages/Admin/Payment";
import Products from "@/pages/Admin/Products";
import Quotes from "@/pages/Admin/Quotes";
import ForgotPassword from "@/pages/ForgotPassword";
import Login from "@/pages/Login";
import VerifyCode from "@/pages/VerifyCode";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Settings Pages
import QuotePreview from "@/components/admin/quotes/QuotePreview";
import InvoiceFeesSettings from "@/pages/Admin/Settings/InvoiceFeesSettings";
import InvoiceSettings from "@/pages/Admin/Settings/InvoiceSettings";
import LineItemsSettings from "@/pages/Admin/Settings/LineItemsSettings";
import MessagingSettings from "@/pages/Admin/Settings/MessagingSettings";
import PricingMatrixSettings from "@/pages/Admin/Settings/PricingMatrixSettings";
import ProfileSettings from "@/pages/Admin/Settings/ProfileSettings";
import SettingsLayout from "@/pages/Admin/Settings/SettingsLayout";
import ShopSettings from "@/pages/Admin/Settings/ShopSettings";
import SocialLinksSettings from "@/pages/Admin/Settings/SocialLinksSettings";
import UsersSettings from "@/pages/Admin/Settings/UsersSettings";
import VendorsSettings from "@/pages/Admin/Settings/VendorsSettings";
import MockupBuilderPage from "@/pages/Admin/MockupBuilder/MockupBuilderPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "verify-code",
        element: <VerifyCode />,
      },

      {
        path: "admin",
        element: <ProtectedRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <Dashboard /> },
              { path: "dashboard", element: <Dashboard /> },
              { path: "quotes", element: <Quotes /> },
              { path: "quotes/new", element: <CreateQuote /> },
              { path: "quotes/preview", element: <QuotePreview /> },
              { path: "invoices", element: <Invoices /> },
              { path: "customers", element: <Customers /> },
              { path: "customers/new", element: <AddNewCustomer /> },
              { path: "job-board", element: <JobBoard /> },
              { path: "mockups", element: <MockupBuilderPage /> },
              // { path: "mockups", element: <Mockups /> },
              { path: "products", element: <Products /> },
              { path: "messages", element: <Messages /> },
              { path: "payment", element: <Payment /> },
              { path: "analytics", element: <Analytics /> },

              // Settings Routes
              {
                path: "settings",
                element: <SettingsLayout />,
                children: [
                  { index: true, element: <ProfileSettings /> },
                  { path: "profile", element: <ProfileSettings /> },
                  { path: "shop", element: <ShopSettings /> },
                  { path: "invoice", element: <InvoiceSettings /> },
                  { path: "line-items", element: <LineItemsSettings /> },
                  { path: "fees", element: <InvoiceFeesSettings /> },
                  { path: "pricing", element: <PricingMatrixSettings /> },
                  { path: "vendors", element: <VendorsSettings /> },
                  { path: "users", element: <UsersSettings /> },
                  { path: "social", element: <SocialLinksSettings /> },
                  { path: "messaging", element: <MessagingSettings /> },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
