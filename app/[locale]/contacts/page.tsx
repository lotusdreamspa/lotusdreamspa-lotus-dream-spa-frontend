import type { Metadata } from "next";
import {
    NavbarElement,
    HeroElement,
    FooterElement
} from "@/components";
import Link from "next/link";
import { TextHoverElement } from "@/components";

export const metadata: Metadata = {
    title: "Contact Us | Lotus Dream SPA | Best olistic spa in Siem Reap",
    description: "Find us in the heart of Kandal Village. Contact Lotus Dream SPA for inquiries, directions, and the ultimate wellness experience at the best olistic spa in Siem Reap.",
};

export default function ContactsPage() {

    return (
        <>
            <div className="bg-lotus-blue w-full min-h-screen flex flex-col items-center justify-center padding-x gap-10">
                <NavbarElement />
                <HeroElement title="About" hasSubtitle={false} />
            </div>
            <div className="w-full flex flex-col items-center justify-center mb-16">
                <div className="w-full lg:w-4/6 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">

                    <iframe
                        className="w-full"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3881.8860290349226!2d103.85336747479921!3d13.357362206303943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31101764523865f3%3A0x44be57aa7e937a07!2sLotus%20Dream%20SPA!5e0!3m2!1sen!2skh!4v1767947565143!5m2!1sen!2skh"
                        width="100%"
                        height="450"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade" />
                </div>
                <div className="w-full flex justify-center my-16">
                    <div className="group flex gap-2 items-center text-[17px] font-semibold capitalize text-[#260A2F] bg-secondary rounded-full leading-tight tracking-tight px-4 py-3">
                        <Link href="https://www.google.com/maps/dir//The+Amara+Bar+and+Restaurant,+629+Central+Market+St,+Krong+Siem+Reap+12131/@13.3570307,103.8155963,13z/data=!4m8!4m7!1m0!1m5!1m1!1s0x311017dcaa9040d9:0x4edae835d38d891c!2m2!1d103.8567962!2d13.3569505?entry=ttu&g_ep=EgoyMDI1MDUyNi4wIKXMDSoASAFQAw%3D%3D" className="w-36 text-center">
                            <TextHoverElement
                                titile1="Open in Google Maps"
                                titile2="Let's Go!"
                            />
                        </Link>
                    </div>
                </div>
            </div>
            <FooterElement />
        </>
    );
}
