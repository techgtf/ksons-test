"use client";
import Image from 'next/image'
import React, { useRef, useState } from 'react'
import { Banner } from './Banner'
import { agency, blauerNue } from '@/src/app/fonts'
import Pagination from '../../common/Pagination'
import PopularBlogs from '../PopularBlogs'
import { useSlideY } from '@/src/website/hooks/useSlideY';
import { useReveal } from '@/src/website/hooks/useReveal';

export default function BlogDetail({ blog }: any) {
    // const [currentPage, setCurrentPage] = useState<number>(1);
    // const totalPages = 4;
    const htmlPrinterRef = useRef<HTMLDivElement | null>(null);
    const imgReveal = useRef<HTMLDivElement | null>(null);

    useReveal(imgReveal)
    useSlideY({ target: htmlPrinterRef })
    return (
        <>
            <Banner />
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] lg:gap-20 gap-10">
                {/* Main Content */}
                <div className="flex flex-col">
                    <h1
                        className={`${agency.className} text-[#0f3c78] lg:text-[24px] text-[22px] lg:leading-[32px] tracking-[-0.5px] leading-tight lg:mb-12 mb-6`}
                    >
                        {blog.title}
                    </h1>

                    <div
                        ref={imgReveal}
                        className="relative w-full aspect-video lg:mb-10 mb-6 overflow-hidden rounded-[10px]">
                        <Image
                            src={blog.image}
                            alt={blog.title}
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="flex items-center justify-between lg:mb-10 mb-6 border-b border-[#0f3c78]/8 pb-6">
                        <span
                            className={`${blauerNue.className} text-[#0f3c78]/75 lg:leading-[24px] leading-[20px] text-base tracking-[0.5px] font-light`}
                        >
                            {blog.date}
                        </span>
                        {/* <div className="flex items-center gap-6">
                            <span
                                className={`${blauerNue.className} text-[#0f3c78]/75 lg:leading-[24px] leading-[20px] text-base tracking-[0.5px] font-light`}
                            >
                                {blog.comments} Comments
                            </span>
                            <span
                                className={`${blauerNue.className} text-[#0f3c78]/75 lg:leading-[24px] leading-[20px] text-base tracking-[0.5px] font-light`}
                            >
                                {blog.likes} Likes
                            </span>
                        </div> */}
                    </div>

                    <div
                        ref={htmlPrinterRef}
                        className={`${blauerNue.className} blog-content text-[#0f3c78] text-base lg:leading-[24px] leading-[20px] tracking-[0.5px] font-light space-y-6 lg:mb-14 mb-10`}
                        dangerouslySetInnerHTML={{ __html: blog.blog }}
                    />

                    <div className="bg-[#0f3c78]/2 rounded-[10px] lg:p-10 p-6 lg:mb-20 mb-10 border border-[#0f3c78]/10">
                        <h3
                            className={`${agency.className} text-[#0f3c78] lg:text-[24px] text-[22px] lg:leading-[32px] tracking-[-0.5px] mb-4 lg:mb-8`}
                        >
                            Conclusion
                        </h3>
                        <p
                            className={`${blauerNue.className} text-[#0f3c78] text-base lg:leading-[24px] tracking-[0.5px] font-light`}
                        >
                            {blog.conclusion}
                        </p>
                    </div>

                    {/* <div className="lg:mt-10 mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    </div> */}
                </div>

                {/* Sidebar */}
                <aside className="lg:border-l border-[#0f3c78]/8 lg:pl-16 lg:block hidden">
                    <PopularBlogs />
                </aside>
            </div>
        </>
    )
}


