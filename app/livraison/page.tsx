import { sanityClient } from "../../lib/sanityClient";
import Image from 'next/image';
import { urlFor } from '../../lib/sanityClient';
import React from 'react';

const DeliveryInfoPage = () => {
  return (
    <div className="w-full max-w-8xl mx-auto  space-y-8 bg-white">
      {/* Logo and Rating Section */}
      <div className="w-full mb-4">
        <div className="relative w-full h-16 sm:h-28 md:h-36">
          <Image 
            src="/logo111.jpg"
            alt="XPhones Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
       
      </div>
      {/* Livraison Section */}
      <div className="space-y-6">
        <h2 className="flex justify-center text-2xl sm:text-3xl md:text-4xl font-bold mb-4  sm:mb-6">LIVRAISON</h2>
        <div className="relative w-full aspect-square mx-auto  overflow-hidden max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px]">
          <img 
            src="/OPTEZ-POUR-L-ORIGINAL-84.jpg"
            alt="UPS Delivery"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Question Section */}
      <div className="space-y-6">
        <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-center">Dans quels pays faites vous les livraisons ?</h3>
        <div className="relative w-full aspect-square mx-auto  overflow-hidden max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px]">
          <img 
            src="/OPTEZ-POUR-L-ORIGINAL-85.jpg"
            alt="Delivery Countries"
            className="w-full h-full "
          />
        </div>
        <p className="text-center text-lg sm:text-xl md:text-2xl lg:text-3xl max-w-4xl mx-auto">
          Nous assurons la livraison dans l'union européenne. Chaque colis est soigneusement emballé pour garantir son intégrité lors de la livraison. Votre satisfaction reste notre priorité essentielle
        </p>
      </div>

      {/* Delivery Times Section */}
      <div className="space-y-6">
        <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-center">Quels sont les délais de livraison chez Xphones ?</h3>
        <div className="relative w-full aspect-square mx-auto  overflow-hidden max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px]">
          <img 
            src="/OPTEZ-POUR-L-ORIGINAL-87.jpg"
            alt="Delivery Times"
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-center text-lg sm:text-xl md:text-2xl lg:text-3xl max-w-4xl mx-auto">
          Nous avons choisi UPS pour assurer une livraison rapide et sécurisée en 24 à 48 heures. Chaque colis est expédié contre signature et dispose d'un numéro de suivi en temps réel. Après avoir testé plusieurs transporteurs, UPS s'est révélé être le plus fiable, avec quasiment jamais de retard ni de perte.
        </p>
      </div>

      {/* Preparation Times Section */}
      <div className="space-y-6">
        <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-center">Quels sont les délais de préparation chez Xphones ?</h3>
        <div className="relative w-full aspect-square mx-auto  overflow-hidden max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px]">
          <img 
            src="/OPTEZ-POUR-L-ORIGINAL-88.jpg"
            alt="Preparation Times"
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-center text-lg sm:text-xl md:text-2xl lg:text-3xl max-w-4xl mx-auto ">
          Le délai de préparation est de 24 à 48 heures afin de garantir un contrôle qualité rigoureux. Chaque smartphone est testé, nettoyé et soigneusement emballé pour respecter les normes XPHONES. Ce processus assure un appareil prêt à l'emploi dès réception.
        <br />
        <br />
        <br />
        </p>
      </div>
    </div>
  );
};

export default DeliveryInfoPage;