import PasswordInput from "../../../../core/components/PassWordInput";
import UserNameInput from "../../../../core/components/UserNameInput";
import AvatarCnr from "../components/AvatarCnr";
import LoginButton from "../components/LoginButton";
function LoginPage() {
  return (
    <>
      <div className="flex items-center bg-slate-200 justify-center min-h-screen">
        <form className="space-y-4 p-5 m-10  bg-slate-50 rounded shadow-md w-full max-w-screen-md">
          <AvatarCnr />
          <UserNameInput />
          <PasswordInput />
          <div className="flex justify-center">
            <LoginButton />
          </div>
        </form>
      </div>
    </>
  );
}

export default LoginPage;
