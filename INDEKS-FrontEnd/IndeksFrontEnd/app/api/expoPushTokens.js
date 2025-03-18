import { useUser } from "../hooks/useUser";
import HttpService from "../services/HttpService";

const register = (pushToken, id) =>
  HttpService.update(`userAccount/${id}/pushToken?token=${pushToken}`, {});
export default {
  register,
};
