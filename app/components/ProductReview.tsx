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
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  function formatDateToNormalDate(dateString: string) {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const date = new Date(dateString);
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseModal = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event propagation
    setSelectedImage(null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: string[] = [];
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newImages.push(e.target.result as string);
          if (newImages.length === files.length) {
            setUploadedImages(prev => [...prev, ...newImages]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  const handleReviewTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReviewText(event.target.value);
  };

  const addReviewToProduct = async (productId: string, reviewData: Review) => {
    try {
      const product = await sanityClient.getDocument(productId);
      if (!product) throw new Error("Product not found");

      const updatedProduct = {
        ...product,
        review: product.review ? product.review.concat(reviewData) : [reviewData],
      };

      return await sanityClient.createOrReplace(updatedProduct);
    } catch (error) {
      console.error("Error adding review to product:", error);
      throw error;
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!currentUser) return;

    try {
      const reviewData: Review = {
        _key: Date.now().toString(),
        user: `${currentUser.firstName} ${currentUser.lastName}`,
        rating,
        reviewText,
        date: new Date().toISOString(),
        status: "pending",
        images: uploadedImages,
      };

      await addReviewToProduct(id, reviewData);
      toast.success("Review added successfully");
      setReviewText("");
      setRating(0);
      setUploadedImages([]);
    } catch (error) {
      toast.error("Failed to add review");
      console.error("Error adding review:", error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative w-full max-w-5xl h-[80vh] flex items-center justify-center"
            onClick={e => e.stopPropagation()} // Prevent closing when clicking the image container
          >
            <button
              onClick={handleCloseModal}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 z-50 p-2"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative w-full h-full">
              <Image
                src={selectedImage}
                alt="Enlarged view"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Reviews Display */}
      {review?.map((rev) => (
        <article key={rev._key} className="mt-10 p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center mb-4 space-x-4">
            <Image
              className="rounded-full"
              src="/prof.png"
              alt="profile"
              width={40}
              height={40}
            />
            <div>
              <p className="font-medium text-gray-900">{rev.user}</p>
              <time className="text-sm text-gray-500">
                Reviewed on {formatDateToNormalDate(rev.date)}
              </time>
            </div>
          </div>
          
          <div className="flex items-center mb-4">
            {renderRatingStars(rev.rating).map((star, index) => (
              <span key={index}>{star}</span>
            ))}
          </div>
          
          <p className="mb-4 text-gray-700">{rev.reviewText}</p>
          
          {rev.images && rev.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {rev.images.map((img, index) => (
                <div 
                  key={index} 
                  className="relative aspect-square cursor-pointer group"
                  onClick={() => handleImageClick(img)}
                >
                  <Image
                    src={img}
                    alt={`Review image ${index + 1}`}
                    fill
                    className="object-cover rounded-lg transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 rounded-lg transition-opacity" />
                </div>
              ))}
            </div>
          )}
        </article>
      ))}

      {/* Add Review Form */}
      {currentUser && (
        <form onSubmit={handleSubmit} className="mt-8 p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-xl font-medium mb-6">Write a Review</h3>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleRatingChange(value)}
                  className="focus:outline-none"
                >
                  <svg
                    className={`w-6 h-6 ${
                      value <= rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Review</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              value={reviewText}
              onChange={handleReviewTextChange}
              placeholder="Write your review here..."
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {uploadedImages.map((img, index) => (
                  <div key={index} className="relative aspect-square group">
                    <Image
                      src={img}
                      alt={`Upload preview ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit Review
          </button>
        </form>
      )}
    </div>
  );
}

export default ProductReview;