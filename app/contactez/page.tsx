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
    <div className="flex flex-col items-center w-full max-w-8xl mx-auto bg-white px-4 sm:px-6">
      {/* Logo and Rating Section */}
      <div className="w-full mb-4">
        <div className="relative w-full h-16 sm:h-28 md:h-36">
          <Image 
            src={urlFor(mediaData.logo).url()}
            alt="XPhones Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
       
      </div>

      {/* Main Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">CONTACTEZ NOUS</h1>

      {/* Description */}
      <p className="text-xl sm:text-2xl md:text-3xl text-center mb-6 sm:mb-8 max-w-5xl">
        Pour contacter notre service client, vous pouvez nous joindre par email, 
        par téléphone ou vous rendre directement dans l'un de nos magasins.
      </p>

      {/* Contact Section */}
      <div className="w-full space-y-4 sm:space-y-6 max-w-[500px]">
        {/* Customer Service Image 1 */}
        <div className="relative w-full aspect-[4/3]  overflow-hidden">
          <Image 
            src={urlFor(mediaData.phoneAgent).url()}
            alt="Customer Service"
            fill
            className=""
          />
        </div>

        {/* Email Contact */}
        <div className="flex justify-center items-center space-x-2 py-2 max-w-[500px]">
          <div className="w-10 h-8 sm:w-14 sm:h-10">
            <Image 
              src={urlFor(mediaData.emailIcon).url()}
              alt="Email"
              width={50}
              height={30}
              className="object-contain"
            />
          </div>
          <span className=" text-2xl sm:text-3xl md:text-4xl">
            <span className="text-green-500">Contact</span>
            <span className="text-orange-500">@</span>
            <span className="text-red-500">xphones</span>
            <span>.fr</span>
          </span>
        </div>

        {/* Customer Service Image 2 */}
        <div className="relative w-full h-full aspect-[4/3]  overflow-hidden">
          <Image 
            src={urlFor(mediaData.emailAgent).url()}
            alt="Phone Service"
            fill
            className=""
          />
        </div>

        {/* Phone Number */}
        <div className="flex justify-center items-center space-x-2 py-2">
          <div className="w-10 h-10 sm:w-14 sm:h-14">
            <Image 
              src={urlFor(mediaData.phoneIcon).url()}
              alt="Phone"
              width={50}
              height={50}
              className="object-contain"
            />
          </div>
          <span className="text-2xl sm:text-3xl md:text-4xl tracking-wider">
            <span className="text-gray-600">01 </span>
            <span className="text-green-500">42 </span>
            <span className="text-blue-500">77 </span>
            <span className="text-purple-500">13 </span>
            <span className="text-orange-500">63</span>
          </span>
        </div>

        {/* Customer Service Image 2 */}
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
          <Image 
            src="/OPTEZ-POUR-L-ORIGINAL-77.jpg"
            alt="Phone Service"
            fill
            className=""
          />
        </div>

        {/* WhatsApp Number */}
        <div className="flex items-center justify-center space-x-2">
            <span className="w-8 h-8 sm:w-12 sm:h-12">
              <img src="/OPTEZ-POUR-L-ORIGINAL-79.jpg" alt="WhatsApp" className="w-full h-full" />
            </span>
            <span className="text-2xl sm:text-3xl md:text-4xl">
              <span className="text-green-500">07 </span>
              <span className="text-orange-500">56 </span>
              <span className="text-purple-500">96 </span>
              <span className="text-blue-500">44 </span>
              <span className="text-red-500">45</span>
            </span>
          </div>

        {/* Store Republique */}
        <div className="flex flex-col items-center space-y-3">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
            <Image 
              src={urlFor(mediaData.storeRepublique).url()}
              alt="XPhones Store Republique"
              fill
              className="object-cover"
            />
          </div>
          
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600">
              XPHONES STORE REPUBLIQUE
            </h2>
            <p className="mt-1 text-xl sm:text-2xl md:text-3xl">
              <span className="text-yellow-500">86 </span>
              <span className="text-red-500">quai </span>
              <span className="text-green-500">de </span>
              <span className="text-purple-500">Jemmapes</span>
            </p>
            <p className="text-orange-500 text-xl sm:text-2xl md:text-3xl">75010 Paris</p>
          </div>
        </div>

        {/* Store Nation */}
        <div className="flex flex-col items-center space-y-3">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
            <Image 
              src={urlFor(mediaData.storeNation).url()}
              alt="XPhones Store Nation"
              fill
              className="object-cover"
            />
          </div>
          <div className="text-center">
            <h2 className="ext-xl sm:text-2xl md:text-3xl font-bold text-red-500">
              XPHONES STORE NATION
            </h2>
            <p className="mt-1 text-xl sm:text-2xl md:text-3xl">
              <span className="text-red-500">6 </span>
              <span className="text-green-500">rue </span>
              <span className="text-blue-500">Voltaire</span>
            </p>
            <p className="text-blue-500 text-xl sm:text-2xl md:text-3xl">75011 Paris</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;