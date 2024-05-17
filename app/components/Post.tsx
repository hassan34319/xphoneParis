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

    const approvedPublications = publications.filter(publication => publication.approved);


    const sortedPublications = approvedPublications.slice().sort((a, b) => {
      // Ensure that _createdAt is defined before performing operations
      const dateA = a._createdAt ? new Date(a._createdAt).getTime() : 0;
      const dateB = b._createdAt ? new Date(b._createdAt).getTime() : 0;
      return dateB - dateA;
    });

    console.log("Sorted Pub", sortedPublications, publications)

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

      if(currentUser?.email == "xphones@proton.me") {
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
    <div id="post-main" className="flex flex-col items-center justify-center md:w-8/12 mx-auto">
      <div className="border-t-2 border-gray-300 flex flex-col items-center w-full relative justify-center">
        <div className="w-full relative h-24 mt-4">
          <Image
            src="https://image.noelshack.com/fichiers/2024/20/2/1715721782-xphones-logo-intro.png"
            fill
            className="object-contain"
            alt="Community"
          />
        </div>
        <h3 className="mt-3 text-center font-bold text-xl">
          PhonesBook, le premier réseau social multimédia en France, vous ouvre
          les portes pour surfer sur leurs nouveaux pilotes et promotions
          exclusives !
        </h3>
        <h3 className="mt-3 text-center font-bold text-xl">
          Ne manquez pas nos codes promo ou les nombreux numéros de code à
          gagner. Inscrivez-vous simplement, pour une expérience unique où
          divertissement et bonnes affaires vous attendent !
        </h3>
        <h3 className="mt-3 text-center font-bold text-xl">
          {"Ajoutez des photos, restez informé, profitez de l'entraide et plongez dans nos offres promotionnelles les plus avantageuses."}
        </h3>
        <h3 className="mt-3 mb-4 text-center font-bold text-4xl">
          REJOIGNEZ-NOUS !
        </h3>
      </div>
      {currentUser && <PostCreation handleAddPost={handleAddPost} currentUser={currentUser} />}
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
