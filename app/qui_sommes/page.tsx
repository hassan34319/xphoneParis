import { sanityClient } from "../../lib/sanityClient";
import Image from 'next/image';
import { urlFor } from '../../lib/sanityClient';
import { test } from "node:test";


// Types for media content only
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

  // Hardcoded store data
  const storeLocations = [
    {
      title: "Xphones VOLTAIRE",
      address: "6 rue Voltaire",
      postal: "75011 Paris",
      hours: "11h-19h",
      phone: "01 45 45 13 28"
    },
    {
      title: "Xphones CANAL SAINT MARTIN",
      address: "86 quai de Jemmapes",
      postal: "75010 Paris",
      hours: "11h-18h",
      phone: "01 42 77 13 63"
    }
  ];

  // Hardcoded marketplace descriptions
  const marketplaceDescriptions = [
    "Amazon applique une commission vendeur de 12 % à 25 %, ce qui peut significativement impacter le prix final pour le consommateur",
    "Des commissions multiples allant de 20 % à 30 %, avec une offre principalement composée de téléphones reconditionnés, souvent de qualité médiocre",
    "90 % des vendeurs sont basés en Asie, avec des commissions allant de 10 % à 20 %",
    "Plateforme regroupant particuliers et professionnels, avec un contrôle limité sur la qualité des produits et des commissions allant de 10 % à 18 %"
  ];
  

  
  

  return (
    <div className="flex flex-col items-center px-4 py-8 space-y-12 mx-auto max-w-7xl">
      {/* Heading */}
      <h1 className="text-4xl font-bold text-center tracking-wider">Qui sommes nous ?</h1>

      {/* Logo */}
      <div className="flex justify-center w-full px-4">
      <div className=" p-2 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-lg xl:max-w-xl ">
          <Image 
            src={urlFor(mediaData.logo).url()}

            alt="XPhones Logo"
            width={500}
            height={300}
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* Hero Video Section */}
<div className="flex flex-col md:flex-row items-center gap-8 w-full">
  <div className="w-full md:w-1/2 max-w-xl">
    <video
      autoPlay
      muted
      
      loop
      playsInline
      controls={true}
      className="w-full h-auto"
    >
      <source 
        // Access the video URL directly from the asset
        // src={mediaData.heroVideo?.asset?.url || ''}
        src="/video1.mp4"
        type="video/mp4"
      />
      Your browser does not support the video tag.
    </video>
  </div>
  <div className="w-full md:w-1/2 max-w-xl">
    <p className="text-sm text-center lg:text-lg xl:text-2xl">
      <span className="text-red-600">Xphones s'est imposé comme l'unique maison</span> capable de fournir exclusivement des appareils 
      <span className="text-green-600"> d'origine à des prix inférieurs aux reconditionnés</span>. 
      Fort de notre expérience avec notre partenaire je ne reviendrai jamais en arrière après avoir découvert des appareils aux 
      <span className="text-red-600"> d'origine</span>, nous avons su préserver cette offre
      <span className="text-green-600"> authentique et durable</span>.
    </p>
  </div>
</div>

      {/* Three Feature Images with Text */}
<div className="flex flex-col w-full max-w-7xl mx-auto gap-6 md:gap-8 px-4 -space-y-6">
  {/* Images Row */}
  <div className="flex justify-center w-full gap-12 md:gap-16 lg:gap-20">
    {mediaData.threeFeatureImages.map((image, index) => (
      <div key={index} className="w-[300px] sm:w-[300px] md:w-[350px] lg:w-[400px]">
        <div className="flex justify-center">
          <Image
            src={urlFor(image).url()}
            alt={`Feature ${index + 1}`}
            width={400}
            height={400}
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    ))}
  </div>

  {/* Text Row */}
  <div className="flex justify-center w-full gap-12 md:gap-16 lg:gap-20">
    {/* First Text - Width matches first image */}
    <div className="w-[300px] sm:w-[300px] md:w-[350px] lg:w-[400px]">
      <p className="text-center text-sm lg:text-lg xl:text-2xl italic">
        Appareils reconditionnés lents et se déchargeant rapidement.
      </p>
    </div>
    {/* Second Text - Width matches two images plus gap */}
    <div className="w-[550px] sm:w-[612px] md:w-[716px] lg:w-[820px]">
      <p className="text-center text-sm lg:text-lg xl:text-2xl italic">
        Appareil d'origine rapide, performant avec une autonomie maximale.
      </p>
    </div>
  </div>
