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
  onReviewsUpdate: (updatedReviews: Review[]) => void; // Add this prop
};

function ProductReviewMobile({ id, currentUser, review, onReviewsUpdate }: Props) {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingReviews, setDeletingReviews] = useState<Set<string>>(new Set());


  // Check if current user is admin
  const isAdmin = currentUser?.firstName === "Ali" && currentUser?.lastName === "Imran";

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
    e.stopPropagation();
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
  const initiateDeleteReview = (key: string) => {
    setReviewToDelete(key);
    handleDeleteReview(key);
  };

  const fetchLatestReviews = async () => {
    try {
      const product = await sanityClient.fetch(`
        *[_type == "product" && _id == $id][0] {
          review
        }
      `, { id });
      
      if (product && product.review) {
        onReviewsUpdate(product.review);
      }
    } catch (error) {
      console.error("Error fetching latest reviews:", error);
    }
  };

  const handleDeleteReview = async (key: string) => {
    if (!key || !review || deletingReviews.has(key)) return;
    
    try {
      setDeletingReviews(prev => new Set(prev).add(key));

      // Optimistically update UI
      const updatedReviews = review.filter(rev => rev._key !== key);
      onReviewsUpdate(updatedReviews);

      // Get current document first
      const product = await sanityClient.getDocument(id);
      if (!product) throw new Error("Product not found");

      // Update the document with filtered reviews
      const updatedProduct = {
        ...product,
        review: product.review.filter((rev: Review) => rev._key !== key)
      };

      // Perform the update
      await sanityClient.createOrReplace(updatedProduct);
      
      // Fetch latest data
      await fetchLatestReviews();
      
      toast.success("Review deleted successfully");
      
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
      // Revert optimistic update and fetch latest data
      await fetchLatestReviews();
    } finally {
      setDeletingReviews(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
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
    if (!currentUser || !review) return;

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

      const product = await sanityClient.getDocument(id);
      if (!product) throw new Error("Product not found");

      const updatedReviews = [...(product.review || []), reviewData];
      
      const updatedProduct = {
        ...product,
        review: updatedReviews,
      };

      await sanityClient.createOrReplace(updatedProduct);
      
      // Fetch latest data after adding review
      await fetchLatestReviews();

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
    <>
      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative w-full max-w-5xl h-[80vh] flex items-center justify-center"
            onClick={e => e.stopPropagation()}
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
        <article key={rev._key} className="mt-10 w-11/12 block md:hidden border-t-[0.5px] border-black border-opacity-50 pt-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
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
            {isAdmin && (
              <button
              onClick={() => rev._key && handleDeleteReview(rev._key)}
                className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-100 transition-colors"
                disabled={isDeleting}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
          
          <div className="flex items-center mb-6">
            <div className="flex flex-row space-x-2">
              {renderRatingStars(rev.rating).map((star, index) => (
                <span key={index}>{star}</span>
              ))}
            </div>
          </div>
          
          <p className="mb-6 text-gray-500">{rev.reviewText}</p>

          {rev.images && rev.images.length > 0 && (
            <div className="flex flex-wrap mb-6">
              {rev.images.map((img, index) => (
                <div
                  key={index}
                  className="relative cursor-pointer group h-[15vh] w-[20%] "
                  onClick={() => handleImageClick(img)}
                >
                  <div className="absolute inset-1 p-0.5">
                    <div className="relative w-full h-full">
                      <Image
                        src={img}
                        alt={`Review image ${index + 1}`}
                        fill
                        className="object-contain"
                      />
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 rounded-sm transition-opacity" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <aside className="mt-6">
            <p className="mt-1 text-xs text-gray-500">19 people found this helpful</p>
            <div className="flex items-center mt-3 space-x-3 divide-x divide-gray-200">
              <button className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-xs px-2 py-1.5">
                Helpful
              </button>
              <button className="pl-4 text-sm font-medium text-blue-600 hover:underline">
                Report abuse
              </button>
            </div>
          </aside>
        </article>
      ))}

      {/* Add Review Form */}
      {currentUser && (
        <div className="bg-gray-100 p-4 rounded mt-8 w-full md:hidden">
          <h3 className="text-xl font-medium mb-4">Write a Review</h3>
          
          <div className="mb-4">
            <span className="text-gray-700 block mb-2">Rating:</span>
            <div className="flex items-center">
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

          <div className="mb-4">
            <span className="text-gray-700 block mb-2">Review:</span>
            <textarea
              className="w-full h-20 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              value={reviewText}
              onChange={handleReviewTextChange}
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mt-4">
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
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit Review
          </button>
        </div>
      )}
    </>
  );
}

export default ProductReviewMobile;