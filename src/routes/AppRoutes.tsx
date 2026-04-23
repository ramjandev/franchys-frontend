import { createBrowserRouter } from "react-router-dom";
import AdminRoute from "./AdminRoute";
import AuthRoute from "./AuthRoute";
import ClientRoute from "./ClientRoute";
import EmployeeRoute from "./EmployeeRoute";
const router = createBrowserRouter([
  AdminRoute,
  EmployeeRoute,
  ClientRoute,

  AuthRoute,
]);

export default router;
