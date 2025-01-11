import { FormEvent } from "react";

interface LoginButtonProps {
  loginEvent: (event: FormEvent) => void; // Function type for loginEvent
}
const LoginButton = (props: LoginButtonProps) => {
  return (
    <>
      <button className="btn btn-primary w-40" onClick={props.loginEvent}>
        Login
      </button>
    </>
  );
};

export default LoginButton;
