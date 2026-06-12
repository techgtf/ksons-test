
import Link from 'next/link';
import { useContact } from '../../hooks/useContact';
import { blauerNue } from '@/src/app/fonts';
import { PhoneIcon } from '../common/SVGIcons';
import { useRef } from 'react';
import { useSlideY } from '../../hooks/useSlideY';

export default function ContactDetails() {
    const { contact } = useContact();
    const contentWrapper = useRef<HTMLDivElement | null>(null);
    useSlideY({ target: contentWrapper })
    return (
        <div className='py-20'
            style={{ background: "radial-gradient(353.34% 207.4% at 108.26% 213.54%, #2FD2ED 0%, #0A3168 100%)" }}
        >

            <div
                ref={contentWrapper}
                className='app-container flex justify-between flex-wrap items-center lg:space-y-0 space-y-7 text-white'>
                <div className='phone lg:w-[30%]'>
                    {contact.phone.map((ph, i) =>
                        <Link
                            key={i}
                            href={`tel:${ph}`}
                            className={`${blauerNue.className} font-light tracking-[0.5px] flex items-center gap-4`}
                        ><span className='border rounded-full min-h-9 min-w-9 flex items-center justify-center'><PhoneIcon color='#fff' /></span> +91-{ph}</Link>)}
                </div>
                <div className='phone lg:w-[30%]'>
                    {contact.email.map((em, i) =>
                        <Link
                            key={i}
                            href={`mailto:${em}`}
                            className={`${blauerNue.className} font-light tracking-[0.5px] flex items-center gap-4 lowercase`}
                        ><span className='border rounded-full min-h-9 min-w-9 flex items-center justify-center'><PhoneIcon color='#fff' /></span> {em}</Link>)}
                </div>
                <div className='phone lg:w-[30%] flex lg:items-start items-center gap-4'>
                    <span className='border rounded-full min-h-9 min-w-9 flex items-center justify-center'><PhoneIcon color='#fff' /></span>
                    <p
                        className={`${blauerNue.className} font-light tracking-[0.5px] flex items-center gap-4`}
                    >{contact.address}</p>
                </div>
            </div>
        </div>
    )
}
