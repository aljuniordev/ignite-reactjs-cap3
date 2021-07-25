import { signIn, useSession } from "next-auth/client";
import { api } from "../../services/api";
import { toast } from "react-toastify";
import { getStripeJs } from "../../services/stripe-js";
import styles from "./styles.module.scss";

interface SubscribeButtonProps {
  priceId: string;
}

export default function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const [session] = useSession();

  async function handleSubscribe() {
    if (!session) {
      signIn("github");
      return;
    }

    try {
      const response = await api.post("/subscribe"); 

      const {sessionId} = response.data;

      const stripejs = await getStripeJs()

      await stripejs.redirectToCheckout(sessionId);

    } catch (err) {
      toast.error(err.message);
      return;
    }
  }

  return (
    <button type="button" className={styles.subscribeButton}>
      Subscribe now!
    </button>
  );
}
