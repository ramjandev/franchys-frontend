import App from "@/App";
import Login from "@/pages/Login";

const AuthRoute = {
  path: "/",
  element: <App />,
  children: [{ index: true, element: <Login /> }],
};

export default AuthRoute;
