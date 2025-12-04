import { UNAUTHORIZED_STATUS_NUMBERS } from "@/core/config/constante";
import type { ErrorApiResponse } from "@/core/lib/api-type";
import { AxiosError } from "axios";
import { toast } from "sonner";


export const refractHttpError = (error: unknown): ErrorApiResponse => {
  let title = "ERROR";
  let message = "Une erreur est survenue. Si elle persiste, contactez le support";

  if (error instanceof AxiosError) {
    if (error.response?.data?.message) {
      message = error.response?.data?.message;
    }
    if ((error.response?.data?.error as string).includes("Invalid username or password")) {
      message = "Email ou mot de passe incorrect";
    }
   
    if (UNAUTHORIZED_STATUS_NUMBERS.includes(error.status || 0)) {
      title = "AUTHENTIFICATION";
      message = "Vous n'êtes pas connecté. Veuillez vous connecter";
    }

    if (error.status === 404) {
      title = "COMPTE INTROUVABLE";
      message = "Ce compte n'existe pas. Veuillez vérifier vos identifiants";
    }
  }

  const isProduction = import.meta.env.NODE_ENV === "production";

  if (!isProduction) {
    console.error(title, message, error);
  }

  toast.error(title, {
    description: message,
  });

  return {
    success: false,
    message,
    data: null,
  };
};
