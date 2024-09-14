"use client";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { sanityClient } from "../../lib/sanityClient"; // Import Sanity client
import { Publication } from "../utils/types";
import { User } from "@prisma/client";
import { FaImage, FaVideo } from 'react-icons/fa';

type Props = {
  handleAddPost: (post: Publication) => void;
  currentUser: User | null;
};

const PostCreation = ({ handleAddPost, currentUser }: Props) => {
  const [postText, setPostText] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string[]>([]);
  const [uploadedVideo, setUploadedVideo] = useState<string[]>([]);
  const [uploadedThumbnail, setThumbnail] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to upload image/video to Sanity and get URL
  const uploadToSanity = async (file: File): Promise<string> => {
    try {
      const asset = await sanityClient.assets.upload("file", file, {
        contentType: file.type,
        filename: file.name,
      });

      return asset.url; // Returning the uploaded file URL
    } catch (error) {
      console.error("Sanity upload failed:", error);
      throw error;
    }
  };

  const handleSubmitChange = async () => {
    setLoading(true);
    try {
      const publicationData = {
        username: `${currentUser?.firstName} ${currentUser?.lastName}`,
        userImage: currentUser?.image || undefined,
        approved: currentUser?.email === "xphonesparis@gmail.com",
        title,
        content: postText,
        images: uploadedImage || [],
        video: uploadedVideo || [],
      };

      await handleAddPost(publicationData);
      setUploadedImage([]);
      setUploadedVideo([]);
      setThumbnail([]);
      setTitle("");
      setPostText("");
      toast.success("Publication envoyée pour approbation");
    } catch (error) {
      console.error("Error creating publication:", error);
      toast.error("Failed to create publication");
    } finally {
      setLoading(false);
    }
  };

  const handlePostTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(event.target.value);
  };

  const handleTitleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(event.target.value);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setLoading(true);
      try {
        const fileArray = await Promise.all(Array.from(files).map((file) => uploadToSanity(file)));
        setUploadedImage((prevImages) => prevImages.concat(fileArray));
        setThumbnail((prevThumbnails) => prevThumbnails.concat(fileArray));
      } catch (error) {
        toast.error("Failed to upload images");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setLoading(true);
      try {
        const fileArray = await Promise.all(Array.from(files).map((file) => uploadToSanity(file)));
        setUploadedVideo((prevVideos) => prevVideos.concat(fileArray));
      } catch (error) {
        toast.error("Failed to upload videos");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-11/12 md:w-1/2">
      <textarea
        className="w-full border rounded-lg p-2 mb-4"
        placeholder="Qu'avez-vous à l'esprit ?"
        value={postText}
        onChange={handlePostTextChange}
      ></textarea>
      {uploadedThumbnail && uploadedThumbnail.length > 0 && (
        <div className="mt-2 flex flex-row flex-wrap space-x-2">
          {uploadedThumbnail.map((imageUrl, index) => (
            <Image
              key={index}
              src={imageUrl}
              alt={`Uploaded ${index + 1}`}
              width={50}
              height={50}
              className="mr-2"
            />
          ))}
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-row gap-x-2">
          <label className="bg-gray-200 rounded-lg px-4 py-2 cursor-pointer">
            <FaImage />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </label>
          <label className="bg-gray-200 rounded-lg px-4 py-2 cursor-pointer">
            <FaVideo />
            <input
              type="file"
              accept="video/*"
              multiple
              onChange={handleVideoUpload}
              style={{ display: "none" }}
            />
          </label>
        </div>
        <button
          className={`bg-blue-500 text-white rounded-lg px-4 py-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleSubmitChange}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Poste'}
        </button>
      </div>
    </div>
  );
};

export default PostCreation;

