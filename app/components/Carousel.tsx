"use client";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { BsPhone, BsPiggyBank } from "react-icons/bs";
import { IoMdRibbon } from "react-icons/io";
import { RiRefund2Line } from "react-icons/ri";
import { urlFor } from "../../lib/sanityClient";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";

type Banner = {
  mobileBanner: string;
  desktopBanner: string;
  link: string;
  _id: string;
};

type Props = {
  Banners: Banner[];
};

const Carousel: React.FC<Props> = ({ Banners }) => {
  const [randomizedBanners, setRandomizedBanners] = useState<Banner[]>([]);
  const isDesktop = useMediaQuery({ minWidth: 1020 });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const shuffleArray = (array: Banner[]) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    const shuffledBanners = shuffleArray(Banners).map((banner) => ({
      ...banner,
      mobileBanner: urlFor(banner.mobileBanner).url(),
      desktopBanner: urlFor(banner.desktopBanner).url(),
    }));

    setRandomizedBanners(shuffledBanners);
    setHydrated(true);
  }, [Banners]);

  return (
    <div className="carousel-container">
      <style jsx global>{`
        .carousel-container .swiper-button-prev,
        .carousel-container .swiper-button-next {
          width: 120px; /* Larger click area */
          height: 120px; /* Larger click area */
          background-color: transparent; /* Make the background transparent */
          border-radius: 50%;
          color: white;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Create the visible circle */
        .carousel-container .swiper-button-prev::before,
        .carousel-container .swiper-button-next::before {
          content: '';
          position: absolute;
          width: 50px; /* Original visual size */
          height: 50px; /* Original visual size */
          background-color: rgba(0, 0, 0, 0.8);
          border-radius: 70%;
          z-index: -1;
        }

        .carousel-container .swiper-button-prev:after,
        .carousel-container .swiper-button-next:after {
          font-size: 20px;
          font-weight: bold;
        }

        /* Hover effect on the visible circle */
        .carousel-container .swiper-button-prev:hover::before,
        .carousel-container .swiper-button-next:hover::before {
          background-color: rgba(0, 0, 0, 0.9);
        }

        .carousel-container .swiper-button-disabled {
          opacity: 0.5;
        }

        /* Position adjustments */
        .carousel-container .swiper-button-prev {
          left: 0;
        }

        .carousel-container .swiper-button-next {
          right: 0;
        }

        /* Optional: Add focus styles for accessibility */
        .carousel-container .swiper-button-prev:focus,
        .carousel-container .swiper-button-next:focus {
          outline: none;
        }

        .carousel-container .swiper-button-prev:focus::before,
        .carousel-container .swiper-button-next:focus::before {
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
        }
      `}</style>
      <Swiper
        className="w-full mx-auto flex flex-row justify-center items-center mt-0"
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={500}
        slidesPerView={1}
        loop
        autoplay
        speed={300}
        navigation
      >
        {randomizedBanners.map((banner) => (
          <SwiperSlide key={banner._id}>
            <Link href={banner.link}>
              <div className="h-[34rem] md:h-[20rem] lg:h-[24rem] xl:h-[35rem] relative">
                {hydrated && (
                  <Image
                    src={isDesktop ? banner.desktopBanner : banner.mobileBanner}
                    alt="banner"
                    fill
                    className="object-fill"
                  />
                )}
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;