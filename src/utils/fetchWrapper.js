import { URL_BASE } from "./config";

export const fetchWrapper = async (params = {}) => {
  const stringifiedParams = Object.keys(params)
    .map((param) => `${param}=${params[param]}`)
    .join("&");
  const url = [URL_BASE, stringifiedParams].join("?");

  // Keep calling untill successful return
  while (true) {
    try {
      return await fetch(url).then((data) => {
        if (data.status >= 400 && data.status < 600) {
          throw new Error("Bad response from server");
        }
        return data.json();
      });
    } catch (err) {
      // Should log to the relevant logging platform
      console.error(err);
    }
  }
};
