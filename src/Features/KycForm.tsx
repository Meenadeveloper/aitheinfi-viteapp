import React from "react";
import ModernImage from "../pages/AuthenticationInner/ModernImage";
import Select from "react-select";
import FileUpload from "../pages/Components/Forms/FileUpload";
// import CreatableSelect from "react-select/creatable";
interface Options {
  label: string;
  value?: string;
  isDisabled?: boolean;
  options?: Options[];
}
// import { useState } from "react";
import { useNavigate } from "react-router-dom";
const KycForm = () => {
  const navigate = useNavigate();
  document.title = "Register | Tailwick - React Admin & Dashboard Template";

  React.useEffect(() => {
    const bodyElement = document.body;

    bodyElement.classList.add("font-public");

    return () => {
      bodyElement.classList.remove("font-public");
    };
  }, []);
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  // Perform validation or API call here
  // Assuming success, navigate to dashboard
  navigate("/dashboard");
};
  const DefaultOptions: Options[] = [
    { label: "", value: "This is a placeholder" },
    { label: "aadhaar ", value: "aadhaar" },
    { label: "passport", value: "passport" },
    { label: "driverlicense ", value: "driver_license" },
  ];

  return (
    <React.Fragment>
      <div className="relative flex flex-col items-center w-full overflow-hidden  to-custom-800 bg-gradient-to-r from-custom-900 dark:to-custom-900 dark:from-custom-950">
        <ModernImage />

        <div className="bg-white rounded z-10 relative dark:bg-zink-700 dark:text-zink-100  min-h-[calc(100vh_-_theme('spacing.4')_*_2)] max-w-[950px] w-[100%] my-4 border card border-custom-200 dark:border-custom-800">
          <div className="card-body">
            <div className="mt-8 text-center">
              <h4 className="mb-2 text-slate-900 text-bold dark:text-zink-200">
                Register KYC Details
              </h4>
              <p className="mb-6 text-slate-500 dark:text-zink-200">
                We are review your details. Please check after admin approvel!
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div
                className="hidden p-3 mb-3 text-base text-green-500 border border-green-200 rounded-md bg-green-50"
                id="successAlert"
              >
                You have <b>successfully</b> signed in.
              </div>
              <div className="grid grid-cols-1 gap-x-5 gap-5 md:grid-cols-2 xl:grid-cols-2 my-5">
                <div className="mb-3">
                  <label
                    htmlFor="username"
                    className="inline-block mb-2 text-base font-medium"
                  >
                    Select Government ID Proof
                  </label>
                  <Select
                    className="border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                    data-choices
                    name="choices-single-default"
                    options={DefaultOptions}
                  />
                  <div
                    id="username-error"
                    className="hidden mt-1 text-sm text-red-500"
                  >
                    Please enter a valid email address.
                  </div>
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="government_id_number"
                    className="inline-block mb-2 text-base font-medium"
                  >
                    Government ID Number
                  </label>
                  <input
                    type="text"
                    id="government_id_number"
                    className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                    placeholder="government id number"
                  />
                  <div
                    id="username-error"
                    className="hidden mt-1 text-sm text-red-500"
                  >
                    Please enter a valid email address.
                  </div>
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="tax_id"
                    className="inline-block mb-2 text-base font-medium"
                  >
                    Tax ID
                  </label>
                  <input
                    type="text"
                    id="tax_id"
                    className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                    placeholder="Enter tax id"
                  />
                  <div
                    id="password-error"
                    className="hidden mt-1 text-sm text-red-500"
                  >
                    Password must be at least 8 characters long and contain both
                    letters and numbers.
                  </div>
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="address_line"
                    className="inline-block mb-2 text-base font-medium"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="address_line"
                    className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                    placeholder="Enter addresS"
                  />
                  <div
                    id="username-error"
                    className="hidden mt-1 text-sm text-red-500"
                  >
                    Please enter a valid email address.
                  </div>
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="state_id"
                    className="inline-block mb-2 text-base font-medium"
                  >
                    State
                  </label>
                  <input
                    type="text"
                    id="state_id"
                    className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                    placeholder="Enter state"
                  />
                  <div
                    id="username-error"
                    className="hidden mt-1 text-sm text-red-500"
                  >
                    Please enter a valid email address.
                  </div>
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="district_id"
                    className="inline-block mb-2 text-base font-medium"
                  >
                    District
                  </label>
                  <input
                    type="text"
                    id="district_id"
                    className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                    placeholder="Enter district"
                  />
                  <div
                    id="username-error"
                    className="hidden mt-1 text-sm text-red-500"
                  >
                    Please enter a valid email address.
                  </div>
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="city_id"
                    className="inline-block mb-2 text-base font-medium"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city_id"
                    className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                    placeholder="Enter city"
                  />
                  <div
                    id="username-error"
                    className="hidden mt-1 text-sm text-red-500"
                  >
                    Please enter a valid email address.
                  </div>
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="postal_code"
                    className="inline-block mb-2 text-base font-medium"
                  >
                    Pincode
                  </label>
                  <input
                    type="text"
                    id="postal_code"
                    className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                    placeholder="Enter city"
                  />
                  <div
                    id="username-error"
                    className="hidden mt-1 text-sm text-red-500"
                  >
                    Please enter a valid email address.
                  </div>
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="username"
                    className="inline-block mb-2 text-base font-medium"
                  >
                    Upload Government ID Proof
                  </label>
                  <FileUpload />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="username"
                    className="inline-block mb-2 text-base font-medium"
                  >
                    Upload Address Proof
                  </label>
                  <FileUpload />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="username"
                    className="inline-block mb-2 text-base font-medium"
                  >
                    Upload Profile Photo
                  </label>
                  <FileUpload />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="username"
                    className="inline-block mb-2 text-base font-medium"
                  >
                    Upload Partnership Agreement File
                  </label>
                  <FileUpload />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="username"
                    className="inline-block mb-2 text-base font-medium"
                  >
                    Upload Contract Document
                  </label>
                  <FileUpload />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="username"
                    className="inline-block mb-2 text-base font-medium"
                  >
                    Upload nda file
                  </label>
                  <FileUpload />
                </div>
              </div>
              <div className="mt-10 mx-auto w-fit">
                <button
                  type="submit"
                  className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
                >
                  Register KYC Details
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default KycForm;
