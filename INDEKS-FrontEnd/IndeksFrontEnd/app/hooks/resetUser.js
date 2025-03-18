import { useContext } from "react";
import AuthContext from "../auth/context";
const { setUser } = useContext(AuthContext);

export const resetUser = () => {
  setUser(null);
};
