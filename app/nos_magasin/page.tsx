import { sanityClient } from "../../lib/sanityClient";
import Image from 'next/image';
import { urlFor } from '../../lib/sanityClient';

interface NosmagasinMedia {
  logo: any;
  store1: any;
  store2: any;
}

async function Nosmagasin() {
  const query = `*[_type == "nosmagasin"][0]`;
  const mediaData: NosmagasinMedia = await sanityClient.fetch(query);

  return (
    <div className="w-full bg-white">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Logo and Rating */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-[350px] md:max-w-md">
            <Image
              src={urlFor(mediaData.logo).url()}
              alt="XPhones Logo"
              width={400}
              height={100}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </div>

        {/* Main Title */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-center ">Nos magasins</h1>

        {/* Store Title */}
        <div className="text-center space-y-2">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-red-600">XPhones Paris</h2>
          <p className="text-xl md:text-2xl lg:text-3xl font-bold text-red-600">
            Des boutiques à votre service et des prix Imbattables
          </p>
        </div>

        {/* First Description */}
        <p className="text-lg md:text-xl lg:text-2xl text-center font-semibold">
          Chez XPhones, nous avons révolutionné l'achat de produits high-tech
          Nos deux boutiques vous offrent la possibilité de voir et tester les
          produits avant de les acheter, avec l'accompagnement de nos
          experts sur place et beaucoup moins cher que sur les Marketplaces.
        </p>

        {/* First Store */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-full max-w-[300px] md:max-w-md">
            <Image
              src={urlFor(mediaData.store2).url()}
              alt="XPhones Canal Saint Martin"
              width={500}
              height={300}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
          <div className="text-center space-y-1">
            <p className="text-lg md:text-xl lg:text-2xl text-blue-600 font-bold">Xphones CANAL SAINT MARTIN</p>
            <p className="text-base md:text-lg lg:text-xl text-blue-600">86 quai de jemmapes</p>
            <p className="text-base md:text-lg lg:text-xl text-blue-600">75010 Paris</p>
            <p className="text-base md:text-lg lg:text-xl text-blue-600">Ouvert du Lundi au Samedi</p>
            <p className="text-base md:text-lg lg:text-xl text-blue-600">11h-19h</p>
            <p className="text-base md:text-lg lg:text-xl text-blue-600">Service client: 01 45 45 13 28</p>
          </div>
        </div>

        {/* Service Description */}
        <p className="text-lg md:text-xl lg:text-2xl text-center font-extrabold">
          En plus de cela, vous bénéficiez d'un service après-vente immédiat et personnalisé, 
          un avantage que beaucoup de plateformes en ligne ne peuvent pas proposer.
        </p>

        {/* Second Store */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-full max-w-[300px] md:max-w-md">
            <Image
              src={urlFor(mediaData.store1).url()}
              alt="XPhones Voltaire"
              width={500}
              height={300}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
          <div className="text-center space-y-1">
            <p className="text-lg md:text-xl lg:text-2xl text-blue-600 font-bold">Xphones VOLTAIRE</p>
            <p className="text-base md:text-lg lg:text-xl text-blue-600">6 rue Voltaire</p>
            <p className="text-base md:text-lg lg:text-xl text-blue-600">75011 Paris</p>
            <p className="text-base md:text-lg lg:text-xl text-blue-600">Ouvert du Lundi au Samedi</p>
            <p className="text-base md:text-lg lg:text-xl text-blue-600">11h-19h</p>
            <p className="text-base md:text-lg lg:text-xl text-blue-600">Service client: 01 45 45 13 28</p>
          </div>
        </div>

        {/* Marketplace Comparison */}
        <p className="text-lg md:text-xl lg:text-2xl text-center font-extrabold">
          Contrairement aux autres vendeurs en ligne qui agissent comme des intermédiaires, 
          passant par des plateformes comme Amazon, Cdiscount ou Backmarket, avec des commissions supplémentaires, 
          nous vendons directement en magasin. Cela nous permet de proposer les meilleurs prix du marché, 
          sans les coûts cachés des intermédiaires, tout en garantissant une proximité et une transparence totale.
        </p>

        {/* <div className="max-w-[350px] md:max-w-2xl mx-auto">
          <Image 
            src="/OPTEZ-POUR-L-ORIGINAL-21.jpg"
            alt="Map"
            width={400}
            height={240}
            className="w-full h-auto object-cover"
            priority
          />
        </div> */}

        {/* Final CTA */}
        <p className="text-xl md:text-2xl lg:text-3xl text-center font-semibold">
          Venez découvrir nos boutiques et profitez des meilleurs prix high-tech à Paris.
        </p>
      </div>
    </div>
  );
}

export default Nosmagasin;