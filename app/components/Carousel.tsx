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
  console.log("I am banner", Banners);
  const mappedBanners = Banners.map((banner) => ({
    ...banner,
    mobileBanner: urlFor(banner.mobileBanner).url(),
    desktopBanner: urlFor(banner.desktopBanner).url(),
  }));
  const isDesktop = useMediaQuery({ minWidth: 1020 });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);
  return (
    <div>
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
        {mappedBanners.map((banner) => (
          <SwiperSlide key={banner._id} className="">
            <Link href={banner.link}>
                <div className="h-[34rem] md:h-[20rem] lg:h-[24rem] xl:h-[35rem] relative">
                {hydrated && (
                  <Image
                    src={
                      isDesktop
                        ? banner.desktopBanner
                        : banner.mobileBanner
                    }
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

export default Carousel

