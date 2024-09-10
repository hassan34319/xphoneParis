"use client";
import { User } from "@prisma/client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { sanityClient } from "../../lib/sanityClient";
import { Publication } from "../utils/types";
import PostContent from "./PostContent";
import PostCreation from "./PostCreation";

type Props = {
  currentUser: User | null;
  publications: Publication[];
};

function Post({ currentUser, publications }: Props) {
  // State to hold the posts
  const [posts, setPosts] = useState<Publication[]>([]);

  // Sort publications by date (assuming each publication has a 'date' property)

  // Initialize state with sorted publications
  useEffect(() => {
    const approvedPublications = publications.filter(
      (publication) => publication.approved
    );

    const sortedPublications = approvedPublications.slice().sort((a, b) => {
      // Ensure that _createdAt is defined before performing operations
      const dateA = a._createdAt ? new Date(a._createdAt).getTime() : 0;
      const dateB = b._createdAt ? new Date(b._createdAt).getTime() : 0;
      return dateB - dateA;
    });

    console.log("Sorted Pub", sortedPublications, publications);

    setPosts(sortedPublications);
  }, [publications]);

  // Function to add a new post
  const handleAddPost = async (newPost: Publication) => {
    try {
      // Make a post request to Sanity to create a new publication with the given data
      const response = await sanityClient.create({
        ...newPost,
        _type: "publication",
      });
      console.log("Publication created successfully:", response);

      // Update the state with the new publication only after successful creation

      if (currentUser?.email == "xphones@proton.me") {
        const publicationData2 = {
          ...newPost,
          _id: response._id,
          _createdAt: response._createdAt,
          // Add other fields if needed based on your form inputs
        };

        setPosts((prevPosts) => [newPost, ...prevPosts]);
      }

      return response;
    } catch (error) {
      console.error("Error creating publication:", error);
      throw error;
    }
  };

  return (
    <div
      id="post-main"
      className="flex flex-col items-center justify-center md:w-7/12 mx-auto"
    >
      <div className="border-t-2 border-gray-300 flex flex-col items-center w-full relative justify-center">
        <div className="w-full relative h-48 mt-4">
          <Image
            src="/Social2.png"
            fill
            className="object-contain"
            alt="Community"
          />
        </div>
        <h3 className="mt-3 text-center font-bold text-2xl">
          Bienvenue au {" "}
          <span className="text-red-500">Xphones Social Club.</span>
          <br></br>
          Ouvrez les portes du réseau social high-tech de chez Xphones et
          profitez dés maintenant de nombreux avantages et réductions.
        </h3>
        <br></br>
        <h3 className="mt-3 text-center font-bold text-2xl">
          Vous aurez accès à des{" "}
          <span className="text-red-500">VENTES PRIVEES, </span> des{" "}
          <span className="text-[#E0115F]">PROMOTIONS EXCLUSIVE,</span> des{" "}
          <span className="text-[#1338BE]"> {"JEUX CONCOURS PALPITANTS"} </span>{" "}
          et vous serez invité à des{" "}
          <span className="text-[#1338BE]"> EVENEMENTS EXCEPTIONNELS </span>{" "}
          dans toutes la France.
        </h3>
        <br></br>
        <h3 className="mt-3 text-center font-bold text-2xl">
          Vous pouvez dès à présent poster sur le Social Club, ajouter des
          photos et des vidéos afin de partager votre expérience ou tout
          simplement pour dire bonjour.
        </h3>
        <a href="#Subscribe" className="mb-4 mt-4 relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-red-500 rounded-xl group">
<span className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-red-700 rounded group-hover:-mr-4 group-hover:-mt-4">
<span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white"></span>
</span>
<span className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full translate-y-full bg-red-600 rounded-2xl group-hover:mb-12 group-hover:translate-x-0"></span>
<span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white">REJOIGNEZ NOUS</span>
</a>
        {/* <a
          href="#_"
          className="relative p-0.5 inline-flex items-center justify-center font-bold overflow-hidden group rounded-md"
        >
          <span className="w-full h-full bg-gradient-to-br from-[#ff8a05] via-[#ff5478] to-[#ff00c6] group-hover:from-[#ff00c6] group-hover:via-[#ff5478] group-hover:to-[#ff8a05] absolute"></span>
          <span className="relative px-6 py-3 transition-all ease-out bg-gray-900 rounded-md group-hover:bg-opacity-0 duration-400">
            <span className="relative text-white"> REJOIGNEZ NOUS</span>
          </span>
        </a> */}
      </div>
      {currentUser && (
        <PostCreation handleAddPost={handleAddPost} currentUser={currentUser} />
      )}
      {posts.map((pub: Publication) => {
        return (
          <PostContent
            publication={pub}
            key={pub._id}
            currentUser={currentUser}
          />
        );
      })}
    </div>
  );
}

export default Post;
