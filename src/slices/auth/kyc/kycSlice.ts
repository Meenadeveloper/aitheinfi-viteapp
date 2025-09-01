import { createSlice, createAsyncThunk,  } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { apiForFiles } from "../../../Services/axiosInstance"; // your axios instance for multipart/form-data
import type { RootState } from "../..";

// Async thunk for KYC API call
export const updateKyc = createAsyncThunk<
  any, // Return type, adjust according to API result
  FormData, // Argument type
  {
    rejectValue: { fieldErrors?: Record<string, string>; globalError?: string };
  }
>("kycForm/updatekyc", async (formData, { rejectWithValue }) => {
  try {
    const response = await apiForFiles.post("updatekyc", formData);
      return response.data;
    //   if (response.status === 200) {
    //     return response.data; // payload with status/message from API body
    //   } else {
    //     return rejectWithValue({
    //       globalError: `HTTP error ${response.status}`,
    //     });
    //   }
  } catch (err: any) {
    // Extract and shape backend errors
    if (err.response?.data?.errors) {
      return rejectWithValue({ fieldErrors: err.response.data.errors });
    }
    return rejectWithValue({
      globalError:
        err.response?.data?.message || err.message || "Unknown error",
    });
  }
});


interface FormValues {
  government_id_type: string;
  government_id_number: string;
  tax_id: string;
  address_line: string;
  state_id: string;
  district_id: string;
  city_id: string;
  postal_code: string;
  // For files, use File[] or File objects as appropriate
  government_id_file: File | null;
  proof_of_address_file: File | null;
  live_selfie_file: File | null;
  partnership_agreement_file: File | null;
  contracts_file: File | null;
  nda_file: File | null;
}


interface FieldErrors {
  [field: string]: string;
}
interface Touched {
  [field: string]: boolean;
}

interface KycFormState {
  loading: boolean;
  success: boolean;
  globalError: string | null;
  fieldErrors: FieldErrors;
  touched: Touched;
  formValues: FormValues;
  focusedField: string | null; // autofocus field name or null
}

const initialState: KycFormState = {
  loading: false,
  success: false,
  globalError: null,
  fieldErrors: {},
  formValues: {
    government_id_type: "",
    government_id_number: "",
    tax_id: "",
    address_line: "",
    state_id: "",
    district_id: "",
    city_id: "",
    postal_code: "",
    government_id_file: null,
    proof_of_address_file: null,
    live_selfie_file: null,
    partnership_agreement_file: null,
    contracts_file: null,
    nda_file: null,
  },
  focusedField: null,
  touched: {} as Touched,
};

const kycSlice = createSlice({
  name: "kycForm",
  initialState,
  reducers: {
    // Mark a field as touched or untouched
    setFieldTouched(
      state,
      action: PayloadAction<{ field: keyof FormValues; touched: boolean }>
    ) {
      const { field, touched } = action.payload;
      state.touched[field] = touched;
    },
    clearFieldError(state, action: PayloadAction<string>) {
      delete state.fieldErrors[action.payload];
    },
    clearGlobalError(state) {
      state.globalError = null;
    },
    resetKycForm(state) {
      state.loading = false;
      state.success = false;
      state.globalError = null;
      state.fieldErrors = {};
      // Reset form values as well
      state.formValues = initialState.formValues;
      state.touched = {};
      state.focusedField = null;
    },
    // Add form field updater
    updateFormValue(
      state,
      action: PayloadAction<{ field: keyof FormValues; value: any }>
    ) {
      const { field, value } = action.payload;
      state.formValues[field] = value;
    },
    // Clear all touched statuses if needed
    clearTouched(state) {
      state.touched = {};
    },

    setFocusedField(state, action: PayloadAction<string | null>) {
      state.focusedField = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateKyc.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.globalError = null;
        state.fieldErrors = {};
      })
      .addCase(updateKyc.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateKyc.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        if (action.payload?.fieldErrors) {
          state.fieldErrors = action.payload.fieldErrors;
        }
        if (action.payload?.globalError) {
          state.globalError = action.payload.globalError;
        }
      });
  },
});

export const {
  clearFieldError,
  clearGlobalError,
  resetKycForm,
  updateFormValue,
  setFocusedField,
  setFieldTouched,
  clearTouched,
} = kycSlice.actions;

export default kycSlice.reducer;

// Selector example
export const selectKycFormState = (state: RootState) => state.kycForm;
