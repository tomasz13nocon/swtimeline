import Shell from "@layouts/shell";
import c from "./styles/settings.module.scss";
import { useAuth } from "@/context/authContext";
import Spinner from "@components/spinner";
import { useEffect, useState } from "react";
import { redirect, useNavigate } from "react-router-dom";

export default function Settings() {
  const { fetching: fetchingUser, user, sendVerificationEmail } = useAuth();
  const [error, setError] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!fetchingUser && !user) {
      navigate("/timeline");
    }
  }, [fetchingUser, user]);

  const handleVerifyEmail = async () => {
    setError(null);
    setSuccess(false);
    setFetching(true);
    try {
      await sendVerificationEmail();
      setSuccess(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setFetching(false);
    }
  };

  if (fetchingUser) {
    return (
      <Shell>
        <h1>Settings</h1>
        <Spinner />
      </Shell>
    );
  }
  return (
    <Shell>
      <h1>Settings</h1>

      <h2>Account</h2>
      {user?.emailUnverified && (
        <div className="warning">
          <div className={c.emailUnverifiedWarningText}>
            Your email is unverified. Please check your inbox for a verification email.
          </div>
          <button
            className={c.resendEmailBtn}
            onClick={handleVerifyEmail}
            aria-busy={fetching}
            disabled={fetching}
          >
            {fetching ? (
              <Spinner size={16} className={c.btnSpinner} />
            ) : (
              "Resend verification email"
            )}
          </button>
          {error && <div className="error slim">{error}</div>}
          {success && <div className="success slim">Email sent!</div>}
        </div>
      )}
    </Shell>
  );
}