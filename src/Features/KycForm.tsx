import React, { useState, useEffect, useRef } from "react";
import ModernImage from "../pages/AuthenticationInner/ModernImage";
import FileUpload from "../pages/Components/Forms/FileUpload";
import type { FileWithPreview } from "../pages/Components/Forms/FileUpload";
import DynamicInput from "../utills/DynamicInputs";
import { useNavigate } from "react-router-dom";
import {
  updateFormValue,
  selectKycFormState,
  updateKyc,
  clearFieldError,
  clearGlobalError,
  setFocusedField,
  resetKycForm,
  setFieldTouched,
} from "../slices/auth/kyc/kycSlice";
import { kycValidationSchema } from "../validation/kycValidationSchema"; 
import { useAppDispatch, useAppSelector } from "../slices/hooks";
import * as Yup from "yup";
import axiosInstance from "../Services/axiosInstance";
import Swal from "sweetalert2";

interface OptionType {
  label: string;
  value: string;
}

// Define form fields types and options for selects
const defaultIdProofOptions: OptionType[] = [
  { label: "Aadhaar", value: "aadhaar" },
  { label: "Passport", value: "passport" },
  { label: "Driver License", value: "driver_license" },
];


const KycForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    formValues,
    fieldErrors,
    loading,
    success,
    globalError,
    touched,
    focusedField,
  } = useAppSelector(selectKycFormState);
  const navigate = useNavigate();

  // Ref for autofocus
  const firstInputRef = useRef<HTMLInputElement>(null);
  // Local validation errors
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  document.title = "Register | Tailwick - React Admin & Dashboard Template";

  // Refs for inputs to manage autofocus
  const refs = {
    government_id_type: useRef<HTMLInputElement>(null),
    government_id_number: useRef<HTMLInputElement>(null),
    tax_id: useRef<HTMLInputElement>(null),
    address_line: useRef<HTMLInputElement>(null),
    state_id: useRef<HTMLInputElement>(null),
    district_id: useRef<HTMLInputElement>(null),
    city_id: useRef<HTMLInputElement>(null),
    postal_code: useRef<HTMLInputElement>(null),
  };

  // Controlled file inputs state
  const [govtIdFiles, setGovtIdFiles] = useState<FileWithPreview[]>([]);
  const [addressProofFiles, setAddressProofFiles] = useState<FileWithPreview[]>(
    []
  );
  const [profilePhotoFiles, setProfilePhotoFiles] = useState<FileWithPreview[]>(
    []
  );
  const [partnershipFiles, setPartnershipFiles] = useState<FileWithPreview[]>(
    []
  );
  const [contractsFiles, setContractsFiles] = useState<FileWithPreview[]>([]);
  const [ndaFiles, setNdaFiles] = useState<FileWithPreview[]>([]);

  const [states, setStates] = useState<OptionType[]>([]);
  const [districts, setDistricts] = useState<OptionType[]>([]);
  const [cities, setCities] = useState<OptionType[]>([]);

  const selectedStateId = formValues.state_id;
  const selectedDistrictId = formValues.district_id;

  useEffect(() => {
    async function fetchStates() {
      try {
        const response = await axiosInstance.get("states");
        // Adjust if your API wraps the data differently, e.g. response.data.data
        const data = response.data;
        const options = data.data.map((s: any) => ({
          label: s.name,
          value: s.id,
        }));
        setStates(options);
      } catch (e) {
        console.error("Failed to load states", e);
      }
    }
    fetchStates();
  }, []);

  useEffect(() => {
    async function fetchDistricts() {
      if (!selectedStateId) {
        setDistricts([]);
        setCities([]);
        dispatch(updateFormValue({ field: "district_id", value: "" }));
        dispatch(updateFormValue({ field: "city_id", value: "" }));
        return;
      }
      try {
        const response = await axiosInstance.post("get-districts", {
          state_id: selectedStateId,
        });
        const data = response.data;
        const options = data.map((d: any) => ({ label: d.name, value: d.id }));
        setDistricts(options);
        setCities([]);
        dispatch(updateFormValue({ field: "district_id", value: "" }));
        dispatch(updateFormValue({ field: "city_id", value: "" }));
      } catch (e) {
        console.error("Failed to load districts", e);
      }
    }
    fetchDistricts();
  }, [selectedStateId, dispatch]);

  useEffect(() => {
    async function fetchCities() {
      if (!selectedDistrictId) {
        setCities([]);
        dispatch(updateFormValue({ field: "city_id", value: "" }));
        return;
      }
      try {
        const response = await axiosInstance.post("get-cities", {
          district_id: selectedDistrictId,
        });
        const data = response.data;
        const options = data.map((c: any) => ({ label: c.name, value: c.id }));
        setCities(options);
        dispatch(updateFormValue({ field: "city_id", value: "" }));
      } catch (e) {
        console.error("Failed to load cities", e);
      }
    }
    fetchCities();
  }, [selectedDistrictId, dispatch]);

  useEffect(() => {
    document.body.classList.add("font-public");
    // Autofocus on first input
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
    return () => {
      document.body.classList.remove("font-public");
    };
  }, []);

  // Clear errors on success
  useEffect(() => {
    if (success) {
      setValidationErrors({});
      dispatch(clearGlobalError());
    }
  }, [success, dispatch]);

  // Combine redux backend errors and local Yup errors for display
  const getCombinedError = (field: string) =>
    validationErrors[field] || fieldErrors[field];

  // Clear errors and update store on input change
  // const handleInputChange = async (
  //   field: keyof typeof formValues,
  //   value: string
  // ) => {
  //   if (fieldErrors[field]) dispatch(clearFieldError(field));
  //   if (validationErrors[field]) {
  //     setValidationErrors((prev) => {
  //       const copy = { ...prev };
  //       delete copy[field];
  //       return copy;
  //     });
  //   }
  //   dispatch(updateFormValue({ field, value }));
  //   dispatch(clearFieldError(field));
  //   dispatch(setFieldTouched({ field, touched: true }));
  //   // Validate single field immediately on change
  //   try {
  //     await kycValidationSchema.validateAt(field, {
  //       ...formValues,
  //       [field]: value,
  //     });
  //   } catch (e) {
  //     if (e instanceof Error) {
  //       setValidationErrors((prev) => ({ ...prev, [field]: e.message }));
  //     }
  //   }
  // };

  // Handle text/select input changes
  const handleInputChange = async (
    field: keyof typeof formValues,
    value: string
  ) => {
    dispatch(updateFormValue({ field, value }));
    dispatch(clearFieldError(field));
    dispatch(setFieldTouched({ field, touched: true }));

    try {
      await kycValidationSchema.validateAt(field, {
        ...formValues,
        [field]: value,
      });
      setValidationErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    } catch (e) {
      if (e instanceof Error) {
        setValidationErrors((prev) => ({ ...prev, [field]: e.message }));
      }
    }
  };

  const handleBlur = (field: keyof typeof formValues) => {
    dispatch(setFieldTouched({ field, touched: true }));
  };

  // Handle file changes
  // const handleFileChange = async (
  //   files: FileWithPreview[],
  //   field: keyof typeof formValues
  // ) => {
  //   if (fieldErrors[field]) dispatch(clearFieldError(field));
  //   if (validationErrors[field]) {
  //     setValidationErrors((prev) => {
  //       const copy = { ...prev };
  //       delete copy[field];
  //       return copy;
  //     });
  //   }
  //   const file = files.length > 0 ? files[0] : null;
  //   dispatch(updateFormValue({ field, value: file }));

  //   try {
  //     await kycValidationSchema.validateAt(field, {
  //       ...formValues,
  //       [field]: file,
  //     });
  //   } catch (e) {
  //     if (e instanceof Error) {
  //       setValidationErrors((prev) => ({ ...prev, [field]: e.message }));
  //     }
  //   }
  // };

  // Handle file changes (local states + Redux update)
  const handleFileChange = async (
    files: FileWithPreview[],
    field: keyof typeof formValues
  ) => {
    switch (field) {
      case "government_id_file":
        setGovtIdFiles(files);
        break;
      case "proof_of_address_file":
        setAddressProofFiles(files);
        break;
      case "live_selfie_file":
        setProfilePhotoFiles(files);
        break;
      case "partnership_agreement_file":
        setPartnershipFiles(files);
        break;
      case "contracts_file":
        setContractsFiles(files);
        break;
      case "nda_file":
        setNdaFiles(files);
        break;
      default:
        break;
    }

    const file = files.length ? (files[0] as File) : null;
    dispatch(updateFormValue({ field, value: file }));
    dispatch(clearFieldError(field));
    dispatch(setFieldTouched({ field, touched: true }));

    try {
      await kycValidationSchema.validateAt(field, {
        ...formValues,
        [field]: file,
      });
      setValidationErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    } catch (e) {
      if (e instanceof Error) {
        setValidationErrors((prev) => ({ ...prev, [field]: e.message }));
      }
    }
  };

  // Form submission
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setValidationErrors({});
  //   dispatch(clearGlobalError());

  //   try {
  //     await kycValidationSchema.validate(formValues, { abortEarly: false });

  //     const formData = new FormData();
  //     Object.entries(formValues).forEach(([key, value]) => {
  //       if (value instanceof File) {
  //         formData.append(key, value);
  //       } else if (value) {
  //         formData.append(key, value as string);
  //       }
  //     });

  //     // dispatch returns an action with payload as the API response
  //     const resultAction = await dispatch(updateKyc(formData)).unwrap();
  //     console.log("kyc response ", resultAction);
  //     console.log("KYC status:", resultAction.status);
  //     console.log("KYC message:", resultAction.message);
  //     // Check response status
  //     if (resultAction.status === false || resultAction.status === 200) {
  //       // For example, show alert and prevent immediate navigation
  //       await Swal.fire({
  //         title: "Waiting for admin approval",
  //         text: resultAction.message || "Your KYC is pending admin approval.",
  //         icon: "info",
  //         confirmButtonText: "OK",
  //       });
  //       // Optionally, you may choose to remain on page or reset form
  //       dispatch(resetKycForm());
  //       // Reset local file states to clear previews
  //       setGovtIdFiles([]);
  //       setAddressProofFiles([]);
  //       setProfilePhotoFiles([]);
  //       setPartnershipFiles([]);
  //       setContractsFiles([]);
  //       setNdaFiles([]);
  //     } else {
  //       // Success path: reset form, navigate
  //       dispatch(resetKycForm());
  //       navigate("/dashboard");
  //     }
  //   } catch (error) {
  //     if (error instanceof Yup.ValidationError) {
  //       const errs: Record<string, string> = {};
  //       error.inner.forEach((validationError) => {
  //         if (validationError.path)
  //           errs[validationError.path] = validationError.message;
  //       });
  //       setValidationErrors(errs);
  //     } else {
  //       console.error("Submission error", error);
  //       // dispatch(resetKycForm());
  //     }
  //   }
  // };

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    dispatch(clearGlobalError());

    try {
      await kycValidationSchema.validate(formValues, { abortEarly: false });

      const formData = new FormData();
      Object.entries(formValues).forEach(([key, value]) => {
        if (value instanceof File) formData.append(key, value);
        else if (value) formData.append(key, value as string);
      });

      govtIdFiles.forEach((f) => formData.append("government_id_file", f));
      addressProofFiles.forEach((f) =>
        formData.append("proof_of_address_file", f)
      );
      profilePhotoFiles.forEach((f) => formData.append("live_selfie_file", f));
      partnershipFiles.forEach((f) =>
        formData.append("partnership_agreement_file", f)
      );
      contractsFiles.forEach((f) => formData.append("contracts_file", f));
      ndaFiles.forEach((f) => formData.append("nda_file", f));

      const resultAction = await dispatch(updateKyc(formData)).unwrap();

      if (resultAction.status === false) {
        await Swal.fire({
          title: "Waiting for admin approval",
          text: resultAction.message || "Your KYC is pending admin approval.",
          icon: "info",
          confirmButtonText: "OK",
        });

        dispatch(resetKycForm());
        setGovtIdFiles([]);
        setAddressProofFiles([]);
        setProfilePhotoFiles([]);
        setPartnershipFiles([]);
        setContractsFiles([]);
        setNdaFiles([]);
      } else {
        dispatch(resetKycForm());
        navigate("/dashboard");
      }
    } catch (e) {
      if (e instanceof Yup.ValidationError) {
        const errs: Record<string, string> = {};
        e.inner.forEach((err) => {
          if (err.path) errs[err.path] = err.message;
        });
        setValidationErrors(errs);
      } else {
        console.error("Submission error", e);
      }
    }
  };

  return (
    <>
      <div className="relative flex flex-col items-center w-full overflow-hidden to-custom-800 bg-gradient-to-r from-custom-900 dark:to-custom-900 dark:from-custom-950">
        <ModernImage />
        <div className="bg-white rounded z-10 relative dark:bg-zink-700 dark:text-zink-100 min-h-[calc(100vh_-_theme('spacing.4')_*_2)] max-w-[950px] w-full my-4 border card border-custom-200 dark:border-custom-800">
          <div className="card-body">
            <div className="mt-8 text-center">
              <h4 className="mb-2 text-slate-900 font-bold dark:text-zink-200">
                Register KYC Details
              </h4>
              <p className="mb-6 text-slate-500 dark:text-zink-200">
                We are reviewing your details. Please check after admin
                approval!
              </p>
            </div>

            {/* Display global error */}
            {globalError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {globalError}
              </div>
            )}

            {/* Display success message */}
            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                KYC details submitted successfully!
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-x-5 gap-5 md:grid-cols-2 xl:grid-cols-2 my-5">
                <div className="mb-3">
                  <label className="inline-block mb-2 text-base font-medium">
                    Select Government ID Proof
                  </label>
                  <DynamicInput
                    type="select"
                    options={defaultIdProofOptions}
                    value={formValues.government_id_type}
                    onChange={(val: string) =>
                      handleInputChange("government_id_type", val)
                    }
                    className="border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                    placeholder="Select ID Proof"
                    error={getCombinedError("government_id_type")}
                    inputRef={refs.government_id_type}
                  />
                </div>

                <div className="mb-3">
                  <label className="inline-block mb-2 text-base font-medium">
                    Government ID Number
                  </label>
                  <DynamicInput
                    type="text"
                    name="government_id_number"
                    value={formValues.government_id_number}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("government_id_number", e.target.value)
                    }
                    placeholder="Government ID Number"
                    className="form-input border-slate-200 dark:border-zink-500"
                    error={getCombinedError("government_id_number")}
                    autoFocus={true}
                    inputRef={refs.government_id_number}
                  />
                </div>

                <div className="mb-3">
                  <label className="inline-block mb-2 text-base font-medium">
                    Tax ID
                  </label>
                  <DynamicInput
                    type="text"
                    name="tax_id"
                    value={formValues.tax_id}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("tax_id", e.target.value)
                    }
                    placeholder="Tax ID"
                    className="form-input border-slate-200 dark:border-zink-500"
                    error={getCombinedError("tax_id")}
                    inputRef={refs.tax_id}
                  />
                </div>

                <div className="mb-3">
                  <label className="inline-block mb-2 text-base font-medium">
                    Address Line
                  </label>
                  <DynamicInput
                    type="text"
                    name="address_line"
                    value={formValues.address_line}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("address_line", e.target.value)
                    }
                    placeholder="Address Line"
                    className="form-input border-slate-200 dark:border-zink-500"
                    error={getCombinedError("address_line")}
                    inputRef={refs.address_line}
                  />
                </div>

                <div className="mb-3">
                  <label className="inline-block mb-2 text-base font-medium">
                    State ID
                  </label>
                  <DynamicInput
                    type="select"
                    options={states} // array of { label, value } fetched from API
                    value={formValues.state_id}
                    onChange={(val: string) =>
                      handleInputChange("state_id", val)
                    }
                    className="border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                    placeholder="Select State"
                    error={getCombinedError("state_id")}
                  />
                </div>

                <div className="mb-3">
                  <label className="inline-block mb-2 text-base font-medium">
                    District ID
                  </label>
                  {/* District select */}
                  <DynamicInput
                    type="select"
                    options={districts} // filtered districts based on selected state
                    value={formValues.district_id}
                    onChange={(val: string) =>
                      handleInputChange("district_id", val)
                    }
                    className="border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                    placeholder="Select District"
                    error={getCombinedError("district_id")}
                    disabled={!formValues.state_id} // disable if no state selected
                  />
                </div>

                <div className="mb-3">
                  <label className="inline-block mb-2 text-base font-medium">
                    City ID
                  </label>
                  {/* City select */}
                  <DynamicInput
                    type="select"
                    options={cities} // filtered cities based on selected district
                    value={formValues.city_id}
                    onChange={(val: string) =>
                      handleInputChange("city_id", val)
                    }
                    className="border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                    placeholder="Select City"
                    error={getCombinedError("city_id")}
                    disabled={!formValues.district_id} // disable if no district selected
                  />
                </div>

                <div className="mb-3">
                  <label className="inline-block mb-2 text-base font-medium">
                    Postal Code
                  </label>
                  <DynamicInput
                    type="text"
                    name="postal_code"
                    value={formValues.postal_code}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("postal_code", e.target.value)
                    }
                    placeholder="Postal Code"
                    className="form-input border-slate-200 dark:border-zink-500"
                    error={getCombinedError("postal_code")}
                  />
                </div>

                <div className="mb-3">
                  <FileUpload
                    files={govtIdFiles}
                    onFilesChange={(files) => {
                      setGovtIdFiles(files);
                      handleFileChange(files, "government_id_file");
                    }}
                    label="Upload Government ID Proof"
                    multiple={false}
                    className="dark:bg-zink-700"
                    error={getCombinedError("government_id_file")}
                  />
                </div>

                <div className="mb-3">
                  <FileUpload
                    files={addressProofFiles}
                    onFilesChange={(files) => {
                      setAddressProofFiles(files);
                      handleFileChange(files, "proof_of_address_file");
                    }}
                    label="Upload Address Proof"
                    multiple={false}
                    className="dark:bg-zink-700"
                    error={getCombinedError("proof_of_address_file")}
                  />
                </div>

                <div className="mb-3">
                  <FileUpload
                    files={profilePhotoFiles}
                    onFilesChange={(files) => {
                      setProfilePhotoFiles(files);
                      handleFileChange(files, "live_selfie_file");
                    }}
                    label="Upload Live Selfie"
                    multiple={false}
                    className="dark:bg-zink-700"
                    error={getCombinedError("live_selfie_file")}
                  />
                </div>

                <div className="mb-3">
                  <FileUpload
                    files={partnershipFiles}
                    onFilesChange={(files) => {
                      setPartnershipFiles(files);
                      handleFileChange(files, "partnership_agreement_file");
                    }}
                    label="Upload Partnership Agreement"
                    multiple={false}
                    className="dark:bg-zink-700"
                    error={getCombinedError("partnership_agreement_file")}
                  />
                </div>

                <div className="mb-3">
                  <FileUpload
                    files={contractsFiles}
                    onFilesChange={(files) => {
                      setContractsFiles(files);
                      handleFileChange(files, "contracts_file");
                    }}
                    label="Upload Contracts"
                    multiple={false}
                    className="dark:bg-zink-700"
                    error={getCombinedError("contracts_file")}
                  />
                </div>

                <div className="mb-3">
                  <FileUpload
                    files={ndaFiles}
                    onFilesChange={(files) => {
                      setNdaFiles(files);
                      handleFileChange(files, "nda_file");
                    }}
                    label="Upload NDA"
                    multiple={false}
                    className="dark:bg-zink-700"
                    error={getCombinedError("nda_file")}
                  />
                </div>
              </div>

              <div className="mt-10 mx-auto w-fit">
                <button
                  type="submit"
                  disabled={loading}
                  className={`text-white btn bg-custom-500 border-custom-500 hover:bg-custom-600 focus:ring focus:ring-custom-100 active:bg-custom-600 dark:ring-custom-400/20 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Submitting..." : "Register KYC Details"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default KycForm;
