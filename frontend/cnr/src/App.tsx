import { DarkModeProvider } from "./core/state/DarkModeContext";
import HomePage from "./feature/home/presentation/pages/Home";
// import LoginPage from "./feature/login/presentation/pages/Login";

function App() {
  return (
    <>
      {/* <LoginPage /> */}
      <DarkModeProvider>
        <HomePage />
      </DarkModeProvider>
    </>
  );
}

export default App;
