import axios from "axios";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import useLoginModal from "../hooks/useLoginModal";
import useChangeAdressModal from "../hooks/useChangeAdressModal";
import { getSession, signIn, signOut, useSession } from "next-auth/react";

import Modal from "./Modal";
import Input from "./Input";
import Heading from "./Heading";
import Button from "./Button";

const ChangeAdressModal = () => {
  const changeAdressModal = useChangeAdressModal();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      shippingAdress: "",
      postalCode: "",
      phoneNumber : "",
      country : ""
    },
  });

  const { data: session } = useSession();
  const currentUser = session?.user;

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    getSession().then((session) => {
      if (session) {
        const currentUser = session.user;
        const email = currentUser?.email;
        console.log(email);
        axios
          .post("/api/changeAdress", { ...data, email })
          .then(() => {
            toast.success("Adresse modifiée !");
            changeAdressModal.onClose();
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
      <Heading
        title="Mettre à jour l'adresse"
        subtitle="Modifier l'adresse de livraison !"
      />
      <Input
        id="shippingAdress"
        label="Adresse de livraison"
        disabled={isLoading}
        register={register}
        errors={errors}
        watch={watch}
        required
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
        id="country"
        label="Pays"
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
          Ne souhaitez pas modifier ?
          <span
            onClick={changeAdressModal.onClose}
            className="
              text-neutral-800
              cursor-pointer 
              hover:underline
            "
          >
            {" "}
            Retourner en arrière
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={changeAdressModal.isOpen}
      title="Modifier l'adresse"
      actionLabel="Continuer"
      onClose={changeAdressModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default ChangeAdressModal;
