import  { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import axiosInstance, { setAccessToken } from "../../../Services/axiosInstance"; // Correct path to your axiosInstance file
import img1 from "../../../assets/images/auth/img-01.png";
// import Swal from "sweetalert2";

const LoginBoxed = () => {
  const navigate = useNavigate();
  document.title = "Sign In | Tailwick - React Admin & Dashboard Template";

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

 const validation = useFormik({
   enableReinitialize: true,
   initialValues: {
     email: "",
     password: "",
   },
   validationSchema: Yup.object({
     email: Yup.string()
       .email("Invalid email format")
       .required("Please Enter Your email"),
     password: Yup.string().required("Please Enter Your Password"),
   }),

  onSubmit: async (values, { setErrors }) => {
  setErrorMsg(null);

  const uniqueCodeData = localStorage.getItem("uniqueCodeData");
  let unique_code: string | null = null;

  if (uniqueCodeData) {
    try {
      const parsed = JSON.parse(uniqueCodeData);
      unique_code = parsed?.unique_code ?? null;
    } catch {
      unique_code = null;
    }
  }

  if (!unique_code) {
    setErrorMsg(
      "Unique code is required. Please verify your unique code before login."
    );
    return;
  }

  try {
    const response = await axiosInstance.post("login", {
      email: values.email,
      password: values.password,
      unique_code,
    });

    const { token, user } = response.data;

    if (token) {
      localStorage.setItem("access_token", token);

      // Save user role as well
      if (user?.roles) {
        localStorage.setItem("role", user.roles);
      }

      // Save user kyc status
      if (user?.kyc_verified) {
        localStorage.setItem("kyc_status", user.kyc_verified);
      }

      setAccessToken(token);
     if (user?.kyc_verified === true) {
       navigate("/dashboard");
     } else {
      //  await Swal.fire({
      //    title: "Waiting for admin approval",
      //    text: "Your KYC verification is pending approval from admin.",
      //    icon: "info",
      //    confirmButtonText: "OK",
      //  });
       navigate("/kyc-form");
     }
      
    } else {
      setErrorMsg("Login failed: token not received.");
    }
  } catch (error: any) {
    if (error.response?.data?.errors) {
      const backendErrors = error.response.data.errors;
      const formikErrors: { [key: string]: string } = {};
      for (const key in backendErrors) {
        if (Array.isArray(backendErrors[key]) && backendErrors[key].length > 0) {
          formikErrors[key] = backendErrors[key][0];
        }
      }
      setErrors(formikErrors);
    } else if (error.response?.data?.message) {
      setErrorMsg(error.response.data.message);
    } else {
      setErrorMsg("Login failed. Please check your credentials and try again.");
    }
  }
},

 });


  return (
    <>
      <div className="flex items-center justify-center min-h-screen px-4 py-16 bg-cover bg-auth-pattern dark:bg-auth-pattern-dark dark:text-zink-100 font-public">
        <div className="mb-0 border-none shadow-none xl:w-2/3 card bg-white/70 dark:bg-zink-500/70">
          <div className="grid grid-cols-1 gap-0 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="!px-12 !py-12 card-body">
                <div className="text-center">
                  <h4 className="mb-2 text-purple-500 dark:text-purple-500">
                    Welcome Back !
                  </h4>
                  <p className="text-slate-500 dark:text-zink-200">
                    Sign in to continue to Tailwick.
                  </p>
                </div>

                {errorMsg && (
                  <div
                    className="px-4 py-3 mb-3 text-sm text-red-500 border border-red-200 rounded-md bg-red-50 dark:bg-red-400/20 dark:border-red-500/50"
                    role="alert"
                  >
                    {errorMsg}
                  </div>
                )}

                <form
                  onSubmit={validation.handleSubmit}
                  className="mt-10"
                  id="signInForm"
                >
                  {/* Email and Password fields with validation from your original code */}

                  <div className="mb-3">
                    <label
                      htmlFor="email"
                      className="inline-block mb-2 text-base font-medium"
                    >
                      UserName/ Email ID
                    </label>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.email || ""}
                      className="form-input dark:bg-zink-600/50 border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                      placeholder="Enter username or email"
                    />
                    {validation.touched.email && validation.errors.email && (
                      <div className="mt-1 text-sm text-red-500">
                        {validation.errors.email}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="password"
                      className="inline-block mb-2 text-base font-medium"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.password || ""}
                      className="form-input dark:bg-zink-600/50 border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                      placeholder="Enter password"
                    />
                    {validation.touched.password &&
                      validation.errors.password && (
                        <div className="mt-1 text-sm text-red-500">
                          {validation.errors.password}
                        </div>
                      )}
                  </div>

                  {/* Optional "Remember me" checkbox */}
                  <div>
                    <div className="flex items-center gap-2">
                      <input
                        id="checkboxDefault1"
                        className="size-4 border rounded-sm appearance-none bg-slate-100 border-slate-200 dark:bg-zink-600/50 dark:border-zink-500 checked:bg-custom-500 checked:border-custom-500 dark:checked:bg-custom-500 dark:checked:border-custom-500 checked:disabled:bg-custom-400 checked:disabled:border-custom-400"
                        type="checkbox"
                        defaultValue=""
                      />
                      <label
                        htmlFor="checkboxDefault1"
                        className="inline-block text-base font-medium align-middle cursor-pointer"
                      >
                        Remember me
                      </label>
                    </div>
                  </div>

                  <div className="mt-10">
                    <button
                      type="submit"
                      className="w-full text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="mx-2 mt-2 mb-2 border-none shadow-none lg:col-span-7 card bg-white/60 dark:bg-zink-500/60">
              <img
                src={img1}
                alt="Login Illustration"
                className="md:max-w-[32rem] mx-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginBoxed;
