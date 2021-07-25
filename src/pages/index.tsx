import { GetServerSideProps, GetStaticProps } from "next";
import Head from "next/head";
import Image from 'next/image'

import SubscribeButton from "../components/SubscribeButton";
import { stripe } from "../services/stripe";

import styles from "./home.module.scss";

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({product}:HomeProps) {
  return (
    <>
      <Head>
        <title>ignews | Home</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, Welcome</span>
          <h1>
            {" "}
            News about the <span>React</span> world.
          </h1>
          <p>
            Get acess to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  );
}

// export const getServerSideProps: GetServerSideProps = async () => {
export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve("price_1JGaACFP1FKESbtlLc3Htkrp", { 
    expand: ["product"]
  });

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price.unit_amount / 100)
  }

  return {
    props: {
      product
    },
    //somente no staticProps eu preciso colocar quanto tempo essa pag vai ser revalidada
    revalidate: 60 * 60 * 24 //60seg * 60 = 1hora * 24 = 24horas... renova a cada 24horas
  };
};
