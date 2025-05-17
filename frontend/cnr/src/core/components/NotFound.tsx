import React from "react";
import { useNavigate } from "react-router-dom";
import notfound from "../../assets/404.png";
const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-base-100 text-center px-4">
      <img src={notfound} className="avatar" />
      <button
        onClick={() => navigate("/")}
        className="btn btn-primary btn-wide"
      >
        ⬅️ Back to Home
      </button>
    </div>
  );
};

export default NotFound;
