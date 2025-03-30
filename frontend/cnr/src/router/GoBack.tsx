import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoBack = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(-1); // Go to previous page
  }, [navigate]);

  return null;
};

export default GoBack;
