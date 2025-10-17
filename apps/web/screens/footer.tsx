import Link from "next/link";
import Image from "next/image";
import { Separator } from "@repo/ui";

const Footer = () => {
  return (
    <>
      <Separator className="my-8 mx-auto bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="mx-auto wrapper bottom-0 flex flex-col items-center gap-6 w-full mb-16">
        <div className="flex flex-col md:flex-row w-full justify-between mx-auto p-6 gap-12">
          <div className="flex flex-col gap-12 text-primary">
            <Link href={"/"} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                <Image
                  src={"https://appx-wsb-gcp.akamai.net.in/subject/2023-01-17-0.17044360120951185.jpg"}
                  alt="Logo"
                  width={300}
                  height={200}
                  className="rounded-full size-16 relative z-10 ring-2 ring-primary/10 group-hover:ring-blue-500/30 transition-all duration-300"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 bg-clip-text text-transparent text-4xl tracking-tight">
                  100xdevs
                </span>
                <p className="text-primary/80 tracking-tight text-lg leading-none font-medium">because 10x ain't enough.</p>
              </div>
            </Link>
            <div className="flex flex-col gap-4">
              <h4 className="tracking-tight font-bold text-foreground text-lg">Follow us</h4>
              <div className="flex gap-5">
                <Link target="_blank" href={"https://twitter.com/kirat_tw"} className="group">
                  <svg
                    viewBox="-0.5 -0.5 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-primary transition-all duration-300 hover:text-blue-600 size-7 group-hover:scale-110"
                  >
                    <path
                      d="M11.133375000000001 14.11 1.2831875000000001 1.445375c-0.23112500000000002 -0.2970625 -0.019375 -0.73 0.35700000000000004 -0.73h1.869375c0.1395625 0 0.2713125 0.0644375 0.35700000000000004 0.17462499999999997l9.85025 12.6645625c0.23112500000000002 0.2971875 0.019375 0.7300625 -0.35700000000000004 0.7300625h-1.8693125c-0.139625 0 -0.271375 -0.0644375 -0.357125 -0.17462499999999997Z"
                      stroke="currentColor"
                      strokeWidth="1"
                    ></path>
                    <path
                      d="M13.530750000000001 0.7153750000000001 1.46925 14.284625"
                      stroke="currentColor"
                      stroke-linecap="round"
                      strokeWidth="1"
                    ></path>
                  </svg>
                </Link>
                <Link target="_blank" href={"https://www.instagram.com/kirat_ins/"} className="group">
                  <svg
                    viewBox="-0.5 -0.5 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-primary transition-all duration-300 hover:text-blue-600 size-7 group-hover:scale-110"
                  >
                    <path
                      d="M7.5 10.515375c1.6653125 0 3.015375 -1.3500625 3.015375 -3.015375 0 -1.665375 -1.3500625 -3.015375 -3.015375 -3.015375 -1.665375 0 -3.015375 1.35 -3.015375 3.015375 0 1.6653125 1.35 3.015375 3.015375 3.015375Z"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                    ></path>
                    <path
                      d="M0.7153750000000001 10.515375V4.484624999999999c0 -2.0816875 1.6875624999999999 -3.76925 3.76925 -3.76925h6.03075c2.0816875 0 3.76925 1.6875624999999999 3.76925 3.76925v6.03075c0 2.0816875 -1.6875624999999999 3.76925 -3.76925 3.76925H4.484624999999999c-2.0816875 0 -3.76925 -1.6875624999999999 -3.76925 -3.76925Z"
                      stroke="currentColor"
                      stroke-width="1"
                    ></path>
                    <path
                      d="m11.646125000000001 3.361375 0.0075625 -0.008375"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                    ></path>
                  </svg>
                </Link>
                <Link target="_blank" href={"https://www.youtube.com/@harkirat1"} className="group">
                  <svg
                    viewBox="-0.5 -0.5 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-primary transition-all duration-300 hover:text-blue-600 size-7 group-hover:scale-110"
                  >
                    <path
                      d="m8.867437500000001 7.5000625 -2.3930000000000002 1.3674374999999999V6.132625000000001l2.3930000000000002 1.3674374999999999Z"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                    ></path>
                    <path
                      d="M0.6628125 7.98375v-0.9675c0 -1.9796250000000002 0 -2.9694375 0.6190625000000001 -3.6063125 0.619125 -0.6368125 1.5938125 -0.6644375 3.5431875 -0.7195625 0.92375 -0.026125 1.8673125 -0.0448125 2.6749374999999995 -0.0448125s1.7511875 0.0186875 2.6749374999999995 0.0448125c1.9493125 0.055125 2.9240625 0.0826875 3.5431875 0.7195625s0.6190625000000001 1.6266875 0.6190625000000001 3.6063125v0.9675c0 1.9795625000000001 0 2.9694375 -0.6190625000000001 3.6062499999999997 -0.619125 0.636875 -1.59375 0.6644375 -3.543125 0.719625 -0.9238124999999999 0.026125 -1.867375 0.0448125 -2.6750000000000003 0.0448125s-1.75125 -0.0186875 -2.6750000000000003 -0.0448125c-1.9493125 -0.0551875 -2.924 -0.08274999999999999 -3.543125 -0.719625 -0.6190625000000001 -0.6368125 -0.6190625000000001 -1.6266249999999998 -0.6190625000000001 -3.6062499999999997Z"
                      stroke="currentColor"
                      strokeWidth="1"
                    ></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-lg tracking-tight font-bold text-foreground">100x Links</h4>
            <div className="text-base tracking-tight flex flex-col gap-3">
              <Link
                href={"https://app.100xdevs.com"}
                target="_blank"
                className="text-foreground/70 hover:text-blue-600 transition-all duration-300 font-medium hover:translate-x-1 inline-block"
              >
                App
              </Link>

              <Link
                href={"https://report-100xdevs.vercel.app/"}
                target="_blank"
                className="text-foreground/70 hover:text-blue-600 transition-all duration-300 font-medium hover:translate-x-1 inline-block"
              >
                Report
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-lg tracking-tight font-bold text-foreground">100x Legal</h4>
            <div className="text-base tracking-tight flex flex-col gap-3">
              <Link href={"/tnc"} className="text-foreground/70 hover:text-blue-600 transition-all duration-300 font-medium hover:translate-x-1 inline-block">
                Terms & Conditions
              </Link>
              <Link
                href={"/privacy-policy"}
                className="text-foreground/70 hover:text-blue-600 transition-all duration-300 font-medium hover:translate-x-1 inline-block"
              >
                Privacy Policy
              </Link>
              <Link href={"/refund"} className="text-foreground/70 hover:text-blue-600 transition-all duration-300 font-medium hover:translate-x-1 inline-block">
                Refund & Cancellation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
