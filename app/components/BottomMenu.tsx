import Link from "next/link";
import { BsHeadset, BsHouse } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";

const BottomMenu = () => {
  return (
    <div className="w-full bg-black py-4 flex flex-col lg:flex-row lg:items-start justify-center gap-8 mt-10 px-20 text-white">
      <div className="flex flex-col items-center justify-center">
        <h1>Service client</h1>
        <div>
          <div>
            <div className="flex flex-row gap-2 items-center">
              <BsHouse />
              <h2>Xphones Store</h2>
            </div>
            <h1>86 Quai de Jemmapes</h1>
            <h1>75010 Paris</h1>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <BsHeadset />
            <h2>01 42 77 13 63</h2>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <AiOutlineMail />
            <h2>contact@xphones.fr</h2>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <h1>Besoin d&apos;aide</h1>
        <Link href={"/faq"}>FAQ</Link>
      </div>
      <div className="flex flex-col items-center justify-center">
        <h1>A propos</h1>
        <Link href={"/cgv"}>CGV</Link>
        <Link href={"/mentions"}>Mentions legales</Link>
        <Link href={"/us"}>Qui sommes nous ?</Link>
      </div>
    </div>
  );
};

export default BottomMenu;
