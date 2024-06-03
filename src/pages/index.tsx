import { NextPage } from "next";
import Carousel from "../components/Carousel";
import Categories2 from "../components/Categories2";
import Values from "../components/Values";
import Categories from "../components/Categories";
import Layout from "../components/Layout";

const Home: NextPage = () => {
  return (
    <Layout>
      <div>
        <Carousel />
        <h1 className="text-xl md:text-3xl text-center my-4">
          « La meilleure boutique d&apos;électronique de Paris, rien de plus,
          rien de moins... »
        </h1>
        <h2 className="text-slate-800 text-center text-base md:text-2xl">
          Marie S.
        </h2>
        <div
                  className="relative h-56 md:h-96 text-center flex justify-center items-center w-full mt-8"
                >
                  <video
                    controls
                    autoPlay
                    className="object-contain relative mx-auto my-auto md:h-[23.8rem]"
                  >
                    <source src="/video1.mp4" type="video/mp4" />
                  </video>
                </div>
        <div className="flex flex-col">
          <Categories2 />
          <Categories />
        </div>
        <Values />
      </div>
    </Layout>
  );
};

export default Home;
