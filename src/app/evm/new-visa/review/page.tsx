// import { getReviewVisaForm } from "@/actions/review";
import { getReviewVisaForm } from "@/actions/review";
import VisaReviewLayout from "@/components/custom/VisaReviewLayout";
import axios from "@/config";
import { unstable_cache as cache } from "next/cache";
import React from "react";

type Props = {};

const page = async (props: Props) => {
  const { visa_form, data_dictionary } = await getReviewVisaForm();
  console.log(visa_form, "data_dictionary", data_dictionary);

  return (
    <VisaReviewLayout
      formData={visa_form ?? []}
      dataDictionary={data_dictionary}
    />
  );
};

export default page;
