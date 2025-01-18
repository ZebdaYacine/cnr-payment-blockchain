import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/routes";
import { AuthProvider } from "./core/state/AuthContext";
import { ThemeProvider } from "./core/state/ThemeContext";
import { UserProvider } from "./core/state/UserContext";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <UserProvider>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </UserProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
