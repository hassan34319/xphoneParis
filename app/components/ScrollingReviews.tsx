"use client"
import React, { useEffect, useState } from 'react'
import { scrollingReviews } from '../utils/types';

type Props = {
    scrollingReviews : string[]
}

function ScrollingReviews({scrollingReviews}: Props) {
    const [reviews, setReviews] = useState(scrollingReviews);
      const [currentIndex, setCurrentIndex] = useState(0);

      const currentReviewParts = reviews[currentIndex].split(" - ");
      const reviewContent = currentReviewParts[0];
      const author = currentReviewParts[1];
    
      // Function to handle changing reviews
      const changeReview = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
      };
    
      // Automatically change the review every few seconds
      // Adjust the interval time as needed
      useEffect(() => {
        const interval = setInterval(changeReview, 5000); // Change review every 5 seconds
        return () => clearInterval(interval);
      }, []);
    
      return (
        <div className="text-base md:text-xl text-center my-4 w-[80%] mx-auto">
        <h1 className="opacity-100"> {"«"} {reviewContent} {"»"} </h1>
              <h2 className="text-slate-800 text-center text-sm md:text-lg my-4">
        {author}
      </h2>
      </div>
  )
}

export default ScrollingReviews