import React from 'react'

export interface HeroProps {
    dekstop_file: string;
    mobile_file: string;
}

export default function Hero({ dekstop_file, mobile_file }: HeroProps) {
    return (
        <picture className='h-[400px] lg:h-[100vh] block overflow-hidden'>
            <source media="(max-width: 768px)" srcSet={mobile_file} />
            <img
                className='w-full object-cover h-full'
                src={dekstop_file} alt="Project Hero Image" />
        </picture>
    )
}
