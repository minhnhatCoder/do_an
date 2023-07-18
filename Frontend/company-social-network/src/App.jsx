import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import RootRoute from "./route";

function App() {
  return (
    <div>
      <RootRoute />
      <ToastContainer />
    </div>
  );
}

export default App;
