import Link from "next/link";
import { BsHeadset, BsHouse } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";

const BottomMenu = () => {
  return (
    <div className="w-full h-max bg-black py-4 flex flex-col lg:flex-row lg:items-start justify-center gap-8 mt-10 px-20 text-white">
      <div className="flex flex-col items-center justify-center space-y-2">
        <h1 className="text-xl">À PROPOS</h1>
        <div className="flex flex-col items-center justify-center text-sm space-y-1">
            <Link href={"/qui_sommes"}>Qui sommes nous?</Link>
            <Link href={"/notre_quality"}>Notre qualité</Link>
            <Link href={"/nos_magasin"}>Nos magasin</Link>
            <Link href={"/nos_grades"}>Nos magasin</Link>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center space-y-2">
      <h1 className="text-xl">BESOIN D'AIDE</h1>
      <div className="flex flex-col items-center justify-center text-sm space-y-1">
            <Link href={"/contactez"}>Contactez-nous</Link>
            <h3>Questions fréquente</h3>
            <Link href={"/livraison"}>Livrasion</Link>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center space-y-2">
      <h1 className="text-xl">DROITS LEGAUX</h1>
      <div className="flex flex-col items-center justify-center text-sm space-y-1">
    <h3>Conditions générale d'utilisation</h3>
    <h3>Conditions générale de vente</h3>
    <h3>Mentions légales</h3>
  </div>
</div>

      
      {/* <div className="flex flex-col items-center justify-center">
        <h1>Besoin d&apos;aide</h1>
        <Link href={"/faq"}>FAQ</Link>
      </div>
      <div className="flex flex-col items-center justify-center">
        <h1>A propos</h1>
        <Link href={"/cgv"}>CGV</Link>
        <Link href={"/mentions"}>Mentions legales</Link>
        <Link href={"/us"}>Qui sommes nous ?</Link>
      </div> */}
    </div>
  );
};

export default BottomMenu;
