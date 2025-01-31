

import Image from "next/image";

const FullScreenImagePage = () => {
  return (
    <div className="w-full  flex items-center justify-center p-4">
      <Image
        src="/df.png"
        alt="Full Screen Image"
        width={0}
        height={0}
        sizes="100vw"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default FullScreenImagePage;
