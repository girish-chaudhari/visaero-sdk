// import { getReviewVisaForm } from "@/actions/review";
import { getReviewVisaForm } from "@/actions/review";
import VisaReviewLayout from "@/components/custom/VisaReviewLayout";

type Props = {};

const page = async (props: Props) => {
  const { searchParams } = props as {
    searchParams: { application_id: string; travelling_to_identity: string };
  };
  console.log("params >>", searchParams);
  // const { application_id } = searchParams;

  const { visa_form, data_dictionary } = await getReviewVisaForm(searchParams);
  console.log(visa_form, "data_dictionary", data_dictionary);

  return (
    <VisaReviewLayout
      formData={visa_form ?? []}
      dataDictionary={data_dictionary}
    />
  );
};

export default page;
