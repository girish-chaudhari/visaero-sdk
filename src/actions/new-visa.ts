"use server";

import axios from "@/config";
import API from "@/services/api";

const host = "visaero";
const user_id = "65d2dff5c071caa141152f17";

export const getTravellingTo = async (obj: {
  nationality: string;
  origin: string;
}) => {
  // queryKey: [string,{nationality: string, origin: string}]
  console.log("works", obj, host);
  //   const [_, obj] = queryKey;
  const { nationality = "", origin = "" } = obj;
  // let nationality = "", origin = ""

  let request = await axios.post(API.getTravellingto, {
    host,
    nationality,
    origin,
    user_id,
  });
  console.log("request from server>>", request.data);
  return request.data;
};
