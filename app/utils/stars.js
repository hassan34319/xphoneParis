const maxRating = 5; // Maximum possible rating value (5 stars)
const StarSvg = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 28 29"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.9999 20.8679L21.2099 25.375L19.2966 16.8804L25.6666 11.165L17.2783 10.4159L13.9999 2.41669L10.7216 10.4159L2.33325 11.165L8.69159 16.8804L6.78992 25.375L13.9999 20.8679Z"
      fill="#FFCB00"
    />
  </svg>
);
const LargeStarSvg = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 28 29"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.9999 20.8679L21.2099 25.375L19.2966 16.8804L25.6666 11.165L17.2783 10.4159L13.9999 2.41669L10.7216 10.4159L2.33325 11.165L8.69159 16.8804L6.78992 25.375L13.9999 20.8679Z"
      fill="#FFCB00"
    />
  </svg>
);

// SVG component for a half star
const HalfStarSvg = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 28 29"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Define the path for the half-star shape here */}
    <path
      d="M13.9999 20.8679L21.2099 25.375L19.2966 16.8804L25.6666 11.165L17.2783 10.4159L13.9999 2.41669L10.7216 10.4159L2.33325 11.165L8.69159 16.8804L6.78992 25.375L13.9999 20.8679Z"
      fill="#FFCB00"
    />
  </svg>
);

// SVG component for an empty star
const EmptyStarSvg = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 28 29"
    fill="gray"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Define the path for the empty-star shape here */}
    <path
      d="M13.9999 20.8679L21.2099 25.375L19.2966 16.8804L25.6666 11.165L17.2783 10.4159L13.9999 2.41669L10.7216 10.4159L2.33325 11.165L8.69159 16.8804L6.78992 25.375L13.9999 20.8679Z"
      fill="gray"
    />
  </svg>
);
const LargeEmptyStarSvg = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 28 29"
    fill="gray"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Define the path for the empty-star shape here */}
    <path
      d="M13.9999 20.8679L21.2099 25.375L19.2966 16.8804L25.6666 11.165L17.2783 10.4159L13.9999 2.41669L10.7216 10.4159L2.33325 11.165L8.69159 16.8804L6.78992 25.375L13.9999 20.8679Z"
      fill="gray"
    />
  </svg>
);

export const renderRatingStars = (rating) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;

  const stars = [];

  for (let i = 1; i <= fullStars; i++) {
    stars.push(<StarSvg  key={`star-${i}`} />);
  }

  if (halfStar) {
    stars.push(<HalfStarSvg key="half-star" />);
  }

  for (let i = stars.length + 1; i <= totalStars; i++) {
    stars.push(<EmptyStarSvg key={`empty-star-${i}`} />);
  }

  return stars;
};
export const renderRatingStarsLarge = (rating) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;

  const stars = [];

  for (let i = 1; i <= fullStars; i++) {
    stars.push(<LargeStarSvg  key={`star-${i}`} />);
  }

  if (halfStar) {
    stars.push(<HalfStarSvg key="half-star" />);
  }

  for (let i = stars.length + 1; i <= totalStars; i++) {
    stars.push(<LargeEmptyStarSvg key={`empty-star-${i}`} />);
  }

  return stars;
};
