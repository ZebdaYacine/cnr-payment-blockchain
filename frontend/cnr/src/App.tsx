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

function App() {
  return (
    <VersionMetaDataProvider>
      <VersionProvider>
        <UsersListProvider>
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
        </UsersListProvider>
      </VersionProvider>
    </VersionMetaDataProvider>
  );
}

export default App;
