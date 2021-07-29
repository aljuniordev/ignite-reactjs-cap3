import Image from "next/image";
import Link from "next/link";

import SignInButton from "../SignInButton";
import { ActiveLink } from "../ActiveLink";

import styles from "./styles.module.scss";
import imgLogo from "../../../public/images/logo.svg";

export default function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/">
          <a>
            <Image src={imgLogo} alt="ignews"/>
          </a>
        </Link>
        <nav>
          <ActiveLink activeClassName={styles.active} href="/">
            <a>Home</a>
          </ActiveLink>
          <ActiveLink activeClassName={styles.active} href="/posts">
            <a>Posts</a>
          </ActiveLink>
        </nav>

        <SignInButton />
      </div>
    </header>
  );
}
