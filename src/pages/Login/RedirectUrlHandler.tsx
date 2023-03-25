import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { User } from "../../interfaces/User";
import { getUserByID,updateVerificationAndAdminFlag } from "../../services/firestoreService";

function RedirectHandler() {
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const verificationId = searchParams.get("verificationId");
    const email = searchParams.get("email");

    if (verificationId && email) {
      const isTheUserFromMODDOT = /@modot.mo.gov\s*$/.test(email);
      // const isTheUserFromMODDOT = /@gmail.com\s*$/.test(email);
      getUserByID(verificationId).then((userDoc) => {
        console.log("Get user by id after redirecting: "+userDoc.email);
        if (email === userDoc.email)
          updateVerificationAndAdminFlag(
            verificationId,
            isTheUserFromMODDOT,
            isTheUserFromMODDOT
          );
      });
    }
  }, [history, location]);

  return null;
}

export default RedirectHandler;
