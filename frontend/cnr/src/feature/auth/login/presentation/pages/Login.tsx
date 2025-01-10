import { useNavigate } from "react-router-dom";
import AvatarCnr from "../components/AvatarCnr";
import LoginButton from "../components/LoginButton";
import { FormEvent, useEffect } from "react";
import { useUserId } from "../../../../../core/state/UserContext";
import UserNameInput from "../../../../../core/components/UserNameInput";
import PasswordInput from "../../../../../core/components/PassWordInput";
import { useThme } from "../../../../../core/state/ThemeContext";
function LoginPage() {
  const navigate = useNavigate();

  const { toggleLightMode } = useThme();
  const { userName, SetUserName } = useUserId();

  const loginEvent = (event: FormEvent) => {
    event.preventDefault();
    SetUserName(userName); // Set the user name when the form is submitted
    navigate("home");
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
        </form>
      </div>
    </>
  );
}

export default LoginPage;
