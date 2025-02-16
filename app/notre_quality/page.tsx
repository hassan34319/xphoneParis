import React from 'react';
import Image from 'next/image';

function ProductPage() {
  return (
    <div className="flex flex-col items-center w-full max-w-8xl mx-auto bg-white ">
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

      {/* Main Title */}
      <h2 className="flex justify-center text-2xl sm:text-3xl md:text-4xl font-bold mb-4  sm:mb-6">Notre Qualité</h2>

      {/* Initial Description */}
      <div className="text-center mb-8 text-xl sm:text-2xl md:text-3xl  sm:mb-8 max-w-5xl">
        <p className="mb-4">
          Nous <span className="text-red-500">vendons</span> exclusivement des appareils d'origine, jamais{' '}
          <span className="text-blue-500">modifiés</span>,{' '}
          <span className="text-green-500">ouverts</span> ou{' '}
          <span className="text-orange-500">altérés</span> de quelque manière que ce soit.
        </p>
        <p className="mb-4">
          Cela garantit une durée de vie plus longue et une{' '}
          <span className="text-purple-500">fiabilité supérieure</span>.
        </p>
      </div>

      {/* Product Comparisons */}
      <div className="w-full space-y-8 mb-12 ">
        {/* Damaged Phone */}
        <div className="flex flex-col items-center">
          <div className="rounded-2xl overflow-hidden mb-2 w-48 sm:w-72 md:w-96 lg:w-144 h-auto">
            <img
              src="/OPTEZ-POUR-L-ORIGINAL-45.jpg"
              alt="Broken phone"
              className="w-full h-full"
            />
          </div>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl italic max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg text-red-500 text-center">produit reconditionné moins résistant</p>
        </div>

        {/* New Phone */}
        <div className="flex flex-col items-center">
          <div className="rounded-2xl overflow-hidden mb-2 w-48 sm:w-72 md:w-96 lg:w-144  h-auto">
            <img
              src="/OPTEZ-POUR-L-ORIGINAL-47.jpg"
              alt="New phone"
              className="w-full h-full"
            />
          </div>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl italic max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg text-green-500 text-center">produit d'origine plus résistant</p>
        </div>

        {/* Wedding Photos Comparison */}
        <div className="flex flex-col items-center">
          <div className="rounded-2xl overflow-hidden mb-2 w-48 sm:w-72 md:w-96 lg:w-144 h-auto">
            <img
              src="/OPTEZ-POUR-L-ORIGINAL-48.jpg"
              alt="Wedding photo"
              className="w-full h-full"
            />
          </div>
          <p className= "text-lg sm:text-xl md:text-2xl lg:text-3xl italic max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg text-red-500 text-center">
            Photo prise avec un téléphone reconditionné moins précis et moins détaillé
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="rounded-2xl overflow-hidden mb-2 w-48 sm:w-72 md:w-96 lg:w-144 h-auto">
            <img
              src="/OPTEZ-POUR-L-ORIGINAL-49.jpg"
              alt="Wedding photo with original phone"
              className="w-full h-full"
            />
          </div>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl italic max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg text-green-500 text-center">
            Photo prise avec un téléphone d'origine : plus net et détaillé
          </p>
        </div>

        {/* Battery Section */}
        <div className="flex flex-col items-center">
          <div className="rounded-2xl overflow-hidden mb-2 w-48 sm:w-72 md:w-96 lg:w-144 h-auto bg-black">
            <img
              src="/OPTEZ-POUR-L-ORIGINAL-51.jpg"
              alt="Low battery"
              className="w-full h-full"
            />
          </div>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl italic max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg text-red-500 text-center">
            Produit reconditionné : duré de vie de la batterie réduite
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="rounded-2xl overflow-hidden mb-2 w-48 sm:w-72 md:w-96 lg:w-144 h-auto bg-black">
            <img
              src="/OPTEZ-POUR-L-ORIGINAL-52.jpg"
              alt="Full battery"
              className="w-full h-full "
            />
          </div>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl italic max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg text-green-500 text-center">
            Produit d'origine : Longévité de la batterie augmenté
          </p>
        </div>
      </div>

      {/* Final Quality Message */}
      <div className="text-center text-xl sm:text-2xl md:text-3xl mb-12 max-w-5xl">
        <p>
          En <span className="text-purple-500">sélectionnant</span> nos{' '}
          <span className="text-blue-500">produits</span>, vous optez pour une{' '}
          <span className="text-pink-500">qualité irréprochable</span> et des{' '}
          <span className="text-blue-500">performances durables</span>, garantissant une{' '}
          <span className="text-purple-500">expérience optimale</span> et une{' '}
          <span className="text-orange-500">tranquillité d'esprit</span> à{' '}
          <span className="text-green-500">long terme</span>.
        </p>
      </div>

      <div className="flex flex-col items-center">
          <div className="rounded-2xl overflow-hidden mb-14 w-48 sm:w-72 md:w-96 lg:w-144 h-auto bg-black">
            <img
              src="/OPTEZ-POUR-L-ORIGINAL-53.jpg"
              alt="Full battery"
              className="w-full h-full "
            />
          </div>
          
      </div>

      {/* iPhone Section */}
      <div className="max-w-[350px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] space-y-8 mb-12">
        {/* iPhone 8 Collection */}
        <div className="flex flex-col items-center">
          <div className="rounded-2xl overflow-hidden mb-2 w-full h-auto">
            <img
              src="/OPTEZ-POUR-L-ORIGINAL-56.jpg"
              alt="iPhone 8 collection"
              className="w-full h-full"
            />
          </div>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl italic text-center">
            Iphone 8 dans tous les coloris disponible dans nos magasin ou via notre site internet
          </p>
        </div>

        {/* iPhone 14 Collection */}
        <div className="flex flex-col items-center">
          <div className="rounded-2xl overflow-hidden mb-2 w-full h-auto">
            <img
              src="/OPTEZ-POUR-L-ORIGINAL-57.jpg"
              alt="iPhone 14 collection"
              className="w-full h-full"
            />
          </div>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl italic text-center">
            Lots d'iPhone 14 comme neuf provenant de notre partenaire SFR Trade
          </p>
        </div>

        {/* Original Phones */}
        <div className="flex flex-col items-center">
          <div className="rounded-2xl overflow-hidden mb-2 w-full h-auto">
            <img
              src="/OPTEZ-POUR-L-ORIGINAL-58.jpg"
              alt="Original phones"
              className="w-full h-full"
            />
          </div>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl italic text-center">
            Des téléphones d'origine pour une espérance de vie maximale
          </p>
        </div>
      </div>

      {/* MacBook Section */}
      <div className="max-w-[350px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] space-y-8 mb-12">
        <div className="flex flex-col items-center">
          <div className="rounded-2xl overflow-hidden mb-2 w-full h-auto">
            <img
              src="/OPTEZ-POUR-L-ORIGINAL-60.jpg"
              alt="MacBook stack"
              className="w-full h-full"
            />
          </div>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl italic text-center">
            Faites votre choix parmi notre sélection de MacBook disponibles dans diverses tailles
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="rounded-2xl overflow-hidden mb-2 w-full h-auto">
            <img
              src="/OPTEZ-POUR-L-ORIGINAL-61.jpg"
              alt="MacBook display"
              className="w-full h-full"
            />
          </div>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl italic text-center">
            Macbook disponibles en plusieurs coloris en magasin ou sur notre site internet
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="rounded-2xl overflow-hidden mb-2 w-full h-auto">
            <img
              src="/OPTEZ-POUR-L-ORIGINAL-62.jpg"
              alt="MacBook comparison"
              className="w-full h-full"
            />
          </div>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl italic text-center">
            Fluide et rapide pour vos divertissements préférés
          </p>
        </div>
      </div>

      {/* iPad Section */}
      <div className="max-w-[350px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] space-y-8 mb-12">
        <div className="flex flex-col items-center">
          <div className="rounded-2xl overflow-hidden mb-2 w-full h-auto">
            <img
              src="/OPTEZ-POUR-L-ORIGINAL-63.jpg"
              alt="iPad collection"
              className="w-full h-full"
            />
          </div>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl italic text-center">
            Stocks disponible années 2011 à 2020 plusieurs coloris dans nos magasin ou via notre site internet
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="rounded-2xl overflow-hidden mb-2 w-full h-auto">
            <img
              src="/OPTEZ-POUR-L-ORIGINAL-65.jpg"
              alt="iPad collection 2"
              className="w-full h-full"
            />
          </div>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl italic text-center">
            Lots d'iPad provenant de notre partenaire Apple Trading
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="rounded-2xl overflow-hidden mb-2 w-full h-auto">
            <img
              src="/OPTEZ-POUR-L-ORIGINAL-66.jpg"
              alt="Latest iPad generations"
              className="w-full h-full"
            />
          </div>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl italic text-center">
            Lots d'iPad de dernière générations
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="rounded-2xl overflow-hidden mb-2 w-full h-auto">
            <img
              src="/OPTEZ-POUR-L-ORIGINAL-69.jpg"
              alt="iPad sizes"
              className="w-full h-full"
            />
          </div>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl italic text-center">
            Des iPads de diverses tailles pour trouver votre bonheur
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="rounded-2xl overflow-hidden mb-2 w-full h-auto">
            <img
              src="/OPTEZ-POUR-L-ORIGINAL-70.jpg"
              alt="iPad sizes"
              className="w-full h-full"
            />
          </div>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl italic text-center">
            Disponible en magasin ou sur notre site internet
          </p>
        </div>
      </div>

      

      {/* Mascot */}
      <div className="mb-14 w-48 sm:w-72 md:w-96 lg:w-144 h-auto">
        <img
          src="/OPTEZ-POUR-L-ORIGINAL-71.jpg"
          alt="XPhones mascot"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}

export default ProductPage;