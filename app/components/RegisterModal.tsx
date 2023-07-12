'use client'
import axios from "axios";
import { signIn } from "next-auth/react";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import useLoginModal from "../../hooks/useLoginModal";
import useRegisterModal from "../../hooks/useRegisterModal";

import Modal from "./Modal";
import Input from "./Input";
import Heading from "./Heading";
import Button from "./Button";
import { NavbarProps } from "../utils/types";

const RegisterModal :  React.FC<NavbarProps> = ({
})  => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<FieldValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      shippingAdress: "",
      postalCode: "",
      country: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios
    .post("/api/register", data)
    .then((response) => {
      const userExists = response.data && response.data.exists;
      if (userExists) {
        toast.error("E-mail déjà enregistré");
        registerModal.onClose();
        loginModal.onOpen();
      } else {
        toast.success("Inscrit !");
        registerModal.onClose();
        loginModal.onOpen();
        reset();
      }
    })
    .catch((error) => {
      toast.error(error.message);
    })
    .finally(() => {
      setIsLoading(false);
      });
  };

  const onToggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [registerModal, loginModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Bienvenue sur Xphones" subtitle="Créez un compte !" />
      <Input
        id="email"
        label="Email"
        type="email"
        disabled={isLoading}
        register={register}
        errors={errors}
        watch={watch}
        required
      />
      <Input
        id="firstName"
        label="Prénom"
        disabled={isLoading}
        register={register}
        errors={errors}
        watch={watch}
        required
      />
      <Input
        id="lastName"
        label="Nom de famille"
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
        register={register}
        errors={errors}
        watch={watch}
        required
      />
      <Input
        id="confirmPassword"
        label="Confirmez le mot de passe"
        type="text"
        disabled={isLoading}
        register={register}
        errors={errors}
        watch={watch}
        required
      />
      <Input
        id="phoneNumber"
        label="Numéro de téléphone"
        type="number"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        watch={watch}
      />
      <Input
        id="shippingAdress"
        label="Adresse de livraison"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        watch={watch}
      />
      <Input
        id="postalCode"
        label="Code postal"
        disabled={isLoading}
        register={register}
        errors={errors}
        watch={watch}
        required
      />
      <Input
        id="city"
        label="Ville"
        disabled={isLoading}
        register={register}
        errors={errors}
        watch={watch}
        required
      />
      <Input
        id="country"
        label="Pays"
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
          Déjà un compte ?
          <span
            onClick={onToggle}
            className="
              text-neutral-800
              cursor-pointer 
              hover:underline
            "
          >
            {" "}
            Connectez-vous
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Inscription"
      actionLabel="Continuer"
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModal;
