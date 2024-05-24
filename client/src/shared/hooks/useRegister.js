import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register as registerRequest } from "../../api";
import toast from "react-hot-toast";

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();


  return {
    register,
    isLoading,
  };
};
