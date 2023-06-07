import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRouter } from "next/router";
import Image from "next/image";
import { BsPhone, BsPiggyBank } from "react-icons/bs";
import { IoMdRibbon } from "react-icons/io";
import { RiRefund2Line } from "react-icons/ri";

const Carousel = () => {
  return (
    <div>
      <Swiper
        className="w-11/12 mx-auto bg-white my-6 rounded-2xl px-4 shadow-xl flex flex-row justify-center items-center"
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={500}
        slidesPerView={1}
        loop
        autoplay
        speed={300}
        navigation
      >
        <SwiperSlide className="p-10">
          <Slide1 />
        </SwiperSlide>
        <SwiperSlide className="p-10">
          <Slide2 />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

const Slide1 = () => {
  return (
    <div className="flex flex-col md:flex-row gap-8 justify-center">
      <Image src="/redIphone.png" alt="redIphone" height={400} width={300} />
      <div>
        <h1 className="text-3xl md:text-5xl font-bold text-black">
          MARRE DU RECONDITIONÉ ?
        </h1>
        <h2 className="text-2xl md:text-3xl">
          OPTEZ POUR LA QUALITÉ ORIGINALE
        </h2>
        <div className="flex flex-col justify-start mt-8">
          <div className="flex flex-row items-center justify-start mb-2">
            <BsPhone className="text-xl md:text-2xl mr-2" />
            <h1 className="text-xl md:text-2xl">Téléphones d&apos;origine</h1>
          </div>

          <div className="flex flex-row items-center justify-start my-2">
            <IoMdRibbon className="text-xl md:text-2xl mr-2" />
            <h1 className="text-xl md:text-2xl">Garanti 6 mois minimum</h1>
          </div>

          <div className="flex flex-row items-center justify-start my-2">
            <RiRefund2Line className="text-xl md:text-2xl mr-2" />
            <h1 className="text-xl md:text-2xl">Satisfait ou remboursé</h1>
          </div>

          <div className="flex flex-row items-center justify-start my-2">
            <BsPiggyBank className="text-xl md:text-2xl mr-2" />
            <h1 className="text-xl md:text-2xl">Jusqu&apos;a 70% moins cher</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

const Slide2 = () => {
  const router = useRouter();
  const buyHandler = (id: string) => router.push(`/products/${id}`);
  return (
    <div className="flex flex-col md:flex-row gap-8 justify-center">
      <Image
        src="/blackIphone.jpeg"
        alt="black iphone 11"
        height={400}
        width={300}
      />
      <div>
        <h1 className="text-5xl">Meilleurs prix constatés en Europe !</h1>
        <h1 className="font-bold text-5xl mt-4">Iphone 11</h1>
        <h2 className="mt-4 text-2xl">
          A partir de 350&euro; <span className="line-through">800&euro;</span>
        </h2>
        <button
          className="bg-black text-white px-8 py-2 rounded text-2xl mt-8 shadow-xl hover:shadow-2xl"
          onClick={() => buyHandler("6e8adb0b-6322-4347-a15e-f82096d3118a")}
        >
          Acheter
        </button>
      </div>
    </div>
  );
};

export default Carousel;
