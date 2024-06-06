"use server";

import axios from "@/config";
import API from "@/services/api";

const host = "visaero";
const user_id = "65d2dff5c071caa141152f17";

export const getTravellingTo = async (obj: {
  nationality: string;
  origin: string;
}) => {
  //   const formData = new FormData();
  //   let a = formData.get('nationality')
  // queryKey: [string,{nationality: string, origin: string}]
  //   console.log('form', a)
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

export const getTravellingToForm = async (formData: FormData) => {
  // queryKey: [string,{nationality: string, origin: string}]
  //   console.log("works", obj, host);
  //   const [_, obj] = queryKey;
  //   const { nationality = "", origin = "" } = obj;
  // let nationality = "", origin = ""
  const origin = formData.get("nationality");
  const nationality = formData.get("nationality");
  console.log("works", nationality, host);
  let request = await axios.post(API.getTravellingto, {
    host,
    nationality,
    origin,
    user_id,
  });
  console.log("request from server>>", request.data);
  return request.data;
};
