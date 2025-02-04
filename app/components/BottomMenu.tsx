import Link from "next/link";
import { BsHeadset, BsHouse } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";
import { Open_Sans } from 'next/font/google';
const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
});

const BottomMenu = () => {
  return (
    <div className=" w-full h-max bg-white py-4 flex flex-col  lg:flex-row lg:items-start justify-center gap-12 mt-10 px-20 text-black openSans.className">
      <div className="flex flex-col items-center justify-center space-y-2">
        <h1 className="text-xl text-center xl:text-2xl">À PROPOS</h1>
        <div className="flex flex-col items-center justify-center text-sm space-y-1 lg:text-md xl:text-lg">
            <Link className="text-center"  href={"/qui_sommes"}>Qui sommes nous?</Link>
            <Link className="text-center"  href={"/notre_quality"}>Notre qualité</Link>
            <Link className="text-center"  href={"/nos_magasin"}>Nos magasin</Link>
            <Link className="text-center"  href={"/nos_grades"}>Nos grades</Link>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center space-y-2">
      <h1 className="text-xl text-center xl:text-2xl">BESOIN D'AIDE</h1>
      <div className="flex flex-col items-center justify-center text-sm space-y-1 lg:text-md xl:text-lg">
            <Link className="text-center"  href={"/contactez"}>Contactez-nous</Link>
            <Link className="text-center" href={"/faq"}>Questions fréquente</Link>
            <Link className="text-center" href={"/livraison"}>Livrasion</Link>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center space-y-2">
      <h1 className="text-xl text-center xl:text-2xl">DROITS LEGAUX</h1>
      <div className="flex flex-col items-center justify-center text-sm space-y-1 lg:text-md xl:text-lg">
    <Link className="text-center"  href={""}>Conditions générale d'utilisation</Link>
    <Link className="text-center"  href={"/cgv"}>Conditions générale de vente</Link>
    <Link className="text-center" href={"/mentions"}>Mentions légales</Link>
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
