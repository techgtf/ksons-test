import Image from "next/image";

export const TriangleImg = ({
  size = "w-[70px] lg:w-[120px]",
  src = "/images/icons/Vector.svg",
}) => {
  return (
    <>
      <Image src={src} alt="" width={120} height={120} className={`${size}`} />
    </>
  );
};
