import axios from "axios";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import useLoginModal from "../hooks/useLoginModal";
import useChangePasswordModal from "../hooks/useChangePasswordModal";
import { getSession, signIn, signOut, useSession } from "next-auth/react";

import Modal from "./Modal";
import Input from "./Input";
import Heading from "./Heading";
import Button from "./Button";

const ChangePasswordModal = () => {
  const changePasswordModal = useChangePasswordModal();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { data: session } = useSession();
  const currentUser = session?.user;

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    getSession().then((session) => {
      if (session) {
        const currentUser = session.user;
        const email = currentUser?.email
        console.log(email)
        axios
          .post("/api/changePassword", { ...data, email })
          .then(() => {
            toast.success("Mot de passe modifié avec succès !");
            changePasswordModal.onClose();
            reset();
          })
          .catch((error) => {
            toast.error(error.response.data.error);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    });
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Changer le mot de passe" subtitle="Mettez à jour votre mot de passe !" />
      <Input
        id="password"
        label="Nouveau mot de passe"
        type="text"
        disabled={isLoading}
        register={register}
        errors={errors}
        watch={watch}
        required
      />
      <Input
        id="confirmPassword"
        label="Confirmer le mot de passe"
        type="text"
        disabled={isLoading}
        register={register}
        errors={errors}
        watch={watch}
        required
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <div
        className="
          text-neutral-500 
          text-center 
          mt-4 
          font-light
        "
      >
        <p>
          Pas prêt à changer ?
          <span
            onClick={changePasswordModal.onClose}
            className="
              text-neutral-800
              cursor-pointer 
              hover:underline
            "
          >
            {" "}
            Retour
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={changePasswordModal.isOpen}
      title="Changer le mot de passe"
      actionLabel="Continuer"
      onClose={changePasswordModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default ChangePasswordModal;