import { Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "../core/state/ThemeContext";
import HomePage from "../feature/profile/home/presentation/pages/Home";
import { Route } from "react-router";
import { UserProvider } from "../core/state/UserContext";
import LoginPage from "../feature/auth/login/presentation/pages/Login";

function AppRouter() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <UserProvider>
          <Routes>
            <Route index element={<LoginPage />} />
            <Route path="home" element={<HomePage />} />
          </Routes>
        </UserProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default AppRouter;
