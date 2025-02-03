import { sanityClient } from "../../lib/sanityClient";
import { urlFor } from "../../lib/sanityClient";
import Image from "next/image";
import PortableTextComponent from "../components/PortableTextComponent";

interface QualityFeature {
  _key: string;
  image: any;
  description: string;
}

interface QualityPageData {
  logo: any;
  mainTitle: string;
  subtitle: string;
  qualityFeatures: QualityFeature[];
}

async function QualityPage() {
  const query = `*[_type == "qualityPage"][0]{
    logo,
    mainTitle,
    subtitle,
    qualityFeatures[]{
      _key,
      image,
      description
    }
  }`;
  const data: QualityPageData = await sanityClient.fetch(query);

  return (
    <div className="flex flex-col items-center px-4 py-8 max-w-6xl mx-auto bg-white">
      {/* Title Section */}
      <h1 className="text-4xl font-extrabold text-center tracking-wider mb-5">
        {data.mainTitle || "Notre Qualité"}
      </h1>
      <div className="flex justify-center w-full px-4 mb-4">
        <div className="p-2 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-lg xl:max-w-xl">
          <Image
            src={urlFor(data.logo).url()}
            alt="XPhones Logo"
            width={500}
            height={300}
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
      <PortableTextComponent content={data.subtitle} />
      <p className="text-lg text-center max-w-2xl mb-12">
        Nous <span className="text-red-500 font-bold">vendons</span> exclusivement des appareils d'origine, jamais
        <span className="text-green-500 font-bold"> ouverts</span>,
        <span className="text-yellow-500 font-bold"> altérés</span> de quelque manière que ce soit.
        <br /><br />
        Cela garantit une durée de vie plus longue et une
        <span className="text-purple-500 font-bold"> fiabilité supérieure</span>.
        <br /><br />
        En optant pour nos produits, vous choisissez la
        <span className="text-pink-500 font-bold"> qualité</span> et la
        <span className="text-yellow-500 font-bold"> performance</span> sont intactes, offrant une meilleure expérience d'utilisation et une tranquillité d'esprit sur le
        <span className="text-yellow-500 font-bold"> long terme</span>.
      </p>
      {/* Features Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-2 lg:gap-4 w-full max-w-5xl mx-auto">
        {data.qualityFeatures?.map((feature) => (
          <div
            key={feature._key}
            className="flex flex-col items-center space-y-2 lg:space-y-3"
          >
            {/* Circle Image Container */}
            <div className="relative w-36 h-36 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden transition-transform hover:scale-105">
              <img
                src={urlFor(feature.image).url()}
                alt={feature.description}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Description */}
            <p className="text-center text-sm md:text-base lg:text-lg max-w-xs px-2">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QualityPage;