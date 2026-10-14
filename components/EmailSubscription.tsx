"use client";

import { submitPlusUiForm } from "./plus-ui-forms";
import { useState } from "react";

interface EmailSubscriptionProps {
  cssGradient: string;
}

export const EmailSubscription = ({ cssGradient }: EmailSubscriptionProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Send email to Mailchimp via backend API
      const response = await submitPlusUiForm("newsletter", { fields: { Email: email } }, "f7502b16428ec5b28b9d87fa");

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        setEmail("");
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        setErrorMessage(data.error || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting", error);
      setErrorMessage("Sorry, there was an error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mt-6 py-12" style={{ background: cssGradient }}>
      <div className="container max-w-xl mx-auto backdrop-blur-3xl p-8 bg-black/80 rounded-2xl">
        <div className="text-center mb-6">
          <p className="text-gray-300 font-bold">
            Subscribe to get updates on new features and plugins
          </p>
          <div className="flex items-center justify-center mt-4 gap-2">
            By
            <div className="flex gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="258.236" height="258.233" viewBox="0 0 258.236 258.233" className="size-6">
                <g id="Group_3293" data-name="Group 3293" transform="translate(-15226.455 -5742.964)">
                  <path id="Dark_Blue_U" data-name="Dark Blue U" d="M468.512,219.818l-.083-.025a17.4,17.4,0,0,0-34.661,2.3s.272,19.08.776,27.128c.289,4.567,3.812,35.853-14.942,35.408-18.753.446-15.235-30.841-14.946-35.408.5-8.048.776-27.128.776-27.128a17.4,17.4,0,0,0-34.657-2.3l-.087.025C358.746,319.6,408.744,319.6,419.6,319.6S480.459,319.6,468.512,219.818Z" transform="translate(14935.971 5681.601)" fill="#00a0c0" />
                  <path id="Light_Blue_U" data-name="Light Blue U" d="M449.639,288.569l.025-.087a17.4,17.4,0,0,0-2.3-34.657s-19.076.272-27.124.775c-4.571.285-35.853,3.808-35.412-14.946-.441-18.754,30.841-15.231,35.412-14.946,8.048.508,27.124.78,27.124.78a17.4,17.4,0,0,0,2.3-34.661l-.025-.082c-99.78-11.947-99.78,38.056-99.78,48.91S349.86,300.512,449.639,288.569Z" transform="translate(14876.597 5632.423)" fill="#7dcbe7" />
                  <path id="Yellow_U" data-name="Yellow U" d="M370.689,269.691l.087.029a17.4,17.4,0,0,0,34.657-2.3s-.272-19.08-.776-27.124c-.288-4.571-3.807-35.853,14.946-35.412,18.754-.441,15.231,30.841,14.942,35.412-.5,8.044-.776,27.124-.776,27.124a17.4,17.4,0,0,0,34.661,2.3l.083-.029c11.947-99.775-38.056-99.775-48.91-99.775S358.746,169.916,370.689,269.691Z" transform="translate(14935.97 5573.048)" fill="#ffb52e" />
                  <path id="Organge_U" data-name="Organge U" d="M399.762,190.745l-.025.082a17.4,17.4,0,0,0,2.3,34.661s19.079-.272,27.124-.78c4.571-.285,35.853-3.808,35.412,14.946.441,18.753-30.841,15.231-35.412,14.946-8.045-.5-27.124-.775-27.124-.775a17.4,17.4,0,0,0-2.3,34.657l.025.087c99.779,11.943,99.779-38.056,99.779-48.914S499.541,178.8,399.762,190.745Z" transform="translate(14985.149 5632.423)" fill="#ff7e23" />
                  <path id="Path_3335" data-name="Path 3335" d="M381.159,319.6c10.854,0,60.857,0,48.91-99.779l-.083-.025a17.4,17.4,0,0,0-34.661,2.3s.272,19.08.776,27.128c.289,4.567,3.812,35.853-14.942,35.408Z" transform="translate(14974.416 5681.601)" fill="#00a0c0" />
                </g>
              </svg>
              <a href="https://www.plusuidesign.com/" target="_blank" className="border-b border-white">
                Plus UI Design
              </a>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={handleEmailChange}
              required
              className="flex-1 rounded-lg px-4 py-3 bg-white text-black placeholder-gray-500 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition"
              disabled={isLoading}
            />
            <button
              type="submit"
              className={`cursor-pointer px-6 py-3 rounded-lg font-semibold transition ${isLoading
                ? "bg-gray-700 cursor-not-allowed opacity-50"
                : isSuccess
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-indigo-600 hover:bg-indigo-700"
                } text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
              disabled={isLoading}
            >
              {isLoading ? "Subscribing..." : isSuccess ? "Check your inbox" : "Subscribe"}
            </button>
          </div>

          {isSuccess && (
            <p className="text-green-400 text-sm text-center">
              Thank you for subscribing! Check your inbox to confirm your subscription.
            </p>
          )}

          {errorMessage && (
            <p className="text-red-400 text-sm text-center">
              {errorMessage}
            </p>
          )}

          <p className="text-gray-400 text-xs text-center">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </form>
      </div>
    </div>
  );
};
