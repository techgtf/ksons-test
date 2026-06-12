import Image from "next/image"

export const TriangleImg = ({ size = "w-[70px] lg:w-[120px]", }) => {
    return (<>
        <Image src={"/images/icons/Vector.svg"}
            alt=""
            width={120}
            height={120}
            className={`${size}`}
        />
    </>)
}