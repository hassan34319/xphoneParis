import { useState } from "react";
import { uuid } from "uuidv4";
import { useStateContext } from "../../context/stateContext";

// https://paymentpage.axepta.bnpparibas/paymentPage.aspx?MerchantID=ct_salesdemo&Data=3791360369340bcf71f3cd470e3ee5678187cd277ce6601480152d2013c2c6c1ffcbe30b661a75abcc36a735ed89d25dbc18ef870cbd77b17d81e6a25445ebdfb6856ef84c1bd8ba7a92ac7693b340d6b64ac8b3fcddbe6020e43be3d20d04e5cf97312db5defe5434d00676c704accfd75797d864e4e965743f63799d5c98f572426d70d1f4a6fa61a1b5d5e3c7e0f2a8f39ee384a77eb433c09666779cad61b7ced63dd42fbb5b9ea9941f88d07e3e2aca5d6b4034c314aaaee707015230447c2a6690a5594df5ff44b172f976146582573b5d831677904eea921e20c76d90db30f546a7280815b83da58ab9a7e5568e015b7611753594b9ffba6bd77538dba62f03d1f9597bee4eea921e20c76d90db30f546a728081500e6c888d5c0398e7259fc3942ae5e2b9868c0b7bae7758137014f9f259e076eba8ad2743e5b02acbe1fab198a65245c11390ebc0b6ce8be0da9f3bd48fe3a309ff150e050d5c91ce548de3c7cbae0c321c746892397f554113c06223676259b3300ad01e268cf37f746983b1f1b7692f01f7dfd2909f64c49b84f4d7beaeabfa7260650c6ce4ba8e1417a13f12c49ef592fff413358cbc0a736497735d6f8020751f1aad40feff2c44b71247bdad8af2e802b29d14ab04ec004950fdd40c413a5a52ae8a2a3fa48f5ad1cc0313ddbb7&Len=484&Template=PaymentPageDropDown_BNP_v1&Language=en&CCTemplate=Cards_BNP_v1&SDDTemplate=DirectDebit_BNP_v1&URLBack=https%3A%2F%2Fwww.yourshop.info%2F&CustomField1=12%2C34+EUR&CustomField2=Order+Text&CustomField3=https%3A%2F%2Fwww.paytest.org%2FMerchantLogo.png&CustomField4=1+x+Shoes%2C+green%7C1+x+Shoes%2C+blue%7C1+x+Shoes%2C+black&CustomField5=Company+Ltd.%7CJohn+Smith%7CSchwarzenberstra%C3%9Fe+2-4%7C96050+Bamberg&CustomField6=Company+Ltd.%7CJohn+Smith%7CSchwarzenberstra%C3%9Fe+2-4%7C96050+Bamberg&CustomField7=RG-Inv+123-2021&CustomField8=Some+Label&CustomField9=Some+Text&PayType=0
type Props = {
  setOpenForm: (formOpen: boolean) => void;
};

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  addressLine1?: string;
}

export default function MyForm({ setOpenForm }: Props) {
  const { cartItems, totalPrice } = useStateContext();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [addressLine3, setAddressLine3] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const handleFormSubmit = async () => {
    function getFullItem(item: any) {
      return [item.name, item.color].join(" ") + " × " + item.quantity + "|";
    }
    const items = cartItems.map(getFullItem);
    const unique_id = uuid().slice(0, 6)
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/api/payment";
    const params: Record<string, string> = {
      unique_id,
      Amount: totalPrice,
      items,
      CustomField1: totalPrice + "EUR",
      CustomField2: "Xphones",
      CustomField3:
        "https://cdn.shopify.com/s/files/1/0061/7929/1200/files/ephones_250x.png?v=1638106517",
      CustomField4: items,
      CustomField5: `${fullName}|${email}|${phone}|`,
      CustomField6: `${fullName}|${addressLine1}|${addressLine2}|${addressLine3}`,
      CustomField7: `TR-${unique_id}`,
      PayType: "0",
    };

    for (const key in params) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = params[key];
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields
    const validationErrors: FormErrors = {};
    if (fullName.trim() === "") {
      validationErrors.fullName = "Full Name is required";
    }
    if (email.trim() === "") {
      validationErrors.email = "Email Address is required";
    } else if (!isValidEmail(email)) {
      validationErrors.email = "Invalid Email Address";
    }
    if (phone.trim() === "") {
      validationErrors.phone = "Phone Number is required";
    }
    if (addressLine1.trim() === "") {
      validationErrors.addressLine1 = "Address Line 1 is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Submit form
    // ...
  };

  const isValidEmail = (email: string) => {
    // Basic email validation regex
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-10">
      <div className="mb-4">
        <label htmlFor="fullName" className="block mb-1">
          Nom complet :
        </label>
        <input
          type="text"
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={`w-full px-3 py-2 border rounded ${
            errors.fullName ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.fullName && (
          <span className="text-red-500">{errors.fullName}</span>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block mb-1">
          Adresse e-mail:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full px-3 py-2 border rounded ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.email && <span className="text-red-500">{errors.email}</span>}
      </div>

      <div className="mb-4">
        <label htmlFor="phone" className="block mb-1">
          Numéro de téléphone:
        </label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={`w-full px-3 py-2 border rounded ${
            errors.phone ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.phone && <span className="text-red-500">{errors.phone}</span>}
      </div>

      <div className="mb-4">
        <label htmlFor="addressLine1" className="block mb-1">
          Adresse ligne 1:
        </label>
        <input
          type="text"
          id="addressLine1"
          value={addressLine1}
          onChange={(e) => setAddressLine1(e.target.value)}
          className={`w-full px-3 py-2 border rounded ${
            errors.addressLine1 ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.addressLine1 && (
          <span className="text-red-500">{errors.addressLine1}</span>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="addressLine2" className="block mb-1">
          Adresse ligne 2
        </label>
        <input
          type="text"
          id="addressLine2"
          value={addressLine2}
          onChange={(e) => setAddressLine2(e.target.value)}
          className="w-full px-3 py-2 border rounded border-gray-300"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="addressLine3" className="block mb-1">
          Adresse ligne 3
        </label>
        <input
          type="text"
          id="addressLine3"
          value={addressLine3}
          onChange={(e) => setAddressLine3(e.target.value)}
          className="w-full px-3 py-2 border rounded border-gray-300"
        />
      </div>

      <button
        onClick={() => setOpenForm(false)}
        className="text-xl text-center px-4 py-2 text-white bg-red-900 rounded w-[40%] mt-8 mx-8"
      >
        Retourner
      </button>
      <button
        onClick={handleFormSubmit}
        className="text-xl text-center px-4 py-2 text-white bg-black rounded w-[40%] mt-8"
      >
        Payer
      </button>
    </form>
  );
}
