import { useNavigate } from "react-router-dom";
import AvatarCnr from "../components/AvatarCnr";
import LoginButton from "../components/LoginButton";
import { FormEvent, useEffect } from "react";
import { useUserId } from "../../../../../core/state/UserContext";
import UserNameInput from "../../../../../core/components/UserNameInput";
import PasswordInput from "../../../../../core/components/PassWordInput";
import { useThme } from "../../../../../core/state/ThemeContext";
import { AuthDataSourceImpl } from "../../../data/dataSource/AuthAPIDataSource";
import { AuthRepositoryImpl } from "../../../data/repository/AuthRepositoryImpl";
import { LoginUseCase } from "../../../domain/UseCases/AuthUseCase";
import { useAuthViewModel } from "../../../viewmodel/AuthViewModel";

const dataSource = new AuthDataSourceImpl();
const repository = new AuthRepositoryImpl(dataSource);
const loginUseCase = new LoginUseCase(repository);

function LoginPage() {
  const { login, token, isSuccess, isPending, isError } =
    useAuthViewModel(loginUseCase);

  const navigate = useNavigate();
  const { toggleLightMode } = useThme();
  const { userName, SetUserName } = useUserId();
  const loginEvent = (event: FormEvent) => {
    event.preventDefault();
    login({ username: userName, password: "" });
    SetUserName(userName); // Set the user name when the form is submitted
    if (isSuccess) {
      localStorage.setItem("authToken", token as string);
      console.log("Login successful, token saved");
      navigate("home");
    }
  };

  useEffect(() => {
    toggleLightMode();
  });

  return (
    <>
      <div className="flex items-center bg-slate-200 justify-center min-h-screen">
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
          {isPending ? "Please wait..." : "Please wait..."}
          {isError ? "Error huppen..." : token}
        </form>
      </div>
    </>
  );
}

export default LoginPage;
