import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Services/axiosInstance";

interface KycFormValues {
  governmentIdType: string;
  governmentIdNumber: string;
  taxId: string;
  addressLine: string;
  stateId: string;
  districtId: string;
  cityId: string;
  postalCode: string;
}

const initialValues: KycFormValues = {
  governmentIdType: "",
  governmentIdNumber: "",
  taxId: "",
  addressLine: "",
  stateId: "",
  districtId: "",
  cityId: "",
  postalCode: "",
};

const KycFormold = () => {
  const [values, setValues] = useState<KycFormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const navigate = useNavigate();

  // Refs to inputs for autofocus
  const refs = {
    governmentIdType: useRef<HTMLSelectElement>(null),
    governmentIdNumber: useRef<HTMLInputElement>(null),
    taxId: useRef<HTMLInputElement>(null),
    addressLine: useRef<HTMLInputElement>(null),
    stateId: useRef<HTMLInputElement>(null),
    districtId: useRef<HTMLInputElement>(null),
    cityId: useRef<HTMLInputElement>(null),
    postalCode: useRef<HTMLInputElement>(null),
  };

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  // Autofocus first errored input on errors change
  useEffect(() => {
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField && refs[firstErrorField as keyof typeof refs]) {
      refs[firstErrorField as keyof typeof refs].current?.focus();
    }
  }, [errors]);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setGeneralError("");

    try {
      const response = await axiosInstance.post("/update-kyc", values); // Adjust API path
      setLoading(false);
      navigate("/dashboard");
    } catch (error: any) {
      setLoading(false);
      if (error.response?.data?.errors) {
        // Map backend validation errors
        const backendErrors: Record<string, string> = {};
        const backendErrs = error.response.data.errors;
        Object.keys(backendErrs).forEach((key) => {
          backendErrors[key] = backendErrs[key][0];
        });
        setErrors(backendErrors);
      } else if (error.response?.data?.message) {
        setGeneralError(error.response.data.message);
      } else {
        setGeneralError("An unexpected error occurred.");
      }
    }
  };

  return (
    <form
      className="max-w-xl mx-auto p-4 bg-white rounded shadow"
      onSubmit={handleSubmit}
      noValidate
    >
      <div>
        <label
          htmlFor="governmentIdType"
          className="inline-block mb-2 text-base font-medium"
        >
          Select Government ID Proof
        </label>
        <select
          id="governmentIdType"
          name="governmentIdType"
          className="border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
          ref={refs.governmentIdType}
          value={values.governmentIdType}
          onChange={handleChange}
        >
          <option value="">Select ID Type</option>
          <option value="aadhaar">Aadhaar</option>
          <option value="passport">Passport</option>
          <option value="driver_license">Driver License</option>
        </select>
        {errors.governmentIdType && (
          <div className="mt-1 text-sm text-red-500">
            {errors.governmentIdType}
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="governmentIdNumber"
          className="inline-block mb-2 text-base font-medium"
        >
          Government ID Number
        </label>
        <input
          type="text"
          name="governmentIdNumber"
          id="governmentIdNumber"
          className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
          placeholder="government id number"
          value={values.governmentIdNumber}
          onChange={handleChange}
          ref={refs.governmentIdNumber}
        />
        {errors.governmentIdNumber && (
          <div className="mt-1 text-sm text-red-500">
            {errors.governmentIdNumber}
          </div>
        )}
      </div>

      {/* Repeat the below pattern for all other fields with correct class names and refs */}

      <div>
        <label
          htmlFor="taxId"
          className="inline-block mb-2 text-base font-medium"
        >
          Tax ID
        </label>
        <input
          type="text"
          name="taxId"
          id="taxId"
          className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
          placeholder="Enter tax id"
          ref={refs.taxId}
          value={values.taxId}
          onChange={handleChange}
        />
        {errors.taxId && (
          <div className="mt-1 text-sm text-red-500">{errors.taxId}</div>
        )}
      </div>

      {/* Add addressLine, stateId, districtId, cityId, postalCode inputs with same pattern */}

      <div>
        <label
          htmlFor="addressLine"
          className="inline-block mb-2 text-base font-medium"
        >
          Address
        </label>
        <input
          type="text"
          name="addressLine"
          id="addressLine"
          className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
          placeholder="Enter address"
          ref={refs.addressLine}
          value={values.addressLine}
          onChange={handleChange}
        />
        {errors.addressLine && (
          <div className="mt-1 text-sm text-red-500">{errors.addressLine}</div>
        )}
      </div>

      {/* Repeat similarly for stateId, districtId, cityId, postalCode */}

      <div>
        <label
          htmlFor="stateId"
          className="inline-block mb-2 text-base font-medium"
        >
          State
        </label>
        <input
          type="text"
          name="stateId"
          id="stateId"
          className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
          placeholder="Enter state"
          ref={refs.stateId}
          value={values.stateId}
          onChange={handleChange}
        />
        {errors.stateId && (
          <div className="mt-1 text-sm text-red-500">{errors.stateId}</div>
        )}
      </div>

      <div>
        <label
          htmlFor="districtId"
          className="inline-block mb-2 text-base font-medium"
        >
          District
        </label>
        <input
          type="text"
          name="districtId"
          id="districtId"
          className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
          placeholder="Enter district"
          ref={refs.districtId}
          value={values.districtId}
          onChange={handleChange}
        />
        {errors.districtId && (
          <div className="mt-1 text-sm text-red-500">{errors.districtId}</div>
        )}
      </div>

      <div>
        <label
          htmlFor="cityId"
          className="inline-block mb-2 text-base font-medium"
        >
          City
        </label>
        <input
          type="text"
          name="cityId"
          id="cityId"
          className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
          placeholder="Enter city"
          ref={refs.cityId}
          value={values.cityId}
          onChange={handleChange}
        />
        {errors.cityId && (
          <div className="mt-1 text-sm text-red-500">{errors.cityId}</div>
        )}
      </div>

      <div>
        <label
          htmlFor="postalCode"
          className="inline-block mb-2 text-base font-medium"
        >
          Pincode
        </label>
        <input
          type="text"
          name="postalCode"
          id="postalCode"
          className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
          placeholder="Enter pincode"
          ref={refs.postalCode}
          value={values.postalCode}
          onChange={handleChange}
        />
        {errors.postalCode && (
          <div className="mt-1 text-sm text-red-500">{errors.postalCode}</div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 mx-auto w-fit px-4 py-2 bg-custom-500 border-custom-500 text-white rounded hover:bg-custom-600 hover:border-custom-600 focus:bg-custom-600 focus:border-custom-600 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Register KYC Details"}
      </button>

      {generalError && <div className="mt-2 text-red-600">{generalError}</div>}
    </form>
  );
};

export default KycFormold;
