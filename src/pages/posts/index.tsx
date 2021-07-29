import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";

import Prismic from "@prismicio/client";
import { RichText } from "prismic-dom";

import styles from "./styles.module.scss";

import { getPrismicClient } from "../../services/prismic";

type Post = {
  slug: string,
  title: string,
  excerpt: string,
  updatedAt: string
}

interface PostsProps {
  posts: Post[]
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map( post => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  )  
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const res = await prismic.query([
      Prismic.predicates.at("document.type", "post")
    ], {
      fetch: ["post.title", "post.content"],
      pageSize: 50
    }
  )

  const posts = res.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt: post.data.content.find(content => content.type === "paragraph")?.text ?? "",
      updatedAt: new Date(post.last_publication_date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      })
    };
  })

  return {
    props: {
      posts
    },
    revalidate: 60 * 60 //60seg * 60 = 1hora  renova a cada 1hora
  };
};
