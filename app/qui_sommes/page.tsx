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
    <div className="flex flex-col items-center px-4 py-8 space-y-12 mx-auto max-w-6xl">
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
    <p className="text-sm text-left">
      <span className="text-red-600">Xphones s'est imposé comme l'unique maison</span> capable de fournir exclusivement des appareils 
      <span className="text-green-600">d'origine à des prix inférieurs aux reconditionnés</span>. 
      Fort de notre expérience avec notre partenaire je ne reviendrai jamais en arrière après avoir découvert des appareils aux 
      <span className="text-red-600">d'origine</span>, nous avons su préserver cette offre
      <span className="text-green-600">authentique et durable</span>.
    </p>
  </div>
</div>

      {/* Three Feature Images */}
      <div className="flex justify-between w-full gap-2 md:gap-6">
        {mediaData.threeFeatureImages.map((image, index) => (
          <div key={index} className="flex items-center justify-center w-1/3">
            <div className="w-full max-w-[200px] sm:max-w-[150px] md:max-w-xs">
              <Image 
                src={urlFor(image).url()}
                alt={`Feature ${index + 1}`}
                width={250}
                height={250}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Text Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
        <div className="flex flex-col items-center">
          <p className="text-center text-sm">
            Chez Xphones, nous sommes fiers de privilégier l'origine française pour vous garantir qualité et authenticité.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-center text-sm">
            Optez pour la tranquillité d'esprit en recevant vos appareils qui atteignent une clientèle à l'autre de fiabilité
          </p>
        </div>
      </div>

      {/* French Products Section */}
      <div className="flex flex-col-2 md:flex-row gap-8 w-full">
        <div className="w-full md:w-1/2 flex flex-col gap-8">
          <div className="flex justify-center">
            <Image 
              src={urlFor(mediaData.frenchProductsSection.girlImage).url()}
              alt="French Products"
              width={250}
              height={250}
              className="w-full max-w-[200px] sm:max-w-[250px] md:max-w-xs h-auto object-contain"
            />
          </div>
          <p className="text-center text-sm">
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
          <p className="text-center text-sm">
            Chez Xphones, nous sommes fiers de privilégier l'origine française pour vous garantir qualité et authenticité.
          </p>
          <div className="flex justify-center">
            <Image 
              src={urlFor(mediaData.frenchProductsSection.coqImage).url()}
              alt="French Coq"
              width={200}
              height={200}
              className="w-full max-w-[200px] sm:max-w-[150px] md:max-w-sm h-auto object-contain"
            />
          </div>
          <p className="text-center text-sm font-bold">
            Stoppons nos achats de produits importés de qualité médiocre et achetons des produits locaux et durables.
          </p>
        </div>
      </div>

      {/* Phone Section */}
      <div className="flex flex-col-2 md:flex-row gap-8 w-full">
        <div className="w-full md:w-1/2 flex justify-center">
          <Image 
            src={urlFor(mediaData.frenchProductsSection.phoneImage).url()}
            alt="Phone"
            width={200}
            height={200}
            className="w-full max-w-[200px] sm:max-w-[150px] md:max-w-sm h-auto object-contain"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center space-y-4">
          <p className="text-sm">
            Réalisez les meilleures économies !
            En achetant chez Xphones, vous évitez les frais très élevés facturés par les grandes plateformes de vente comme Cdiscount, Amazon, Rakuten, et surtout Back Market.
          </p>
          <p className="text-sm">
            Leurs commissions peuvent atteindre jusqu'à 30 % du prix initialement fixé par le vendeur.
          </p>
          <p className="text-sm">
            Luttons donc contre ces grandes majors, dont 90 % des vendeurs proposent des produits reconditionnés provenant d'Asie.
          </p>
        </div>
      </div>

      {/* Marketplace Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {mediaData.marketplaceImages.map((image, index) => (
          <div key={index} className="space-y-2">
            <div className="relative w-full flex justify-center">
              <div className="w-full max-w-[200px] sm:max-w-[150px] md:max-w-[180px]">
                <Image 
                  src={urlFor(image).url()}
                  alt={`Marketplace ${index + 1}`}
                  width={180}
                  height={180}
                  className="w-full h-auto object-contain"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-red-600 text-4xl md:text-6xl font-bold">X</div>
                </div>
              </div>
            </div>
            <p className="text-sm text-center">{marketplaceDescriptions[index]}</p>
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
            <div className="text-center space-y-0.5">
              <h3 className="font-bold text-lg">{store.title}</h3>
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