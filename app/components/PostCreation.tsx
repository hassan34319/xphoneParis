"use client";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { sanityClient } from "../../lib/sanityClient";
import { Publication } from "../utils/types";

const PostCreation = () => {
  const [postText, setPostText] = useState("");
  const [uploadedImage, setUploadedImage] = useState([]);
  const [uploadedVideo, setUploadedVideo] = useState([]);
  const [uploadedThumbnail, setThumbnail] = useState([]);
  const [title, setTitle] = useState("");
  console.log(uploadedThumbnail)
  const handleSubmitChange = async () => {
    try {
      const publicationData = {
        title: title,
        content: postText, // Update the content field to use the postText directly
        images: uploadedImage,
        video: uploadedVideo,
        
        // Add other fields if needed based on your form inputs
      };

      const createdPublication = await createPublication(publicationData);
      setUploadedImage([])
      setUploadedVideo([])
      setThumbnail([])
      setTitle("")
      setPostText("")
      toast.success("Posted")
      // Handle the successful submission (e.g., show a success message or redirect to the post page)
    } catch (error) {
      // Handle the error (e.g., show an error message)
    }
  };
  async function createPublication(publicationData: Publication) {
    try {
      // Make a post request to Sanity to create a new publication with the given data
      const response = await sanityClient.create({
        ...publicationData,
        _type: "publication",
      });
      console.log("Publication created successfully:", response);
      return response;
    } catch (error) {
      console.error("Error creating publication:", error);
      throw error;
    }
  }
  const handlePostTextChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPostText(event.target.value);
  };
  const handleTitleTextChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTitle(event.target.value);
  };
  const handleImageUpload = () => {
    // Initialize Cloudinary Widget
    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: "dxu48h2sd",
        uploadPreset: "ao0bo4fi",
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          setUploadedImage((prevUploadedImage) =>
            prevUploadedImage.concat(result.info.secure_url)
          );
          setThumbnail((prevImageThumbnail) =>
            prevImageThumbnail.concat(result.info.thumbnail_url)
          );
          console.log(result.info.secure_url);
        }
      }
    );

    // Open the widget when the button is clicked
    widget.open();
  };

  const handleVideoUpload = () => {
    // Initialize Cloudinary Widget
    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: "dxu48h2sd",
        uploadPreset: "b7qclf41",
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          setUploadedVideo((prevUploadedVideo) =>
            prevUploadedVideo.concat(result.info.secure_url)
          );
          setThumbnail((prevVideoThumbnal) =>
            prevVideoThumbnal.concat(result.info.thumbnail_url)
          );
          console.log(result.info.secure_url);
        }
      }
    );

    // Open the widget when the button is clicked
    widget.open();
  };
  return (
    <div className="p-4 border mb-4 md:w-10/12">
      <label className="text-black font-bold text-sm text-bold"> Title</label>
      <textarea
        className="w-full h-20 resize-none p-2 rounded border"
        placeholder="Enter Title Here"
        onChange={handleTitleTextChange}
        value={title}
      />
      <label className="text-black font-bold text-sm text-bold mt-[6vh]">
        {" "}
        Content
      </label>
      <textarea
        className="w-full h-20 resize-none p-2 rounded border"
        placeholder="What's on your mind?"
        value={postText}
        onChange={handlePostTextChange}
      ></textarea>
      {uploadedThumbnail && uploadedThumbnail.length > 0 && (
        <div className="mt-2 flex flex-row space-x-4 ">
          {uploadedThumbnail.map((imageUrl, index) => (
            <Image
              key={index}
              src={imageUrl}
              alt={`Uploaded ${index + 1}`}
              width={100}
              height={100}
              className="mr-2" // Averdjust spacing between images if needed
            />
          ))}
        </div>
      )}
      <div className="flex justify-between items-center mt-2">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-sm md:text-lg"
          onClick={handleImageUpload}
        >
          Upload Image
        </button>
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded text-sm md:text-lg"
          onClick={handleVideoUpload}
        >
          Upload Video
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          onClick={handleSubmitChange}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default PostCreation;
