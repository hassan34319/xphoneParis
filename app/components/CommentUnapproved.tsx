import Image from "next/image";
import React from "react";
import toast from "react-hot-toast";
import { sanityClient } from "../../lib/sanityClient";
import { Comment, Publication } from "../utils/types";

type Props = {
  comment: Comment;
  publication : Publication
};

function CommentUnapproved({ comment,publication }: Props) {
  const handleApprove = async () => {
    // Check if the current user is authenticated before adding the comment

    // Create a new comment object
    const newComment: Comment = {
      _key: comment._key,
      user: comment.user,
      content: comment.content,
      status : 'approved'
    };

    const pub = await sanityClient.getDocument(publication._id!);
    console.log("pub", pub);
    if (!pub) {
      console.log("ERROR");
      throw new Error("Product not found");
    }
    // Update the product with the new review
    const filteredCom = publication.comments!.filter((commenter)=> commenter._key !== comment._key)
    const updatedPub = {
        ...pub,
        comments: filteredCom.length>0 ? filteredCom.concat(newComment) : [newComment], // Assuming your product schema field is named "review"
      };
    console.log(pub, "updated");

    // Send the updated product data to Sanity
    try {
      const response = await sanityClient
        .patch(publication._id!)
        .set(updatedPub)
        .commit();

      toast.success("Updated");
      return response;
    } catch (error) {
      console.log(error, "ERROR");
    }

    // Send the comment object to the Sanity API
  };

  return (
    <article className="p-6 pb-6 text-base bg-white w-full rounded-xl rounded-t-none border border-t-0">
      <footer className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <p className="inline-flex items-center mr-3 text-sm text-black">
            <Image
              className="mr-2 w-6 h-6 rounded-full"
              src="/prof.png"
              alt="Michael Gough"
              width={24}
              height={24}
            />
            {comment.user}
          </p>
          <p className="text-sm text-gray-900">
            <p>{comment.createdAt?.toLocaleString()}</p>
          </p>
        </div>
      </footer>
      <p className=" text-gray-900">{comment.content}</p>
      <button className="bg-green-300 px-4 py-2" onClick={handleApprove}>
        Approve?
      </button>
    </article>
  );
}

export default CommentUnapproved;
