import { sanityClient } from "../../lib/sanityClient";
import Image from 'next/image';
import { urlFor } from '../../lib/sanityClient';

// Types for media content only
interface NosmagasinMedia {
  logo: any;
  store1: any;
  store2: any;
}

async function Nosmagasin() {
  const query = `*[_type == "nosmagasin"][0]`;
  const mediaData: NosmagasinMedia = await sanityClient.fetch(query);

  return (
    <div className="flex flex-col items-center px-4 py-8 space-y-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center tracking-wider">Nos Magasin</h1>
      
      <div className="flex justify-center w-full px-4">
      <div className=" p-2 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-lg xl:max-w-xl ">
          <Image 
            src={urlFor(mediaData.logo).url()}
            alt="XPhones Logo"
            width={800}
            height={400}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </div>

      <p className="text-l text-center max-w-3xl">XPhones Paris: Des boutiques à votre service et des prix Imbattables</p>
      
      <p className="text-l text-center max-w-3xl">
        Chez XPhones, nous avons révolutionné l'achat de produits high-tech à Paris. Nos deux boutiques vous offrent la possibilité de voir et tester les produits avant de les acheter, avec l'accompagnement de nos experts sur place. En plus de cela, vous bénéficiez d'un service après-vente immédiat et personnalisé, un avantage que beaucoup de plateformes en ligne ne peuvent pas proposer.
      </p>
      
      <p className="text-l text-center max-w-3xl">
        Contrairement aux autres vendeurs en ligne qui agissent comme des intermédiaires, passant par des plateformes comme Amazon, Cdiscount ou Backmarket, avec des commissions supplémentaires, nous vendons directement en magasin. Cela nous permet de proposer les meilleurs prix du marché, sans les coûts cachés des intermédiaires, tout en garantissant une proximité et une transparence totale.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <div className="flex flex-col items-center space-y-4">
          <div className="rounded-3xl overflow-hidden  w-full max-w-md ">
            <Image
              src={urlFor(mediaData.store1).url()}
              alt="XPhones Store Republique"
              width={600}
              height={400}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <div className="text-center">
            <h2 className="text-sm font-bold text-blue-700">
              Xphones CANAL SAINT MARTIN <br />
              86 quai de jemmapes <br />
              75010 Paris <br />
              Ouvert du Lundi au Samedi <br />
              11h-18h <br />
              Service client: 01 42 77 13 63
            </h2>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="rounded-3xl overflow-hidden  w-full max-w-md">
            <Image
              src={urlFor(mediaData.store2).url()}
              alt="XPhones Store Nation"
              width={600}
              height={400}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <div className="text-center">
            <h2 className="text-sm font-bold text-blue-700">
              Xphones VOLTAIRE <br />
              6 rue Voltaire <br />
              75011 Paris <br />
              Ouvert du Lundi au Samedi <br />
              11h-19h <br />
              Service client: 01 45 45 13 28
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nosmagasin;