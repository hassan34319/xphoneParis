"use client";
import "slick-carousel/slick/slick.css";
import ReactPlayer from "react-player";
import { CldVideoPlayer } from "next-cloudinary";
import { AiOutlineSend } from "react-icons/ai";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import {
  ChatBubbleLeftIcon,
  ChatBubbleOvalLeftIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import { ShareIcon } from "@heroicons/react/24/solid";
import { User } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import { Comment, Publication } from "../utils/types";
import { sanityClient } from "../../lib/sanityClient";
import toast from "react-hot-toast";
import CommentComponent from "./Comment";
import CommentUnapproved from "./CommentUnapproved";
type Props = {
  publication: Publication;
  currentUser: User | null;
};
function PostContent({ publication, currentUser }: Props) {
  console.log("The post", publication);
  console.log("the comments", publication);
  console.log(publication._createdAt);
  const [isLiked, setIsLiked] = useState(
    publication.likes && currentUser && currentUser.email
      ? publication.likes.includes(currentUser.email)
      : false
  );

  const onLikeHandler = async () => {
    if (!currentUser) {
      toast.error("Please login to Like a post");
      return;
    }

    // Toggle the like state
    setIsLiked((prevIsLiked) => !prevIsLiked);

    // Update the likes array locally (optional) to show the immediate change to the user
    const updatedLikes = isLiked
      ? publication.likes?.filter((email) => email !== currentUser?.email) || []
      : [
          ...(publication.likes?.filter(Boolean) || []), // Filter out null values
          currentUser?.email, // Add current user's email (if not null)
        ].filter(Boolean);

    // Update the likes array on the Sanity publication using its ID
    try {
      // Send the update request to Sanity
      await sanityClient
        .patch(publication._id!)
        .set({ likes: updatedLikes })
        .commit();

      // Handle successful update if needed
      console.log("Likes updated successfully!");
    } catch (error) {
      // Handle error if the update fails
      console.error("Error updating likes:", error);
    }
  };
  const [commentContent, setCommentContent] = useState("");
  const onCommentHandler = async () => {
    // Check if the current user is authenticated before adding the comment
    if (!currentUser) {
      console.log("Only authenticated users can add comments.");
      return;
    }

    // Create a new comment object
    const newComment : Comment = {
      _key: Date.now().toLocaleString(),
      user: currentUser.firstName + " " + currentUser.lastName,
      content: commentContent,
    };

    const pub = await sanityClient.getDocument(publication._id!);
    console.log("pub", pub)
    if (!pub) {
      console.log("ERROR")
      throw new Error("Product not found");
    }
    // Update the product with the new review
    const updatedPub = {
      ...pub,
      comments: pub.comments ? pub.comments.concat(newComment) : [newComment], // Assuming your product schema field is named "review"
    };

    console.log(updatedPub, "updated")

    // Send the updated product data to Sanity
    try {
      const response = await sanityClient.patch(publication._id!).set(updatedPub).commit();

    toast.success("Updated");
    setCommentContent("");
    return response;

    } catch(error) {
      console.log(error,"ERROR")
    }

    // Send the comment object to the Sanity API
  };

  const filteredComments = publication.comments?.filter(
    (comment) => comment.status === "approved"
  );

  const unfilteredComments = publication.comments?.filter(
    (comment) => comment.status !== "approved"
  );
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    innerWidth: "max",
    beforeChange: (current: number, next: number) => setCurrentSlide(next),
  };

  function getPublicationLikes() {
    const filteredLikes =
      publication.likes?.filter((email) => email !== currentUser?.email) || [];
    const number_likes = isLiked
      ? filteredLikes.length + 1
      : filteredLikes.length;

    if (number_likes > 0) {
      return number_likes;
    }

    return "";
  }

  return (
    <div className="w-11/12 flex flex-col mx-4 mb-20">
      <div className="p-5 bg-white mt-5 rounded-t-2xl shadow-sm">
        <div className="flex items-center space-x-2">
          <Image
            className="rounded-full"
            src="/logo0.jpeg"
            width={60}
            height={60}
            alt="Xphones"
          />
          <div>
            <p className="font-medium">XPhones</p>
            <p className="text-xs text-gray-400">
              {publication._createdAt
                ? new Date(publication._createdAt).toLocaleDateString()
                : "Loading"}
            </p>
          </div>
        </div>
        <p className="pt-4">{publication.content}</p>
      </div>
      {(publication.images || publication.video) && (
        <div className="relative h-56 md:h-96 bg-white">
          <Slider {...settings}>
            {/* Render images as carousel slides */}
            {publication.images &&
              publication.images.map((imageUrl) => (
                <div
                  key={imageUrl}
                  className="relative h-56 md:h-96 text-center w-max"
                >
                  {/* Apply the blurred background effect to the parent container */}
                  <div
                    className="absolute top-0 left-0 w-full h-full filter blur-md"
                    style={{
                      backgroundImage: `url(${imageUrl})`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                  <Image
                    src={imageUrl}
                    className="object-contain"
                    fill
                    alt="Publication Image"
                  />
                </div>
              ))}

            {/* Render videos as carousel slides */}
            {publication.video &&
              publication.video.map((videoUrl) => (
                <div
                  key={videoUrl}
                  className="relative h-56 md:h-96 text-center flex justify-center items-center"
                >
                  {/* Apply the blurred background effect to the parent container */}
                  <div className="absolute top-0 left-0 w-full h-full  bg-black"></div>
                  <video
                    controls
                    className="object-contain relative mx-auto my-auto md:h-[23.8rem]"
                  >
                    <source src={videoUrl} type="video/mp4" />
                  </video>
                </div>
              ))}
          </Slider>
        </div>
      )}
      <div className="flex justify-between items-center rounded-b-2xl bg-white shadow-md text-gray-400 border-t px-4 pt-4">
        <div
          className={`inputIcon rounded-none rounded-bl-2xl ${
            isLiked ? "text-blue-500" : ""
          }`}
          onClick={onLikeHandler}
        >
          <HandThumbUpIcon
            className={`h-4 cursor-pointer ${isLiked ? "fill-current" : ""}`}
          />
          <p className="text-xs sm:text-base">Like {getPublicationLikes()}</p>
        </div>
        <div className="inputIcon rounded-none">
          <ChatBubbleOvalLeftIcon className="h-4" />
          <p className="text-xs sm:text-base">Comment</p>
        </div>
        <div className="inputIcon rounded-none rounded-br-2xl">
          <ShareIcon className="h-4" />
          <p className="text-xs sm:text-base">Share</p>
        </div>
      </div>
      {currentUser && (
        <div className="flex flex-col bg-white border rounded-xl rounded-b-none shadow-sm mt-4">
          <input
            className="p-3 pt-4 resize-none outline-none h-[5vh]  focus:border-blue-500 rounded-xl"
            placeholder="Write a comment..."
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
          />
          <div className="flex justify-end w-full pr-5 pb-5">
            <AiOutlineSend
              height={40}
              width={40}
              className="text-black text-end cursor-pointer"
              onClick={onCommentHandler}
            />
          </div>
        </div>
      )}
      <div className="flex rounded-xl">
        {filteredComments &&
          filteredComments.map((comment, index) => (
            <CommentComponent key={index} comment={comment} />
          ))}
      </div>
      <div className="flex rounded-xl flex-col">
        <h1 className="mt-[5vh] flex flex-col"> Unapproved Comments</h1>
        {unfilteredComments &&
          unfilteredComments.map((comment, index) => (
            <CommentUnapproved key={index} comment={comment} publication={publication} />
          ))}
      </div>

    </div>
  );
}

export default PostContent;
