import Dashboard from "./Dashboard";
import Home from "./Home";
import OtherRoute from "./OtherRoute";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/other",
        element: <OtherRoute />,
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />
}

export default App;
