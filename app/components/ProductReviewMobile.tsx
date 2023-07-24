"use client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ProductSelection from "./ProductSelection";
import { product } from "../utils/types";
import { renderRatingStars } from "../utils/stars";
import { urlFor } from "../../lib/sanityClient";
import ClientOnly from "./ClientOnly";
import Image from "next/image";
import Script from "next/script";

type Props = {};

function ProductReviewMobile({}: Props) {
  const [uploadedImage, setUploadedImage] = useState("");
  const [isCloudinaryReady, setIsCloudinaryReady] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  console.log(uploadedImage);

  const handleImageUpload = () => {
    // Initialize Cloudinary Widget
    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: "dxu48h2sd",
        uploadPreset: "ao0bo4fi",
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          setUploadedImage(result.info.thumbnail_url);
        }
      }
    );

    // Open the widget when the button is clicked
    widget.open();
  };

  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  const handleReviewTextChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setReviewText(event.target.value);
  };

  const handleSubmitReview = () => {
    // Implement your logic to handle the submission of the review
    // You can access the rating and review text using the rating and reviewText variables
    // You can send this data to your backend or update the state accordingly
    console.log("Rating:", rating);
    console.log("Review Text:", reviewText);
    // Clear the rating and review text after submission
    setRating(0);
    setReviewText("");
  };
  return (
    <>
      <article className="mt-10 w-11/12 md:hidden border-t-[0.5px] border-black border-opacity-50 pt-10">
        <div className="flex items-center mb-4 space-x-4">
          <Image
            className="rounded-full"
            src="/prof.png"
            alt="pic"
            width={40}
            height={40}
          />
          <div className="space-y-1 font-medium text-black dark:text-white">
            <p className="text-black">
              Jese Leos
              <time
                dateTime="2014-08-16 19:00"
                className="block text-sm text-gray-500 dark:text-gray-400"
              >
                Joined on August 2014
              </time>
            </p>
          </div>
        </div>
        <div className="flex items-center mb-1">
          <div className="flex flex-row space-x-2">
            {renderRatingStars(5).map((star, index) => (
              <span key={index}>{star}</span>
            ))}
          </div>
        </div>
        <footer className="mb-5 text-sm text-gray-500 dark:text-gray-400">
          <p>
            Reviewed in the United Kingdom on{" "}
            <time dateTime="2017-03-03 19:00">March 3, 2017</time>
          </p>
        </footer>
        <p className="mb-2 text-gray-500 dark:text-gray-400">
          This is my third Invicta Pro Diver. They are just fantastic value for
          money. This one arrived yesterday and the first thing I did was set
          the time, popped on an identical strap from another Invicta and went
          in the shower with it to test the waterproofing.... No problems.
        </p>
        <div className="flex flex-row w-full h-[25vh] space-x-4">
          <div className="h-[20vh] w-[20vh] relative">
            <Image
              className="object-contain"
              src="/iphone13promax.png"
              alt="Image 1"
              fill
            />
          </div>
          <div className="h-[20vh]  w-[20vh]  relative">
            <Image
              className="object-contain"
              src="/redIphone.png"
              alt="Image 1"
              fill
            />
          </div>
          <div className="h-[20vh]  w-[20vh]  relative">
            <Image
              className="object-contain"
              src="/samsungs22.png"
              alt="Image 1"
              fill
            />
          </div>
          <div className="h-[20vh]  w-[20vh] relative">
            <Image
              className="object-contain"
              src="/ipadair.png"
              alt="Image 1"
              fill
            />
          </div>
        </div>
        <aside>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            19 people found this helpful
          </p>
          <div className="flex items-center mt-3 space-x-3 divide-x divide-gray-200 dark:divide-gray-600">
            <a
              href="#"
              className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-xs px-2 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            >
              Helpful
            </a>
            <a
              href="#"
              className="pl-4 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
            >
              Report abuse
            </a>
          </div>
        </aside>
      </article>
      {/* Add review box */}
      {/* Add review box */}
      <div className="bg-gray-100 p-4 rounded mt-8 w-full md:hidden">
        <h3 className="text-xl font-medium mb-2">Write a Review</h3>
        <div className="flex flex-col justify-center items-center mb-4">
          <div className="mr-2">
            <span className="text-gray-700">Rating:</span>
            <div className="flex items-center mt-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <svg
                  key={value}
                  className={`w-4 h-4 cursor-pointer ${
                    value <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => handleRatingChange(value)}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 20"
                >
                  {/* Replace with your preferred SVG code for a yellow star */}
                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                </svg>
              ))}
            </div>
          </div>
          <div className="w-full">
            <span className="text-gray-700">Review:</span>
            <textarea
              className="w-full h-20 p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              value={reviewText}
              onChange={handleReviewTextChange}
            ></textarea>
            {uploadedImage && (
              <Image
                src={uploadedImage}
                alt="Uploaded"
                width={100}
                height={100}
              />
            )}
          </div>
        </div>
        <button
          className="bg-blue-500 px-4 py-2 mr-4 text-white rounded cursor-pointer"
          onClick={handleImageUpload}
        >
          Upload Image
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:bg-red-600"
          onClick={handleSubmitReview}
        >
          Submit Review
        </button>
      </div>
    </>
  );
}

export default ProductReviewMobile;
