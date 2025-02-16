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

function ProductReview({ id, currentUser, review: initialReviews }: Props) {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>(initialReviews || []);
  
  // Check if current user is admin
  const isAdmin = currentUser?.firstName === "Ali" && currentUser?.lastName === "Imran";

  // function formatDateToNormalDate(dateString: string) {
  //   const months = [
  //     "January", "February", "March", "April", "May", "June",
  //     "July", "August", "September", "October", "November", "December"
  //   ];
  //   const date = new Date(dateString);
  //   return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  // }
  const formatDateToNormalDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long", // Full month name (e.g., janvier, février)
      day: "numeric",
    });
  };

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

  const handleDeleteReview = async (reviewKey: string | undefined) => {
    if (!reviewKey) return;
    
    try {
      const product = await sanityClient.getDocument(id);
      if (!product) throw new Error("Product not found");

      // Update local state immediately
      setReviews(prevReviews => prevReviews.filter(rev => rev._key !== reviewKey));

      // Filter out the review with the matching key
      const updatedReviews = product.review.filter((rev: Review) => rev._key !== reviewKey);

      const updatedProduct = {
        ...product,
        review: updatedReviews,
      };

      await sanityClient.createOrReplace(updatedProduct);
      toast.success("Review deleted successfully");
    } catch (error) {
      // Revert local state if the server update fails
      setReviews(initialReviews || []);
      toast.error("Failed to delete review");
      console.error("Error deleting review:", error);
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

      const result = await sanityClient.createOrReplace(updatedProduct);
      // Update local state with the new review
      setReviews(prevReviews => [...prevReviews, reviewData]);
      return result;
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
      {reviews?.map((rev) => (
        <article key={rev._key} className="mt-10 w-11/12 block md:hidden border-t-[0.5px] border-black border-opacity-50 pt-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Image
                className="rounded-full "
                src="/prof.png"
                alt="pic"
                width={40}
                height={40}
              />
              <div className="space-y-1 font-medium">
                <p className="text-black">
                  {rev.user}
                  <time className="block text-sm text-gray-500">
                    Avis laissé le {formatDateToNormalDate(rev.date)}
                  </time>
                </p>
              </div>
            </div>
            {isAdmin && (
              <button
                onClick={() => handleDeleteReview(rev._key)}
                className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-100 transition-colors"
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
                  className="relative cursor-pointer group h-[10vh] w-[10vh] aspect-square "
                  onClick={() => handleImageClick(img)}
                >
                  <div className="absolute inset-1 p-0.5">
                    <div className="relative w-full h-full">
                      <Image
                        src={img}
                        alt={`Review image ${index + 1}`}
                        fill
                        className="object-cover rounded-lg transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 rounded-sm transition-opacity" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <aside className="mt-6">
            <p className="mt-1 text-xs text-gray-500">19 personnes ont trouvé cet avis utile</p>
            <div className="flex items-center mt-3 space-x-3 divide-x divide-gray-200">
              <button className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-xs px-2 py-1.5">
                Utile
              </button>
              <button className="pl-4 text-sm font-medium text-blue-600 hover:underline">
                Signaler un abus
              </button>
            </div>
          </aside>
        </article>
      ))}

      {/* Add Review Form */}
      {currentUser && (
        <form onSubmit={handleSubmit} className="mt-8 p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-xl font-medium mb-6">Laissez un avis</h3>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Note</label>
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
            <label className="block text-gray-700 mb-2">Avis</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              value={reviewText}
              onChange={handleReviewTextChange}
              placeholder="Écrivez votre avis ici..."
            />
          </div>

          <div className="mb-6">
          <label className="block text-gray-700 mb-2">Images</label>
          <label
    htmlFor="file-upload"
    className="cursor-pointer bg-blue-400 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-800"
  >
    Poster des images
  </label>
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
                  <div key={index} className="relative aspect-square cursor-pointer group">
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
            Soumettre l'avis
          </button>
            
        </form>
      )}
    </>
  );
}

export default ProductReview;