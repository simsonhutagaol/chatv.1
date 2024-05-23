import { RouterProvider } from "react-router-dom";
import router from "../src/routers/index";
import { MessageProvider } from "./contexts/MessageContext";

function App() {
  return (
    <MessageProvider>
      <RouterProvider router={router} />
    </MessageProvider>
  );
}

export default App;
