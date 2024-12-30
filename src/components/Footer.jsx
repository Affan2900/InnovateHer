import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const Footer = () => {
  const t = useTranslations("Footer");
  return (
    <footer className="bg-gray-800 text-white py-8 ">
      <div className="container mx-auto px-4 flex flex-col items-center md:flex-row md:justify-between">
        {/* Logo and Description Section */}
        <div className="text-center md:text-left mb-6 md:mb-0">
          <h2 className="text-lg font-semibold">InnovateHer</h2>
          <p className="text-sm text-gray-400 mt-1">
            {t("description")}
          </p>
        </div>

        {/* Social Media Links Section */}
        <div className="flex space-x-6 mb-6 md:mb-0">
          <Link
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition duration-300"
            aria-label="Instagram"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-6 h-6"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.849.07 1.17.054 1.957.24 2.407.411a4.924 4.924 0 0 1 1.675 1.073 4.923 4.923 0 0 1 1.073 1.675c.171.45.357 1.236.411 2.407.058 1.265.07 1.645.07 4.849s-.012 3.584-.07 4.849c-.054 1.17-.24 1.957-.411 2.407a4.924 4.924 0 0 1-1.073 1.675 4.924 4.924 0 0 1-1.675 1.073c-.45.171-1.236.357-2.407.411-1.265.058-1.645.07-4.849.07s-3.584-.012-4.849-.07c-1.17-.054-1.957-.24-2.407-.411a4.924 4.924 0 0 1-1.675-1.073 4.924 4.924 0 0 1-1.073-1.675c-.171-.45-.357-1.236-.411-2.407-.058-1.265-.07-1.645-.07-4.849s.012-3.584.07-4.849c.054-1.17.24-1.957.411-2.407a4.924 4.924 0 0 1 1.073-1.675A4.924 4.924 0 0 1 4.743 2.645c.45-.171 1.236-.357 2.407-.411C8.416 2.175 8.796 2.163 12 2.163m0-2.163c-3.259 0-3.67.014-4.947.072-1.271.058-2.145.24-2.907.51a6.92 6.92 0 0 0-2.51 1.628 6.92 6.92 0 0 0-1.628 2.51c-.27.762-.452 1.636-.51 2.907-.058 1.276-.072 1.688-.072 4.947s.014 3.671.072 4.947c.058 1.271.24 2.145.51 2.907a6.92 6.92 0 0 0 1.628 2.51 6.92 6.92 0 0 0 2.51 1.628c.762.27 1.636.452 2.907.51 1.276.058 1.688.072 4.947.072s3.671-.014 4.947-.072c1.271-.058 2.145-.24 2.907-.51a6.92 6.92 0 0 0 2.51-1.628 6.92 6.92 0 0 0 1.628-2.51c.27-.762.452-1.636.51-2.907.058-1.276.072-1.688.072-4.947s-.014-3.671-.072-4.947c-.058-1.271-.24-2.145-.51-2.907a6.92 6.92 0 0 0-1.628-2.51 6.92 6.92 0 0 0-2.51-1.628c-.762-.27-1.636-.452-2.907-.51-1.276-.058-1.688-.072-4.947-.072z" />
              <circle cx="12" cy="12" r="3.5" />
            </svg>
          </Link>
          <Link
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition duration-300"
            aria-label="Facebook"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-6 h-6"
            >
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.437 9.879v-6.99H7.898V12H10.437V9.797c0-2.517 1.492-3.914 3.781-3.914 1.096 0 2.238.196 2.238.196v2.47h-1.26c-1.243 0-1.628.774-1.628 1.563V12h2.773l-.443 2.889h-2.33v6.99C18.343 21.128 22 16.991 22 12z" />
            </svg>
          </Link>
        </div>

        {/* Copyright Section */}
        <div className="text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} InnovateHer. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
