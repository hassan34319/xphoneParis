import { sanityClient } from "../../lib/sanityClient";
import { urlFor } from "../../lib/sanityClient";
import Image from 'next/image';

// Types for the grades data
interface GradeImage {
  _key: string;
  image: any;
}

interface Grade {
  _key: string;
  title: string;
  description: string;
  starRating: number;
  images: GradeImage[];
}

interface GradesPageData {
  logo: any;
  mainTitle: string;
  subtitle: string;
  grades: Grade[];
}

async function GradesPage() {
  const query = `*[_type == "grades"][0]{
    logo,
    mainTitle,
    subtitle,
    grades[]{
      _key,
      title,
      description,
      starRating,
      images[]{
        _key,
        image
      }
    }
  }`;
  
  const data: GradesPageData = await sanityClient.fetch(query);
  

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`w-6 h-6 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center px-4 py-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center tracking-wider mb-3">
        {data.mainTitle || "Nos Grades"}
      </h1>

      <div className="flex justify-center w-full px-4 mb-4">
      <div className=" p-2 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-lg xl:max-w-xl ">
          <Image 
            src={urlFor(data.logo).url()} 
            
            alt="XPhones Logo"
            width={500}
            height={300}
            className="w-full h-auto object-contain"
          />
        </div>
      </div>


      
      
      
      <p className="text-lg text-center max-w-3xl mb-12">
  Nos appareils d'origine sont soigneusement classés en  
  <span className="text-purple-500 font-bold"> trois grades esthétiques</span>  pour s'adapter à tous les  
  <span className="text-green-500 font-bold"> goûts et budgets.</span>
  <br /><br />
  Que vous optiez pour un modèle en Bon état, un Très bon état ou Comme neuf, vous bénéficiez toujours d'un  
  <span className="text-yellow-500 font-bold"> appareil fonctionnel</span> à un  
  <span className="text-red-500 font-bold"> prix attractif avec une garantie de 1 an.</span>
  <br /><br />
  Chaque produit a été vérifié pour garantir une qualité optimale, alors profitez de l'occasion pour obtenir un excellent appareil 
  <span className="text-blue-500 font-bold"> à moindre coût!</span> 
</p>



      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-3/4">
        {data.grades?.map((grade, index) => (
          <div 
            key={grade._key}
            className={`flex flex-col  items-center p-6 border-2 border-black rounded-lg ${
              index === data.grades.length - 1 && data.grades.length % 2 !== 0
                ? "lg:col-span-2 lg:max-w-2xl lg:mx-auto"
                : ""
            }`}
          >
            <h2 className="text-2xl font-bold mb-4 text-blue-800">{grade.title}</h2>
            

            <div className="mb-4">
              {renderStars(grade.starRating)}
            </div>
            

            <p className="text-center mb-6">
              {grade.description}
            </p>
            

            <div className="flex w-full gap-4 ">

              <div className="flex flex-col gap-4 flex-1">
                {grade.images?.slice(0, 2).map((img) => (
                  <div 
                    key={img._key}
                    className=" rounded-lg overflow-hidden "
                  >
                    <img
                      src={urlFor(img.image).url()}
                      alt={`${grade.title} example`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              

              {grade.images?.[2] && (
                <div className="flex-1 flex items-center">
                  <div className=" rounded-lg overflow-hidden ">
                    <img
                      src={urlFor(grade.images[2].image).url()}
                      alt={`${grade.title} example`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GradesPage;