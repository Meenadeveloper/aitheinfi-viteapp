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
    focusedField,
  } = useAppSelector(selectKycFormState);
  const navigate = useNavigate();

  // Ref for autofocus
  // Local validation errors
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  document.title = "Register | Tailwick - React Admin & Dashboard Template";

  // Refs for inputs to manage autofocus
  const refs = {
    government_id_type: useRef<any>(null),
    government_id_number: useRef<HTMLInputElement>(null),
    tax_id: useRef<HTMLInputElement>(null),
    address_line: useRef<HTMLInputElement>(null),
    state_id: useRef<any>(null),
    district_id: useRef<any>(null),
    city_id: useRef<any>(null),
    postal_code: useRef<HTMLInputElement>(null),
    government_id_file: useRef<any>(null),
    proof_of_address_file: useRef<any>(null),
    live_selfie_file: useRef<any>(null),
    partnership_agreement_file: useRef<any>(null),
    contracts_file: useRef<any>(null),
    nda_file: useRef<any>(null),
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

  // Handle autofocus based on focusedField from Redux
  // useEffect(() => {
  //   if (focusedField && refs[focusedField as keyof typeof refs]?.current) {
  //     const fieldRef = refs[focusedField as keyof typeof refs];

  //     setTimeout(() => {
  //       if (fieldRef.current) {
  //         // For react-select components
  //         if (
  //           fieldRef.current.focus &&
  //           typeof fieldRef.current.focus === "function"
  //         ) {
  //           fieldRef.current.focus();
  //         }
  //         // For file upload components with imperative handle
  //         else if (
  //           fieldRef.current.focus &&
  //           typeof fieldRef.current.focus === "function"
  //         ) {
  //           fieldRef.current.focus();
  //         }
  //         // For regular input elements
  //         else if (
  //           fieldRef.current.tagName === "INPUT" ||
  //           fieldRef.current.tagName === "TEXTAREA"
  //         ) {
  //           fieldRef.current.focus();
  //         }
  //         // Try to find input inside container
  //         else {
  //           const input = fieldRef.current.querySelector(
  //             'input, textarea, [role="combobox"]'
  //           );
  //           if (input && typeof input.focus === "function") {
  //             input.focus();
  //           }
  //         }
  //       }
  //     }, 150);
  //   }
  // }, [focusedField]);

  // Handle autofocus based on focusedField from Redux
  useEffect(() => {
    if (!focusedField) return;

    const fieldRef = refs[focusedField as keyof typeof refs];
    if (!fieldRef?.current) return;

    const focusElement = () => {
      try {
        // For react-select components
        if (
          fieldRef.current?.focus &&
          typeof fieldRef.current.focus === "function"
        ) {
          fieldRef.current.focus();
          return true;
        }

        // For file upload components with imperative handle
        if (
          fieldRef.current?.focus &&
          typeof fieldRef.current.focus === "function"
        ) {
          fieldRef.current.focus();
          return true;
        }

        // For regular input/textarea elements
        if (
          fieldRef.current?.tagName === "INPUT" ||
          fieldRef.current?.tagName === "TEXTAREA"
        ) {
          fieldRef.current.focus();
          return true;
        }

        // Try to find focusable elements inside container
        const focusableElement = fieldRef.current.querySelector(
          'input, textarea, [role="combobox"], [tabindex="0"]'
        );
        if (focusableElement && typeof focusableElement.focus === "function") {
          focusableElement.focus();
          return true;
        }

        return false;
      } catch (error) {
        console.warn("Focus error:", error);
        return false;
      }
    };

    // Try multiple times with increasing delays for better reliability
    const attemptFocus = () => {
      if (!focusElement()) {
        setTimeout(() => {
          if (!focusElement()) {
            setTimeout(() => {
              focusElement();
            }, 300);
          }
        }, 150);
      }
    };

    // Initial attempt
    setTimeout(attemptFocus, 50);
  }, [focusedField]);

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

 const [kycAdminVerified, setKycAdminVerified] = useState(null);
 const [kycUploaded, setKycUploaded] = useState(null);

  useEffect(() => {
    const fetchKycStatus = async () => {
      try {
        const response = await axiosInstance.get("getuser");
        const isVerified = response.data?.user?.kyc_verified;
        const isKycUploaded = response.data?.kyc_uploaded;
    
      setKycUploaded(isKycUploaded);
      setKycAdminVerified(isVerified);

      console.log("kyccccc uploaded", isKycUploaded);
      console.log("kyccccc sta", isVerified);

        if (isVerified) {
          navigate("/dashboard");
        } else {
          if (isKycUploaded === true) {
            await Swal.fire({
              title: "KYC Not Verified",
              text: "Your KYC is pending admin approval.",
              icon: "info",
              confirmButtonText: "OK",
            });
            console.log("kyc uploaded status", kycUploaded);
          }
           
          console.log("kyc not verified")
        }
      } catch (error) {
        console.error("Failed to fetch KYC status", error);
        // Optionally handle error here
      }
    };

     fetchKycStatus();
  }, [navigate]);

  // Form submit handler with autofocus on first error field
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
      console.log("response data", resultAction);

      if (kycAdminVerified === false) {
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
        const newErrors: Record<string, string> = {};
        const newTouched: Record<string, boolean> = {};

        e.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path] = err.message;
            newTouched[err.path] = true;
          }
        });

        setValidationErrors(newErrors);

        // Set touched fields
        Object.keys(newTouched).forEach((field) => {
          dispatch(
            setFieldTouched({
              field: field as keyof typeof formValues,
              touched: true,
            })
          );
        });

        // Autofocus first error field
        const firstErrorField = Object.keys(newErrors)[0];
        if (firstErrorField) {
          dispatch(setFocusedField(""));
          setTimeout(() => {
            dispatch(setFocusedField(firstErrorField));
          }, 10);
        }
      } else {
        console.error("Submission error", e);
      }
    }
  };

  // Add this to your KYC form component for debugging
  useEffect(() => {
    console.log("Focused field changed:", focusedField);
    console.log("Available refs:", Object.keys(refs));
    console.log(
      "Ref exists:",
      !!refs[focusedField as keyof typeof refs]?.current
    );
  }, [focusedField]);

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
                    onBlur={() => handleBlur("government_id_type")}
                    className=" border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                    placeholder="Select ID Proof"
                    error={getCombinedError("government_id_type")}
                    ref={refs.government_id_type}
                    autoFocus={focusedField === "government_id_type"}
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
                    className="form-input  dark:border-zink-500"
                    error={getCombinedError("government_id_number")}
                    onBlur={() => handleBlur("government_id_number")}
                    ref={refs.government_id_number}
                    autoFocus={focusedField === "government_id_number"}
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
                    className="form-input  dark:border-zink-500"
                    onBlur={() => handleBlur("tax_id")}
                    error={getCombinedError("tax_id")}
                    ref={refs.tax_id}
                    autoFocus={focusedField === "tax_id"}
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
                    className="form-input dark:border-zink-500"
                    error={getCombinedError("address_line")}
                    ref={refs.address_line}
                    onBlur={() => handleBlur("address_line")}
                    autoFocus={focusedField === "address_line"}
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
                    onBlur={() => handleBlur("state_id")}
                    ref={refs.state_id}
                    autoFocus={focusedField === "state_id"}
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
                    onBlur={() => handleBlur("district_id")}
                    className="border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                    placeholder="Select District"
                    error={getCombinedError("district_id")}
                    disabled={!formValues.state_id} // disable if no state selected
                    ref={refs.district_id}
                    autoFocus={focusedField === "district_id"}
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
                    onBlur={() => handleBlur("city_id")}
                    ref={refs.city_id}
                    autoFocus={focusedField === "city_id"}
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
                    className="form-input  dark:border-zink-500"
                    error={getCombinedError("postal_code")}
                    onBlur={() => handleBlur("postal_code")}
                    ref={refs.postal_code}
                    autoFocus={focusedField === "postal_code"}
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
                    autoFocus={focusedField === "government_id_file"}
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
                    autoFocus={focusedField === "proof_of_address_file"}
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
                    autoFocus={focusedField === "live_selfie_file"}
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
                    autoFocus={focusedField === "partnership_agreement_file"}
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
                    autoFocus={focusedField === "contracts_file"}
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
                    autoFocus={focusedField === "nda_file"}
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
