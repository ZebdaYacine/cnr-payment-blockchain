import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/routes";
import { AuthProvider } from "./core/state/AuthContext";
import { ThemeProvider } from "./core/state/ThemeContext";
import { UserProvider } from "./core/state/UserContext";
import { FileProvider } from "./core/state/FileContext";
import { ChildProvider } from "./core/state/InstitutionContext";
import { PeerProvider } from "./core/state/PeerContext";
import { FolderProvider } from "./core/state/FolderContext";
import { UsersListProvider } from "./core/state/ListOfUsersContext";
import { VersionProvider } from "./core/state/versionContext";
import { VersionMetaDataProvider } from "./core/state/versionMetaDataContext";
import { NotificationProvider } from "./core/state/NotificationContext";
import { PhaseProvider } from "./core/state/PhaseContext";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <UserProvider>
            <PhaseProvider>
              <NotificationProvider>
                <VersionMetaDataProvider>
                  <VersionProvider>
                    <UsersListProvider>
                      <ChildProvider>
                        <PeerProvider>
                          <FolderProvider>
                            <FileProvider>
                              <AppRouter />
                            </FileProvider>
                          </FolderProvider>
                        </PeerProvider>
                      </ChildProvider>
                    </UsersListProvider>
                  </VersionProvider>
                </VersionMetaDataProvider>
              </NotificationProvider>
            </PhaseProvider>
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
