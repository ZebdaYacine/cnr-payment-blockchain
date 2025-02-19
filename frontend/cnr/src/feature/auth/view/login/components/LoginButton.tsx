import { FormEvent } from "react";

export interface LoginButtonProps {
  loginEvent: (event: FormEvent) => void; // Function type for loginEvent
  name: string;
}
const LoginButton = (props: LoginButtonProps) => {
  return (
    <>
      <button className="btn btn-primary w-40" onClick={props.loginEvent}>
        {props.name}
      </button>
    </>
  );
};

export default LoginButton;
