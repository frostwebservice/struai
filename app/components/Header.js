"use client";
import Link from "next/link";
import { SignInHandler } from "./SignInHandler";
import { useAuthStore } from "../store/store";

function Header() {
  const user = useAuthStore((state) => state.user);
  return (
    <>
      {/* <section className="header sm:pt-[50px] relative " /> */}
      <header className="sticky  bg-[#05060e]  top-0  z-10 w-full h-fit header px-[50px] py-5">
        <article className=" header__container flex items-center   justify-between w-full px-3 lg:px-[50px]  ">
          <div className="header__left flex items-center justify-start gap-10 lg:w-[579px] h-8">
            <Link
              href="/"
              className="header__logo cursor-pointer lg:w-[130px] h-8    text-white text-center text-xl not-italic font-semibold leading-[normal] tracking-[13px]"
            >
              ASHVA
            </Link>
            <div className="hidden lg:flex lg:w-[390px] h-8  items-center gap-5 ">
              {/* <a
                                href="#"
                                className="lg:w-[130px] h-8   hover:text-gray-300  text-xl font-semibold text-center text-white"
                            >
                                Features
                            </a> */}
              <Link
                href="#"
                className="lg:w-[130px] h-8   hover:text-gray-300  text-xl font-semibold text-center text-white"
              >
                Updates
              </Link>
              {user?.email && (
                <Link
                  href="/chat"
                  className="lg:w-[130px] h-8   hover:text-gray-300  text-xl font-semibold text-center text-white"
                >
                  Chat
                </Link>
              )}
              {/* <a
                                href="#"
                                className="lg:w-[130px] h-8   hover:text-gray-300  text-xl font-semibold text-center text-white"
                            >
                                Pricing
                            </a> */}
            </div>
          </div>
          <SignInHandler />
        </article>
      </header>
    </>
  );
}

export default Header;
