import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoBack = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(-1);
  }, [navigate]);

  return null;
};

export default GoBack;
