/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { SiInstagram, SiYoutube, SiX } from "@icons-pack/react-simple-icons";
import Image from "next/image";
import playstore from "../public/playstore.png";
import Logo from "../public/logo.png";
import { RepositorySelector } from "@repo/ui/RepositorySelector";

const Footer = () => {
  return (
    <div className="bottom-0 w-full p-4 bg-neutral-900 dark:bg-slate-900 px-6 lg:px-36 print:hidden">
      <div className="md:max-w-screen-2xl mt-4 mx-auto flex flex-row items-start justify-evenly md:justify-between w-full">
        <div className="flex flex-col md:flex-row w-3/5 md:justify-between">
          <div className="-ml-8 sm:-ml-2 lg:-ml-20">
            <Link href={"https://app.100xdevs.com/"}>
              <Image src={Logo} alt="Logo" width={300} height={200} className="hover:opacity-80" />
            </Link>
          </div>
          <div className="flex flex-col justify-center my-8 md:my-0 sm:ml-8">
            <h3 className="font-semibold text-neutral-100 mb-4">Quick Links</h3>
            <Link href={"https://app.100xdevs.com/"} className="hover:text-blue-500 text-neutral-200">
              100xdevs
            </Link>
            <Link href={"/tnc"} className="hover:text-blue-500 text-neutral-200">
              Terms & Conditions
            </Link>
            <Link href={"/privacy-policy"} className="hover:text-blue-500 text-neutral-200">
              Privacy Policy
            </Link>
          </div>
        </div>

        <div className="flex flex-col justify-center pb-2 mt-4 md:-mt-2">
          <Link
            href={"https://play.google.com/store/apps/details?id=com.hundredx.devs"}
            target="_blank"
            className="hover:text-blue-500 font-semibold  text-neutral-200 mb-10 md:mb-4"
          >
            Download App
            <Image className="shadow-md mt-2" src={playstore} alt={"playstore"} height={50} width={150} />
          </Link>
          <div>
            <h4 className="text-neutral-200 font-semibold mb-2">Follow us</h4>
            <div className="flex justify-center gap-x-5">
              <Link target="_blank" href={"https://twitter.com/kirat_tw"}>
                <SiX className="text-white hover:text-blue-500" />
              </Link>
              <Link target="_blank" href={"https://www.instagram.com/kirat_ins/"}>
                <SiInstagram className="text-white hover:text-blue-500" />
              </Link>
              <Link target="_blank" href={"https://www.youtube.com/@harkirat1"}>
                <SiYoutube className="text-white hover:text-blue-500" />
              </Link>
              <RepositorySelector />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
