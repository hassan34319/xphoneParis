import { sanityClient } from "../../lib/sanityClient";
import Image from 'next/image';
import { urlFor } from '../../lib/sanityClient';

interface QuiSommes {
  logo: any;
  heroVideo: {
    asset: {
      url: string;
    };
  };
  threeFeatureImages: any[];
  frenchProductsSection: {
    girlImage: any;
    stopImage: any;
    coqImage: any;
    phoneImage: any;
  };
  marketplaceImages: any[];
  storeImages: any[];
}

async function QuiSommes() {
  const query = `*[_type == "quiSommes"][0]{
    logo,
    "heroVideo": heroVideo{
      asset->{
        url
      }
    },
    threeFeatureImages,
    frenchProductsSection{
      girlImage,
      stopImage,
      coqImage,
      phoneImage
    },
    marketplaceImages,
    storeImages
  }`;
  const mediaData: QuiSommes = await sanityClient.fetch(query);

  return (
    <div className="flex flex-col items-center w-full max-w-8xl mx-auto px-4 bg-white">
      {/* Logo with Rating */}
      <div className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] mb-4 sm:mb-8">
        <Image 
          src={urlFor(mediaData.logo).url()}
          alt="XPhones Logo with 4.2 Rating"
          width={600}
          height={150}
          className="w-full h-auto"
        />
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 sm:mb-10">Qui sommes nous ?</h1>

      {/* Office Video */}
      <div className="w-full max-w-[400px] sm:max-w-[600px] md:max-w-[800px] mb-6 sm:mb-10">
        <video
          muted
          loop
          playsInline
          controls={true}
          poster="/thumbnail.png"
          className="w-full h-auto rounded-lg"
        >
          <source src="/video1.mp4" type="video/mp4" />
        </video>
      </div>

      {/* First Text Block */}
      <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-center mb-6 sm:mb-10 max-w-6xl">
        <span className="text-red-600">Xphones</span> s'est imposé comme l'unique maison capable de fournir exclusivement des{' '}
        <span className="text-green-500">appareils d'origine</span> à des{' '}
        <span className="text-green-500">prix inférieurs</span> aux reconditionnés. Fort de notre{' '}
        <span className="text-blue-600">expérience</span> et de notre{' '}
        <span className="text-purple-600">proximité</span> avec les clients, nous avons constaté que la majorité d'entre eux,{' '}
        <span className="text-blue-600">déçus par des appareils reconditionnés</span>, souvent de{' '}
        <span className="text-red-600">provenance chinoise</span>, recherchaient une{' '}
        <span className="text-green-500">alternative authentique et durable</span>.
      </p>

      {/* Comparison Images and Text */}
      <div className="w-full max-w-4xl mb-4 sm:mb-6">
        <div className="flex justify-center">
          <Image 
            src={urlFor(mediaData.threeFeatureImages[0]).url()}
            alt="Unhappy Users with Phones"
            width={500}
            height={500}
            className="h-auto max-w-[280px] sm:max-w-[400px] md:max-w-[500px]"
          />
        </div>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-center mt-2 sm:mt-4 mb-6 sm:mb-10 italic">
          Appareils reconditionnés lents et se déchargent vite
        </p>
      </div>

      {/* Happy Family Image */}
      <div className="w-full max-w-4xl mb-8 sm:mb-14">
        <div className="flex justify-center">
          <Image 
            src={urlFor(mediaData.threeFeatureImages[1]).url()}
            alt="Happy Family with Xphones"
            width={500}
            height={500}
            className="h-auto max-w-[280px] sm:max-w-[400px] md:max-w-[500px]"
          />
        </div>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-center mt-2 sm:mt-4 italic">
          Appareil d'origine rapide, performant avec une autonomie maximale
        </p>
      </div>

      {/* French Flag Section */}
      <div className="w-full max-w-[250px] sm:max-w-[300px] md:max-w-[400px] mb-4 sm:mb-8">
        <Image 
          src={urlFor(mediaData.frenchProductsSection.girlImage).url()}
          alt="Girl with French Flag"
          width={500}
          height={500}
          className="w-full h-auto"
        />
      </div>
      <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-center mb-8 sm:mb-14 max-w-6xl">
        Chez <span className="text-red-600">X</span>phones, nous sommes{' '}
        <span className="text-blue-600">fiers</span> de privilégier l'origine{' '}
        <span className="text-blue-600">française</span> pour vous{' '}
        <span className="text-blue-600">garantir qualité</span> et{' '}
        <span className="text-blue-600">authenticité</span>. Nous nous sommes{' '}
        <span className="text-green-500">orientés à 100%</span> vers des{' '}
        <span className="text-blue-600">produits d'origine</span>, répondant aux attentes d'une{' '}
        <span className="text-blue-600">clientèle</span> en quête de{' '}
        <span className="text-blue-600">fiabilité</span>.
      </p>

      {/* Shopping Section */}
      <div className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[600px] mb-6 sm:mb-10">
        <div className="flex justify-center">
          <Image 
            src={urlFor(mediaData.threeFeatureImages[2]).url()}
            alt="Happy Shopper"
            width={500}
            height={500}
            className="h-auto w-full"
          />
        </div>
      </div>

      {/* Economy Text */}
      <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-center mb-8 sm:mb-14 max-w-6xl">
        <span className="text-green-500">Réalisez</span> les{' '}
        <span className="text-green-500">meilleures</span> économies ! En achetant chez{' '}
        <span className="text-red-600">X</span>phones, vous évitez les frais très élevés facturés par les grandes plateformes de vente comme{' '}
        <span className="text-purple-500">Cdiscount</span>,{' '}
        <span className="text-orange-500">Amazon</span>,{' '}
        <span className="text-red-500">Rakuten</span>, et surtout{' '}
        <span className="text-blue-500">Back Market</span>.
      </p>

      {/* Commission Text */}
      <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-center mb-8 sm:mb-14 max-w-6xl">
        Leurs <span className="text-yellow-500">commissions</span> peuvent 
        <span className="text-orange-500"> atteindre</span> jusqu'à 
        <span className="text-red-500"> 30 %</span> du prix 
        <span className="text-green-500"> initialement fixé par le vendeur</span>. <br />
        <span className="text-red-500"> Luttons</span> donc contre 
        <span className="text-blue-500"> ces grandes majors</span>, dont 
        <span className="text-red-500"> 90 %</span> des 
        <span className="text-green-500"> vendeurs</span> proposent des produits 
        <span className="text-orange-500"> reconditionnés</span> provenant 
        <span className="text-red-500"> d'Asie</span>.
      </p>

      {/* Marketplace Comparisons */}
      <div className="w-full max-w-4xl space-y-8 sm:space-y-14 mb-8 sm:mb-14">
        {/* Amazon */}
        <div className="text-center">
          <div className="flex justify-center">
            <Image 
              src={urlFor(mediaData.marketplaceImages[0]).url()}
              alt="Amazon Logo"
              width={400}
              height={100}
              className="max-w-[280px] sm:max-w-[400px] md:max-w-[500px] h-auto -mb-2 sm:-mb-4"
            />
          </div>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-center italic mt-4">
            Amazon <span className="text-red-500">applique</span> une <span className="text-red-500">commission</span> vendeur de 
            <span className="text-purple-500"> 12 %</span> à <span className="text-purple-500"> 25 %</span>, ce qui peut 
            <span className="text-sky-500"> significativement</span> 
            <span className="text-yellow-500"> impacter</span> le prix 
            <span className="text-yellow-500"> final</span> pour le 
            <span className="text-yellow-500"> consommateur</span>
          </p>
        </div>

        {/* Back Market */}
        <div className="text-center">
          <div className="flex justify-center">
            <Image 
              src={urlFor(mediaData.marketplaceImages[1]).url()}
              alt="Back Market Logo"
              width={600}
              height={200}
              className="max-w-[450px] sm:max-w-[450px] md:max-w-[600px] h-auto mb-4 -mr-6"
            />
          </div>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-center italic">
            Des <span className="text-yellow-500">commissions</span> multiples allant de 
            <span className="text-red-500"> 20 %</span> à <span className="text-red-500"> 30 %</span>, avec une 
            <span className="text-green-500"> offre</span> principalement composée de 
            <span className="text-red-500"> téléphones reconditionnés</span>, souvent de 
            <span className="text-yellow-500"> qualité</span> 
            <span className="text-yellow-500"> médiocre</span>
          </p>
        </div>

        {/* Cdiscount */}
        <div className="text-center">
          <div className="flex justify-center">
            <Image 
              src={urlFor(mediaData.marketplaceImages[3]).url()}
              alt="Cdiscount Logo"
              width={400}
              height={100}
              className="max-w-[280px] sm:max-w-[350px] md:max-w-[500px] h-auto mb-4 -mr-6"
            />
          </div>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-center italic">
            <span className="text-pink-500">Plateforme</span> regroupant 
            <span className="text-purple-500"> particuliers</span> et 
            <span className="text-yellow-500"> professionnels</span>, avec un 
            <span className="text-purple-500"> contrôle</span> 
            <span className="text-purple-500"> limité</span> sur la 
            <span className="text-red-500"> qualité</span> des 
            <span className="text-red-500"> produits</span> et des 
            <span className="text-yellow-500"> commissions</span> allant de 
            <span className="text-pink-500"> 10 %</span> à <span className="text-pink-500">18 %</span>
          </p>
        </div>

        {/* Rakuten */}
        <div className="text-center">
          <div className="flex justify-center">
            <Image 
              src={urlFor(mediaData.marketplaceImages[2]).url()}
              alt="Rakuten Logo"
              width={450}
              height={100}
              className="max-w-[280px] sm:max-w-[350px] md:max-w-[500px] h-auto mb-4 -ml-4"
            />
          </div>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-center italic">
            <span className="text-yellow-500">90 %</span> des 
            <span className="text-pink-500"> vendeurs</span> sont basés en 
            <span className="text-yellow-500"> Asie</span>, avec des 
            <span className="text-red-500"> commissions</span> allant de 
            <span className="text-red-500"> 10 %</span> à <span className="text-red-500">20 %</span>
          </p>
        </div>
      </div>

      {/* Warning Message */}
      <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-center mb-8 sm:mb-14 max-w-6xl italic">
        <span className="text-red-600">Ne commandez plus</span> sur les{' '}
        <span className="text-red-600">grandes plateformes</span>, qui proposent{' '}
        <span className="text-red-600">majoritairement des produits reconditionnés</span> à des{' '}
        <span className="text-red-600">prix élevés</span> en raison des{' '}
        <span className="text-red-600">commissions importantes</span>. En{' '}
        <span className="text-green-500">commandant</span> chez{' '}
        <span className="text-black">Xphones</span>, vous avez la{' '}
        <span className="text-green-500">certitude</span> d'obtenir un{' '}
        <span className="text-green-500">produit</span> de{' '}
        <span className="text-green-500">qualité</span> similaire à{' '}
        <span className="text-green-500">l'original</span>, avec une{' '}
        <span className="text-green-500">autonomie</span> de vie maximale et au{' '}
        <span className="text-blue-500">meilleur prix</span> du{' '}
        <span className="text-blue-500">marché</span>.
      </p>

      {/* Store Locations */}
      <div className="w-full space-y-8 sm:space-y-14">
        <div className="text-center">
          <div className="max-w-[280px] sm:max-w-md mx-auto">
            <Image 
              src={urlFor(mediaData.storeImages[1]).url()}
              alt="Xphones Voltaire Store"
              width={400}
              height={240}
              className="w-full h-auto rounded-lg mb-2 sm:mb-4"
            />
          </div>
          <div className="space-y-1 sm:space-y-2 text-base sm:text-lg md:text-xl lg:text-2xl">
            <p className="text-blue-600">Xphones VOLTAIRE</p>
            <p className="text-purple-600">6 rue Voltaire</p>
            <p className="text-pink-600">75011 Paris</p>
            <p className="text-orange-600">Ouvert du Lundi au Samedi</p>
            <p className="text-green-600">11h-19h</p>
            <p className="text-yellow-600">Service client: 01 45 45 13 28</p>
          </div>
        </div>

        <div className="text-center">
          <div className="max-w-[280px] sm:max-w-md mx-auto">
            <Image 
              src={urlFor(mediaData.storeImages[0]).url()}
              alt="Xphones Canal Saint Martin Store"
              width={400}
              height={240}
              className="w-full h-auto rounded-lg mb-2 sm:mb-4"
            />
          </div>
          <div className="space-y-1 sm:space-y-2 text-base sm:text-lg md:text-xl lg:text-2xl mb-8">
            <p className="text-blue-600">Xphones CANAL SAINT MARTIN</p>
            <p className="text-purple-600">86 quai de Jemmapes</p>
            <p className="text-pink-600">75010 Paris</p>
            <p className="text-orange-600">Ouvert du Lundi au Samedi</p>
            <p className="text-green-600">11h-18h</p>
            <p className="text-yellow-600">Service client: 01 42 77 13 63</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuiSommes;