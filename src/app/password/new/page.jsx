import React from "react";

const ForgotPassword = () => {
  return (
    <main className=" container  bg-gray-50 py-10">
      <div className="flex flex-col items-center justify-center">
        {/* Logo and Header */}
        <div className="text-center   mb-6">
          <h1 className="mb-2 text-3xl">
            <a href="/">
              <img
                src="https://d26ukeum83vx3b.cloudfront.net/assets/upfrica-com-logo-dark-0200279f4edfa75fc643c477221cbe7ea4d4afdd5ac37ed8f22164659d2b0fb9.png"
                alt="upfrica"
                className="h-[50px] mb-2 mx-auto"
                loading="lazy"
              />
            </a>
          </h1>
          <h5 className="mt-3 text-2xl font-extrabold text-gray-900">
            Forgot your password?
          </h5>
        </div>

        {/* Form */}
        <div className="w-full sm:max-w-md bg-white p-6 shadow rounded-lg">
          <form method="POST" action="/password">
            <input
              type="hidden"
              name="authenticity_token"
              value="CSRF_TOKEN_HERE"
            />
            <div className="mb-4">
              <label
                htmlFor="user_email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  id="user_email"
                  name="user[email]"
                  placeholder="you@example.com"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div className="text-center mt-4">
              <button
                type="submit"
                className="btn btn-primary bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Reset password
              </button>
            </div>

            <div className="mt-4 text-center text-sm text-gray-600">
              or{" "}
              <a
                href="/login?redirect_to=%2Fpassword%2Fnew"
                className="text-blue-600 hover:underline"
              >
                Sign in
              </a>
            </div>

            <div className="mt-2 text-sm">
              <a
                href="/confirmation/new"
                className="text-blue-500 hover:underline block"
              >
                Didn't receive confirmation instructions?
              </a>
            </div>
          </form>
        </div>

        {/* Help button */}
        <div className="vstack gap-3 mt-6">
          <a
            href="https://wa.me/233554248805"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-light border border-gray-300 py-2 px-4 rounded-md flex items-center justify-center gap-2"
          >
            <i className="fab fa-whatsapp" style={{ color: "#4DC247" }}></i>
            Help
          </a>
        </div>

        {/* Footer */}
        <footer className="mt-10 text-sm text-center text-gray-600">
          <div className="mb-2">
            © 2025 Upfrica Marketplace BD. All rights reserved.
          </div>
          <div className="space-x-2">
            <a href="/about" target="_blank" className="hover:underline">
              About Us
            </a>
            |
            <a href="/privacy" target="_blank" className="hover:underline">
              Privacy Policy
            </a>
            |
            <a href="/terms" target="_blank" className="hover:underline">
              Terms of Service
            </a>
          </div>
          <div className="mt-1 space-x-3 text-xl">
            <a href="https://www.facebook.com/upfrica" target="_blank">
              <i className="fa fa-facebook"></i>
            </a>
            <a href="https://www.twitter.com/upfrica" target="_blank">
              <i className="fa fa-twitter"></i>
            </a>
            <a href="https://www.instgram.com/upfrica" target="_blank">
              <i className="fa fa-instagram"></i>
            </a>
            <a href="https://www.pinterest.co.uk/upfrica" target="_blank">
              <i className="fa fa-pinterest"></i>
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default ForgotPassword;
