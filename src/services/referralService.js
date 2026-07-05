import axios from "axios";
import Cookies from "js-cookie";

const REFERRAL_API =
  "https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals";

export const getReferrals = async (
  search = "",
  sort = "desc"
) => {
  const token = Cookies.get("jwt_token");

  const response = await axios.get(REFERRAL_API, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      search,
      sort,
    },
  });

  return response.data.data;
};

export const getReferralById = async (id) => {
  const token = Cookies.get("jwt_token");

  const response = await axios.get(REFERRAL_API, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const referrals = response.data.data.referrals || [];

  return referrals.find(
    (item) => String(item.id) === String(id)
  );
};