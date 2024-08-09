import { useAuth } from "@/context/authContext";
import FetchButton from "@components/fetchButton";
import Unauthenticated from "@components/inlineAlerts/unauthenticated";
import Spinner from "@components/spinner";
import Shell from "@layouts/shell";
import { useNavigate } from "react-router-dom";
import c from "./styles/googleCallback.module.scss";
import { useFetch } from "@hooks/useFetch";
import Alert from "@components/alert";
import { useToast } from "@/context/toastContext";

export default function GoogleCallback() {
  const { user, fetchingAuth, actions } = useAuth();
  const [fetchChangeName, fetching, alert] = useFetch(actions.changeName);
  const navigate = useNavigate();
  const { pushToast } = useToast();

  async function handleNameChange(e) {
    e.preventDefault();
    let name = e.target.name.value;
    await fetchChangeName(name);

    pushToast({ title: "User name set to " + name });
    navigate("/timeline");
  }

  if (fetchingAuth) return <Spinner />;
  if (!user) return <Unauthenticated />;

  return (
    <Shell>
      <div className={c.container}>
        <h2>Almost there...</h2>
        <h1>Choose a user name</h1>
        <small className={c.note}>You can change it at any time in the settings</small>
        <Alert className={c.alert} alert={alert} />
        <form onSubmit={handleNameChange}>
          <input type="text" name="name" defaultValue={user.name} minLength={3} maxLength={32} />
          <FetchButton className={c.submit} fetching={fetching}>
            Submit
          </FetchButton>
        </form>
      </div>
    </Shell>
  );
}
