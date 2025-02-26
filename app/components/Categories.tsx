/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Category = {
  title: string;
  sub: string;
  image: string;
  search: string;
};

export const categories: Category[] = [
 
  
  {
    title: "Smartphones",
    sub: "Les meilleurs smartphones au meilleur prix",
    image:
      "https://www.backmarket.be/cdn-cgi/image/format=auto,quality=75,width=3840/https://images.ctfassets.net/mmeshd7gafk1/7ofQLlErESxni2tswqIzu2/f8676d800395b9c1c6e2adbd13382bc0/iPhone_11.jpg",
    search: "Smartphone",
  },
  
  {
    title: "Iphone",
    sub: "La pointe de la technologie",
    image:
      "data:image/jpeg;base64,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",
    search: "Iphone",
  },
  {
    title: "Samsung",
    sub: "Des produits de qualité",
    image:
      "https://www.backmarket.com/cdn-cgi/image/format%3Dauto%2Cquality%3D75%2Cwidth%3D3840/https://d2e6ccujb3mkqf.cloudfront.net/fff84644-0647-4cd0-88a5-8c046de1e654-1_d1f69699-7438-4a22-b982-376babb40636.jpg",
    search: "Samsung",
  },
  {
    title: "Apple",
    sub: `La classe d'Apple avec encore plus de puissance`,
    image:
      "https://www.backmarket.be/cdn-cgi/image/format=auto,quality=75,width=3840/https://images.ctfassets.net/mmeshd7gafk1/27ZSBQZSKhuRA2NGVNXJqz/0e3b88642ff6ed7c53fcf59214ea3f44/MacBook_Air_M1_2020.jpg",
    search: "Apple",
  },
  {
    title: "Tablettes",
    sub: "La pointe de la technologie",
    image:
      "/tab.jpeg",
    search: "tablet",
  },
  
  {
    title: "Audio",
    sub: "La pointe de la technologie",
    image:
      "/audio.webp",
    search: "Audio",
  },
  {
    title: "Ordinateurs",
    sub: "Les meilleurs rapports qualité prix",
    image: "https://m.media-amazon.com/images/I/61aTywrhyBS._AC_SX425_.jpg",
    search: "Ordinateur",
  },
  {
    title: "Jeux vidéo",
    sub: "La pointe de la technologie",
    image:
      "/ps5.jpeg",
    search: "Jeux video",
  },
  
  
  {
    title: "Télévisions",
    sub: "Le plus haut de gamme pour vos yeux",
    image: "tvv.webp",
    search: "Television",
  },
];

// ...
type Props = {};

function Categories({}: Props) {
  return (
    <div className="w-11/12 mx-auto rounded-xl my-8">
      <div className="grid grid-cols-1 md:grid-cols-2 rounded-xl gap-4">
        {categories.map((category) => {
          return (
            <Link
              key={category.title}
              href={{
                pathname: "/products",
                query: { search: category.search },
              }}
            >
              <div
                className="bg-white rounded-xl p-4 md:col-start-1 md:col-end-3 col-start-1 col-end-3 md:col-span-2 shadow-xl hover:shadow-2xl cursor-pointer"
                key={category.title}
              >
                <img
                  className="rounded-xl mx-auto h-80"
                  src={category.image}
                  alt="category image"
                />
                <h1 className="text-3xl font-bold">{category.title}</h1>
                <h2 className="text-xl">{category.sub}</h2>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Categories;
