import { BsPersonFill } from "react-icons/bs";
interface UserNameInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function UserNameInput({ value, onChange }: UserNameInputProps) {
  return (
    <>
      <label className="input input-bordered flex items-center gap-2">
        <BsPersonFill className="h-5 w-5" />
        <input
          value={value}
          onChange={onChange}
          type="text"
          className="grow"
          placeholder="Username"
        />
      </label>
    </>
  );
}

export default UserNameInput;
