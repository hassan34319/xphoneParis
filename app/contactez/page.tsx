import { sanityClient } from "../../lib/sanityClient";
import Image from 'next/image';
import { urlFor } from '../../lib/sanityClient';


interface ContactPageMedia {
  logo: any;
  emailAgent: any;
  phoneAgent: any;
  storeRepublique: any;
  storeNation: any;
  phoneIcon: any;
  emailIcon: any;
}

async function ContactPage() {
  const query = `*[_type == "contactPage"][0]`;
  const mediaData: ContactPageMedia = await sanityClient.fetch(query);
  
  return (
    <div className="flex flex-col items-center px-4 py-8 space-y-8 max-w-6xl mx-auto bg-white ">

      <h1 className="text-4xl font-extrabold text-center tracking-wider">Contactez - Nous</h1>


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


      <p className="text-xl xl:text-2xl text-center max-w-3xl">
        Pour contacter notre service client, vous pouvez nous joindre par email, 
        par téléphone ou vous rendre directement dans l'un de nos magasins.
      </p>


      <div className="grid grid-cols-2 md:grid-cols-2 gap-8 w-full max-w-4xl">

      <div className="flex flex-col items-center space-y-4">
      <div className="rounded-3xl overflow-hidden  w-3/4 max-w-sm aspect-square">

    <img
      src={urlFor(mediaData.phoneAgent).url()}
      alt="Customer Service Phone"
      className="w-full h-full object-cover"
    />
  </div>
  <div className="flex items-center space-x-2 text-xl xl:text-2xl">
    <img src={urlFor(mediaData.phoneIcon).url()} alt="Phone" className="w-12 h-12" />
    <span className="text-xl font-bold">
      <span className="text-gray-600">01 </span>
      <span className="text-green-500">42 </span>
      <span className="text-blue-500">77 </span>
      <span className="text-orange-500">13 </span>
      <span className="text-purple-500">63</span>
    </span>
  </div>
</div>

<div className="flex flex-col items-center space-y-4">
<div className="rounded-3xl overflow-hidden  w-3/4 max-w-sm aspect-square">
    <img
      src={urlFor(mediaData.emailAgent).url()}
      alt="Customer Service Email"
      className="w-full h-full object-cover"
    />
  </div>
  <div className="flex items-center space-x-2">
    <img src={urlFor(mediaData.emailIcon).url()} alt="Email" className="w-12 h-12" />
    <div className="text-xl break-all text-center xl:text-2xl">
      <span className="inline-block text-gray-600">Contact</span>
      <span className="inline-block text-orange-500">@</span>
      <span className="inline-block text-red-500">xphones</span>
      <span className="inline-block text-gray-600">.fr</span>
    </div>
  </div>
</div>


        <div className="flex flex-col items-center space-y-4">
          <div className="rounded-3xl overflow-hidden  w-full max-w-md aspect-video">
            <img 
              src={urlFor(mediaData.storeRepublique).url()} 
              alt="XPhones Store Republique"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center">
            <h2 className="text-xl xl:text-2xl font-bold" style={{ color: '#8B5CF6' }}>XPHONES STORE REPUBLIQUE</h2>
            <p className="mt-2 text-lg xl:text-xl">
              <span className="text-yellow-500">86</span>
              <span className="text-red-500"> quai </span>
              <span className="text-green-500">de </span>
              <span className="text-purple-500">Jemmapes</span>
            </p>
            <p className="text-orange-500">75010 Paris</p>
          </div>
        </div>


        <div className="flex flex-col items-center space-y-4">
          <div className="rounded-3xl overflow-hidden  w-full max-w-md aspect-video">
            <img 
              src={urlFor(mediaData.storeNation).url()} 
              alt="XPhones Store Nation"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center">
            <h2 className="text-xl  xl:text-2xl font-bold text-red-500">XPHONES STORE NATION</h2>
            <p className="mt-2 text-lg xl:text-xl">
              <span className="text-red-500">6 </span>
              <span className="text-green-500">rue </span>
              <span className="text-red-500">Voltaire </span>
              <span className="text-blue-500">75011</span>
            </p>
            <p className="text-blue-500">Paris</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ContactPage;