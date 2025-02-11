import { FormEvent, useState } from "react";
import { renderRatingStars } from "../utils/stars";
import Image from "next/image";
import { sanityClient } from "../../lib/sanityClient";
import { User } from "@prisma/client";
import toast from "react-hot-toast";

interface Review {
  _key?: string;
  user: string;
  rating: number;
  reviewText: string;
  date: string;
  status: string;
  images: string[];
}

type Props = {
  id: string;
  currentUser: User | null;
  review?: Review[];
};

function ProductReview({ id, currentUser, review }: Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  function formatDateToNormalDate(dateString: string) {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
  };

  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  const handleReviewTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReviewText(event.target.value);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!currentUser) return;

    try {
      // Create a mock array of image URLs (replace with your actual image URLs)
      const imageUrls = selectedFiles ? Array.from(selectedFiles).map((_, index) => `/sample-image-${index}.jpg`) : [];

      const reviewData: Review = {
        _key: Date.now().toString(),
        user: `${currentUser.firstName} ${currentUser.lastName}`,
        rating,
        reviewText,
        date: new Date().toISOString(),
        status: "pending",
        images: imageUrls,
      };

      const product = await sanityClient.getDocument(id);
      if (!product) throw new Error("Product not found");

      const updatedProduct = {
        ...product,
        review: product.review ? product.review.concat(reviewData) : [reviewData],
      };

      await sanityClient.createOrReplace(updatedProduct);
      toast.success("Review added successfully");
      
      // Reset form
      setReviewText("");
      setRating(0);
      setSelectedFiles(null);
    } catch (error) {
      console.error("Error adding review:", error);
      toast.error("Failed to add review");
    }
  };

  return (
    <>
      {review?.map((rev) => (
        <article key={rev._key} className="mt-10 w-10/12 hidden md:block">
          <div className="flex items-center mb-4 space-x-4">
            <Image
              className="rounded-full"
              src="/prof.png"
              alt="pic"
              width={40}
              height={40}
            />
            <div className="space-y-1 font-medium">
              <p className="text-black">
                {rev.user}
                <time className="block text-sm text-gray-500">
                  Reviewed on {formatDateToNormalDate(rev.date)}
                </time>
              </p>
            </div>
          </div>
          
          <div className="flex items-center mb-1">
            <div className="flex flex-row space-x-2">
              {renderRatingStars(rev.rating).map((star, index) => (
                <span key={index}>{star}</span>
              ))}
            </div>
          </div>
          
          <p className="mb-2 text-gray-500">{rev.reviewText}</p>
          
          {rev.images && rev.images.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-4">
              {rev.images.map((img, index) => (
                <div
                  key={index}
                  className="relative h-24 w-24 cursor-pointer hover:opacity-80"
                  onClick={() => setSelectedImage(img)}
                >
                  <Image
                    src={img}
                    alt={`Review image ${index + 1}`}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              ))}
            </div>
          )}
        </article>
      ))}

      {/* Simple Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full m-4">
            <button
              className="absolute top-2 right-2 text-white text-xl bg-black bg-opacity-50 w-8 h-8 rounded-full"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
            <Image
              src={selectedImage}
              alt="Full size review image"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      {currentUser && (
        <div className="bg-gray-100 p-4 rounded mt-8 w-full hidden md:block">
          <h3 className="text-xl font-medium mb-2">Write a Review</h3>
          <div className="flex flex-col space-y-4">
            <div>
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
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                ))}
              </div>
            </div>

            <div>
              <span className="text-gray-700">Review:</span>
              <textarea
                className="w-full h-20 p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                value={reviewText}
                onChange={handleReviewTextChange}
              />
            </div>

            <div>
              <span className="text-gray-700">Images:</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 w-full"
              />
            </div>

            <button
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded w-fit"
              onClick={handleSubmit}
            >
              Submit Review
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductReview;