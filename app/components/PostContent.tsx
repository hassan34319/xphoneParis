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
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
  EmailIcon,
  WhatsappIcon,
  TwitterIcon,
  FacebookIcon,
  XIcon,
} from "react-share";
import { ShareIcon } from "@heroicons/react/24/solid";
import { User } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Comment, Publication } from "../utils/types";
import { sanityClient } from "../../lib/sanityClient";
import toast from "react-hot-toast";
import CommentComponent from "./Comment";
import CommentUnapproved from "./CommentUnapproved";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Modal } from 'react-bootstrap';
import Link from "next/link";


type Props = {
  publication: Publication;
  currentUser: User | null;
};

interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

function SampleNextArrow(props: ArrowProps) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "red", // Red color for the background
        borderRadius: "50%", // Fully rounded
        // border: "2px solid red", // Red border
      }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props: ArrowProps) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "red", // Red color for the background
        borderRadius: "50%", // Fully rounded
        // border: "2px solid red", // Red border
      }}
      onClick={onClick}
    />
  );
}

function PostContent({ publication, currentUser }: Props) {

  const shareUrl= `https://test-xphones.vercel.app/#${publication._id}`

  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => setIsOpen(!isOpen);

 

  const [isLiked, setIsLiked] = useState(
    publication.likes && currentUser && currentUser.email
      ? publication.likes.includes(currentUser.email)
      : false
  );
  const [likesCount,setLikesCount] = useState(publication?.likes?.length)
  const [likes, setLikes] = useState(publication?.likes || []);
  // State for approved comments

  const [approvedComments, setApprovedComments] = useState<Comment[]>([]);
  // State for unapproved comments
  const [unapprovedComments, setUnapprovedComments] = useState<Comment[]>([]);

  useEffect(() => {
    // Filter comments based on status and update respective states
    const filteredApprovedComments =
      publication.comments?.filter(
        (comment) => comment.status === "approved"
      ) || [];
    const filteredUnapprovedComments =
      publication.comments?.filter(
        (comment) => comment.status !== "approved"
      ) || [];
    setApprovedComments(filteredApprovedComments);
    setUnapprovedComments(filteredUnapprovedComments);
  }, [publication.comments]);

  // Function to handle approval of a comment
  const handleCommentApproval = async (comment: Comment) => {
    const newComment: Comment = {
      _key: comment._key,
      user: comment.user,
      content: comment.content,
      status: "approved",
    };

    const pub = await sanityClient.getDocument(publication._id!);
    console.log("pub", pub);
    if (!pub) {
      console.log("ERROR");
      throw new Error("Product not found");
    }
    // Update the product with the new review
    const filteredCom = publication.comments!.filter(
      (commenter) => commenter._key !== comment._key
    );
    const updatedPub = {
      ...pub,
      comments:
        filteredCom.length > 0 ? filteredCom.concat(newComment) : [newComment], // Assuming your product schema field is named "review"
    };
    console.log(pub, "updated");

    // Send the updated product data to Sanity
    try {
      const response = await sanityClient
        .patch(publication._id!)
        .set(updatedPub)
        .commit();

      toast.success("Updated");

      // Update approved and unapproved comments states after approval
      setApprovedComments((prevApprovedComments) => [
        ...prevApprovedComments,
        comment,
      ]);
      setUnapprovedComments((prevUnapprovedComments) =>
        prevUnapprovedComments.filter((c) => c._key !== comment._key)
      );

      toast.success("Comment approved successfully!");
    } catch (error) {
      console.error("Error approving comment:", error);
      toast.error("Failed to approve comment.");
    }
  };
  const onLikeHandlerrr = async () => {
    if (!currentUser || !currentUser.email) {
      toast.error("Please login to Like a post");
      return;
    }
  
    const isAlreadyLiked = likes.includes(currentUser.email);
    const updatedLikes = isAlreadyLiked
      ? likes.filter((email) => email !== currentUser.email)
      : [...likes, currentUser.email];

      console.log(updatedLikes)

      setLikesCount(updatedLikes.length)
  
    try {
      // Update the likes array in Sanity
      await sanityClient
        .patch(publication._id!)
        .set({ likes: updatedLikes })
        .commit();
  
      // Update state based on whether it was liked or unliked
      setLikes(updatedLikes);
      setIsLiked(!isLiked); // Toggle like status
    } catch (error) {
      console.error("Error updating likes:", error);
      toast.error("Error updating likes");
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
    const newComment: Comment = {
      _key: Date.now().toLocaleString(),
      user: currentUser.firstName + " " + currentUser.lastName,
      content: commentContent,
    };

    const pub = await sanityClient.getDocument(publication._id!);
    console.log("pub", pub);
    if (!pub) {
      console.log("ERROR");
      throw new Error("Product not found");
    }
    // Update the product with the new review
    const updatedPub = {
      ...pub,
      comments: pub.comments ? pub.comments.concat(newComment) : [newComment], // Assuming your product schema field is named "review"
    };

    console.log(updatedPub, "updated");

    // Send the updated product data to Sanity
    try {
      const response = await sanityClient
        .patch(publication._id!)
        .set(updatedPub)
        .commit();

      toast.success("Commentaire envoyé pour approbation");
      setCommentContent("");
      setUnapprovedComments((prevApprovedComments) => [
        ...prevApprovedComments,
        newComment,
      ]);
      return response;
    } catch (error) {
      console.log(error, "ERROR");
    }

    // Send the comment object to the Sanity API
  };

  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    innerWidth: "max",
    beforeChange: (current: number, next: number) => setCurrentSlide(next),
    // className: "custom-slider",
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <div
      id={publication._id}
      className="w-11/12 md:w-1/2  flex flex-col mx-4 mb-20"
    >
      <div className="p-5 bg-white mt-5 rounded-t-2xl shadow-sm">
        <div className="flex items-center space-x-2">
          {publication.userImage && (
            <Image
              className="rounded-full"
              src={publication.userImage}
              width={60}
              height={60}
              alt="Xphones"
            />
          )}
          {!publication.userImage && publication.username == "Xphones" && (
            <Image
              className="rounded-full"
              src="/logo0.jpeg"
              width={60}
              height={60}
              alt="Xphones"
            />
          )}

          {!publication.userImage && publication.username != "Xphones" && (
            <Image
              className="rounded-full"
              src="/prof.png"
              width={60}
              height={60}
              alt="Xphones"
            />
          )}
          <div>
            <p className="font-medium">{publication.username}</p>
            <p className="text-xs text-gray-400">
              {publication._createdAt
                ? new Date(publication._createdAt).toLocaleDateString()
                : "Just Now"}
            </p>
          </div>
        </div>
        <h2 className="pt-4 font-bold text-xl">{publication.title}</h2>
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
      <div className="bg-white flex flex-row justify-between border-b-2 border-gray-200 pt-4 my-auto items-center px-4 pb-2">
        <p className="text-xs flex flex-row items-center gap-x-2">
          {" "}
          <HandThumbUpIcon
            className={`h-4  text-green-600 fill-green-800`}
          />{" "}
          {likesCount}
        </p>
       {publication.buttonText && publication.productReference &&  <Link href={`/products/${publication.productReference._ref}`}  className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">{publication.buttonText}</Link>}
      </div>
      <div className="flex justify-between items-center rounded-b-2xl bg-white shadow-md text-gray-400 border-t px-4 pt-4">
        <div
          className={`inputIcon rounded-none rounded-bl-2xl ${
            isLiked ? "text-blue-500" : ""
          }`}
          onClick={onLikeHandlerrr}
        >
          <HandThumbUpIcon
            className={`h-4 cursor-pointer ${isLiked ? "fill-current" : ""}`}
          />
          <p className="text-xs sm:text-base">{"J'aime"}</p>
        </div>
        <div className="inputIcon rounded-none">
          <ChatBubbleOvalLeftIcon className="h-4" />
          <p className="text-xs sm:text-base">commentaire</p>
        </div>
        <div className="inputIcon rounded-none rounded-br-2xl cursor-pointer">
          <ShareIcon className="h-4" onClick={toggleModal} />
          <p className="text-xs sm:text-base">Partager</p>
        </div>
        {isOpen && (

<div className="fixed z-50 inset-0 flex justify-center items-center bg-black bg-opacity-50">
<div className="bg-white rounded-lg p-4">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-semibold">Share Post</h2>
    <button onClick={toggleModal}>
      <XIcon className="h-5 w-5" />
    </button>
  </div>
  <div className="flex flex-row gap-x-2">
    <FacebookShareButton url={shareUrl} title={"facebook"}>
      <FacebookIcon className="h-6 w-6 mr-2" />
    </FacebookShareButton>
    <TwitterShareButton url={shareUrl} title={"twitter"}>
      <TwitterIcon className="h-6 w-6 mr-2" />
    </TwitterShareButton>
    <WhatsappShareButton url={shareUrl} title={"whatsapp"}>
      <WhatsappIcon className="h-6 w-6 mr-2" />
    </WhatsappShareButton>
    <EmailShareButton url={shareUrl} subject={"email"} body="Check out this post!">
      <EmailIcon className="h-6 w-6 mr-2" />
    </EmailShareButton>
  </div>
</div>
</div>
      )}
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
      {!currentUser && <div className="mt-4"></div>}
      <div className="flex flex-col rounded-xl">
        {approvedComments &&
          approvedComments.map((comment, index) => (
            <CommentComponent key={index} comment={comment} />
          ))}
      </div>
      <div className="flex rounded-xl flex-col">
        {currentUser && currentUser.email == "xphonesparis@gmail.com" && (
          <h1 className="mt-[5vh] flex flex-col"> Unapproved Comments</h1>
        )}
        {currentUser &&
          currentUser.email == "xphonesparis@gmail.com" &&
          unapprovedComments &&
          unapprovedComments.map((comment, index) => (
            <CommentUnapproved
              handleCommentApproval={handleCommentApproval}
              key={index}
              comment={comment}
              publication={publication}
            />
          ))}
      </div>
    </div>
  );
}

export default PostContent;
