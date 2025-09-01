import * as Yup from "yup";

export const kycValidationSchema = Yup.object({
  government_id_type: Yup.string().required("Government ID type is required"),
  government_id_number: Yup.string().required(
    "Government ID number is required"
  ),
  tax_id: Yup.string().required("Tax ID is required"),
  address_line: Yup.string().required("Address line is required"),
  state_id: Yup.string().required("State ID is required"),
  district_id: Yup.string().required("District ID is required"),
  city_id: Yup.string().required("City ID is required"),
  postal_code: Yup.string().required("Postal code is required"),
  government_id_file: Yup.mixed().required("Government ID file is required"),
  proof_of_address_file: Yup.mixed().required("Address proof file is required"),
  live_selfie_file: Yup.mixed().required("Live selfie is required"),
  partnership_agreement_file: Yup.mixed().nullable(),
  contracts_file: Yup.mixed().nullable(),
  nda_file: Yup.mixed().nullable(),
});
