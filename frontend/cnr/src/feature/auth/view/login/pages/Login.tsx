import { useNavigate } from "react-router-dom";
import AvatarCnr from "../components/AvatarCnr";
import LoginButton from "../components/LoginButton";
import { FormEvent, useEffect, useRef } from "react";
import { useUserId } from "../../../../../core/state/UserContext";
import UserNameInput from "../../../../../core/components/UserNameInput";
import PasswordInput from "../../../../../core/components/PassWordInput";
import { useThme } from "../../../../../core/state/ThemeContext";
import { AuthDataSourceImpl } from "../../../data/dataSource/AuthAPIDataSource";
import { AuthRepositoryImpl } from "../../../data/repository/AuthRepositoryImpl";
import { LoginUseCase } from "../../../domain/UseCases/AuthUseCase";
import { useAuthViewModel } from "../../../viewmodel/AuthViewModel";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import { useAuth } from "../../../../../core/state/AuthContext";
import { useLogger } from "../../../../../services/useLogger";

const dataSource = new AuthDataSourceImpl();
const repository = new AuthRepositoryImpl(dataSource);
const loginUseCase = new LoginUseCase(repository);

function LoginPage() {
  const { login, isPending, isSuccess } = useAuthViewModel(loginUseCase);
  const navigate = useNavigate();
  const { toggleLightMode } = useThme();
  const { userName, SetUserName } = useUserId();
  const { isAuthentificated } = useAuth();
  const { info } = useLogger();
  useEffect(() => {
    info("USER IS AUTHENTIFICATED : " + isAuthentificated);
  }, [info, isAuthentificated]);

  const loginEvent = async (event: FormEvent) => {
    event.preventDefault();
    login({ username: userName, password: "admin" });

    if (isPending) {
      ref.current?.continuousStart();
    } else {
      ref.current?.complete();
      if (isSuccess) {
        if (isAuthentificated) {
          navigate("home");
        }
      }
    }
  };

  useEffect(() => {
    toggleLightMode();
  });

  const ref = useRef<LoadingBarRef>(null);

  return (
    <>
      <LoadingBar color="#f11946" ref={ref} shadow={true} />
      <div className="flex flex-col items-center bg-slate-200 justify-center min-h-screen">
        <form className="space-y-4 p-5 m-10  bg-slate-50 rounded shadow-md w-full max-w-screen-md">
          <AvatarCnr />
          <UserNameInput
            value={userName}
            onChange={(e) => SetUserName(e.target.value)}
          />
          <PasswordInput />
          <div className="flex justify-center">
            <LoginButton loginEvent={loginEvent} />
          </div>
        </form>
        <ToastContainer />
      </div>
    </>
  );
}

export default LoginPage;
