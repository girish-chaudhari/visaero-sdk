"use server";

import axios from "@/config";
import API from "@/services/api";

const host = "visaero";
const user_id = "6661e183111e64be598b4aa1";

export const getTravellingTo = async (obj: {
  nationality: string;
  origin: string;
}) => {
  console.log("works", obj, host);
  const { nationality = "", origin = "" } = obj;

  let request = await axios.post(API.getTravellingto, {
    host,
    nationality,
    origin,
    user_id,
  });
  console.log("request from server>>", request.data);
  return request.data;
};

interface GetVisaOffers {
  type: "qr-visa";
  travelling_to_identity: string;
  travelling_to: string;
  nationality: string;
  // host: string;
  currency: string;
  // user_id: string;
  managed_by: "master" | "host";
}

// let d = {
//   type: "qr-visa",
//   travelling_to_identity: "IND_IND_ARE",
//   travelling_to: "United Arab Emirates",
//   nationality: "India",
//   host: "visaero",
//   currency: "USD",
//   user_id: "6661e183111e64be598b4aa1",
//   managed_by: "master",
// };

export const getVisaOffers = async (obj: GetVisaOffers) => {
  console.log("works", obj, host);
  let payload = { ...obj, host, user_id };
  let request = await axios.post(API.getVisaOffers, payload
  //   {
  //   type: "qr-visa",
  //   travelling_to_identity: "IND_IND_ATG",
  //   travelling_to: "Antigua and Barbuda",
  //   nationality: "India",
  //   host: "visaero",
  //   currency: "USD",
  //   user_id: "6661e807184be5ea807a0514",
  //   managed_by: "master",
  // }
);
  console.log("request from server>>", request.data);
  return request.data;
};
