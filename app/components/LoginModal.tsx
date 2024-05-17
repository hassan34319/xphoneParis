"use client";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import { redirect, useRouter } from "next/navigation";

import useRegisterModal from "../../hooks/useRegisterModal";
import useLoginModal from "../../hooks/useLoginModal";

import Modal from "./Modal";
import Input from "./Input";
import Heading from "./Heading";
import Button from "./Button";
import { watch } from "fs";
import { NavbarProps } from "../utils/types";

const LoginModal: React.FC<NavbarProps> = ({}) => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    signIn("credentials", {
      ...data,
      redirect: false,
    }).then(async (callback) => {
      setIsLoading(false);

      if (callback?.error) {
        return toast.error(callback.error);
      }

      if (callback?.ok && !callback.error) {
        router.push('/user')
        toast.success("Connecté");
        router.refresh();
        loginModal.onClose();
      }

    });
  };

  const onToggle = useCallback(() => {
    loginModal.onClose();
    registerModal.onOpen();
  }, [loginModal, registerModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Bienvenue chez Xphones"
        subtitle="Connectez-vous à votre compte !"
      />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        watch={watch}
        required
      />
      <Input
        id="password"
        label="Mot de passe"
        type="text"
        disabled={isLoading}
        watch={watch}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <div
        className="
      text-neutral-500 text-center mt-4 font-light"
      >
        <p>
          Première utilisation de Xphones ?
          <span
            onClick={onToggle}
            className="
              text-neutral-800
              cursor-pointer 
              hover:underline
            "
          >
            {" "}
            Créez un compte
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="Connexion"
      actionLabel="Continuer"
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default LoginModal;
