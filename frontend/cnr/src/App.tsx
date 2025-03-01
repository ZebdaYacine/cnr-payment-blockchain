import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/routes";
import { AuthProvider } from "./core/state/AuthContext";
import { ThemeProvider } from "./core/state/ThemeContext";
import { UserProvider } from "./core/state/UserContext";
import { FileProvider } from "./core/state/FileContext";
import { ChildProvider } from "./core/state/InstitutionContext";
import { PeerProvider } from "./core/state/PeerContext";
import { FolderProvider } from "./core/state/FolderContext";

function App() {
  return (
    <ChildProvider>
      <PeerProvider>
        <FolderProvider>
          <FileProvider>
            <AuthProvider>
              <ThemeProvider>
                <UserProvider>
                  <BrowserRouter>
                    <AppRouter />
                  </BrowserRouter>
                </UserProvider>
              </ThemeProvider>
            </AuthProvider>
          </FileProvider>
        </FolderProvider>
      </PeerProvider>
    </ChildProvider>
  );
}

export default App;
