import Image from "next/image"

export const Banner = () => {
    return (
        <div className="banner border-b border-(--blue)/20 py-10 mb-14">
            <Image
                // ref={iconRef}
                src={"/images/about/about-page-banner-bottom.png"}
                alt="faq-sub-desc"
                className="block mx-auto"
                width={25}
                height={25}
            />
        </div>
    )
}