import { useNavigate } from "react-router-dom";
import { User } from "../../dtos/data";

interface Props {
  user: User;
}

export default function UserInfoButton({ user }: Props) {
  const navigate = useNavigate();

  return (
    <a
      className="btn btn-ghost text-lg sm:text-xl md:text-xl text-cyan-50"
      onClick={() => navigate("/home")}
    >
      {user.username} - {user.workAt} / {user.type}
    </a>
  );
}