</div>

      {/* French Products Section */}
      <div className="flex flex-col-2 md:flex-row gap-8 w-full ">
        <div className="w-full md:w-1/2 flex flex-col gap-8">
          <div className="flex justify-center">
            <Image 
              src={urlFor(mediaData.frenchProductsSection.girlImage).url()}
              alt="French Products"
              width={200}
              height={200}
              className="w-full max-w-[200px] sm:max-w-[150px] md:max-w-xs h-auto object-contain"
            />
          </div>
          <p className="text-center text-sm lg:text-lg xl:text-2xl italic">
            Xphones propose uniquement des produits Français et Européens.
          </p>
          <div className="flex justify-center">
            <Image 
              src={urlFor(mediaData.frenchProductsSection.stopImage).url()}
              alt="Stop Imports"
              width={200}
              height={200}
              className="w-full max-w-[200px] sm:max-w-[150px] md:max-w-sm h-auto object-contain"
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center gap-8">
        <p className="text-center text-sm lg:text-lg xl:text-2xl">
  Chez <span className="text-red-500">X</span>phones, nous sommes <span className="text-blue-500">fiers</span> de privilégier l'origine <span className="text-blue-500">fran</span><span className="text-red-500">çai</span><span className="text-red-500">se</span> pour vous <span className="text-blue-500">garantir</span> <span className="text-red-500">qualité</span> et <span className="text-blue-500">authenticité</span>. Nous nous sommes <span className="text-green-500">orientés à 100%</span> vers des <span className="text-blue-500">produits d'ori</span><span className="text-red-500">gine</span> répondant aux attentes d'une <span className="text-blue-500">clientèle</span> en quête de <span className="text-blue-500">fiabi</span><span className="text-red-500">lité</span>.
</p>

          <div className="flex justify-center">
            <Image 
              src={urlFor(mediaData.frenchProductsSection.coqImage).url()}
              alt="French Coq"
              width={250}
              height={250}
              className="w-full max-w-[250px] sm:max-w-[200px] md:max-w-sm h-auto object-contain"
            />
          </div>
          <p className="text-center text-sm font-bold lg:text-lg xl:text-2xl">
            Stoppons nos achats de produits importés de qualité médiocre et achetons des produits locaux et durables.
          </p>
        </div>
      </div>

      {/* Phone Section */}
      <div className="flex flex-col-2 md:flex-row gap-8 w-full  ">
        <div className="w-full md:w-1/2 flex justify-center">
          <Image 
            src={urlFor(mediaData.frenchProductsSection.phoneImage).url()}
            alt="Phone"
            width={250}
            height={250}
            className="w-full max-w-[250px] sm:max-w-[200px] md:max-w-sm h-auto object-contain justify-center"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center space-y-4">
          <p className="text-sm lg:text-lg xl:text-2xl">
            Réalisez les meilleures économies !
            En achetant chez Xphones, vous évitez les frais très élevés facturés par les grandes plateformes de vente comme Cdiscount, Amazon, Rakuten, et surtout Back Market.
          </p>
          <p className="text-sm lg:text-lg xl:text-2xl">
            Leurs commissions peuvent atteindre jusqu'à 30 % du prix initialement fixé par le vendeur.
          </p>
          <p className="text-sm lg:text-lg xl:text-2xl">
            Luttons donc contre ces grandes majors, dont 90 % des vendeurs proposent des produits reconditionnés provenant d'Asie.
          </p>
        </div>
      </div>

      {/* Marketplace Section */}
<div className="grid grid-cols-2 gap-4 md:gap-8 lg:gap-12 max-w-7xl mx-auto">
  {mediaData.marketplaceImages.map((image, index) => (
    <div key={index} className="space-y-4">
      <div className="relative w-full flex justify-center">
        <div className="w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px]">
          <Image 
            src={urlFor(image).url()}
            alt={`Marketplace ${index + 1}`}
            width={300}
            height={300}
            className="w-full h-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-red-600 text-4xl md:text-6xl lg:text-7xl font-bold">X</div>
          </div>
        </div>
      </div>
      <p className="text-sm text-center lg:text-lg xl:text-2xl">{marketplaceDescriptions[index]}</p>
    </div>
  ))}
</div>

      {/* Store Locations */}
      <div className="w-full grid grid-cols-2 md:grid-cols-2 gap-8 text-blue-600">
        {storeLocations.map((store, index) => (
          <div key={index} className="space-y-4">
            <div className="flex justify-center">
              <Image 
                src={urlFor(mediaData.storeImages[index]).url()}
                alt={store.title}
                width={250}
                height={250}
                className="w-full max-w-[200px] sm:max-w-[250px] md:max-w-sm h-auto object-contain rounded-lg"
              />
            </div>
            <div className="text-center space-y-0.5 text-md xl:text-xl ">
              <h3 className="font-bold text-lg xl:text-2xl">{store.title}</h3>
              <p>{store.address}</p>
              <p>{store.postal}</p>
              <p>Ouvert du Lundi au Samedi</p>
              <p>{store.hours}</p>
              <p>Service client: {store.phone}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuiSommes;