import axios from "axios";
import { CHAT_URL } from "./constants";

async function fetchData(
  params = null,
  url = CHAT_URL,
  mode = "get",
  custom = false
) {
  if (!params) {
    return null;
  }
  try {
    console.log("fetchData");
    console.log(params);
    const response =
      mode === "get"
        ? await axios.get(
            url,
            custom
              ? params
              : {
                  params: {
                    details: JSON.stringify(params),
                  },
                }
          )
        : await axios.post(
            url,
            custom
              ? params
              : {
                  params: {
                    details: JSON.stringify(params),
                  },
                }
          );

    const resp = response.data;
    console.log("resp");
    console.log(resp);
    return resp;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export { fetchData };
