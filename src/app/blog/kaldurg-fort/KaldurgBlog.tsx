"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./kaldurg.module.css";
import { inter, serif, mono } from "./fonts";

const BLOG_URL = "/#blog";
const POST_DATE = "Oct 4, 2024";

const FACTS = [
  { label: "Height", value: "About 1,500 ft" },
  { label: "Climb time", value: "About 2 hrs one way" },
  { label: "Grade", value: "Easy to medium" },
  { label: "Base", value: "Waghoba Khind, near Palghar" },
];

const TIPS = [
  "Start early, so you reach the top before the heat and the crowds.",
  "Wear shoes with real grip. The rock gets slippery in the monsoon.",
  "Carry your own water and a snack, and bring your trash back down.",
  "Winter is cooler, and the monsoon turns everything green. Pick the mood you want.",
  "Keep a safe distance from the edge. The view is better when you are not nervous.",
];

export default function KaldurgBlog() {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const bar = barRef.current;
    if (!root || !bar) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const h = window.innerHeight;
      const max = document.documentElement.scrollHeight - h;
      // the photo darkens as you scroll so the text stays readable
      const a = 0.1 + 0.62 * Math.min(1, y / (h * 0.85));
      root.style.setProperty("--a", a.toFixed(3));
      bar.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add(styles.in);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    root.querySelectorAll("[data-rv]").forEach((el) => io.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`${styles.page} ${inter.variable} ${serif.variable} ${mono.variable}`}
    >
      <div className={styles.bg} aria-hidden="true">
        {/* sharp photo centered, with clean normal black background on the sides */}
        <div className={styles.frame}>
          <Image
            src="/images/kaldurg.jpg"
            alt=""
            fill
            priority
            sizes="(min-width: 1080px) 1080px, 100vw"
            quality={75}
            className={styles.bgImg}
          />
        </div>
      </div>
      <div className={styles.scrim} aria-hidden="true" />
      <div className={styles.bar} ref={barRef} aria-hidden="true" />

      <Link href={BLOG_URL} className={styles.back}>
        &larr; Blog
      </Link>

      <header className={styles.hero}>
        <span className={styles.tag}>Trekking</span>
        <h1>
          Sitting on the edge of <em>Kaldurg</em>
        </h1>
        <p className={styles.sub}>
          A morning on the hill fort that keeps watch over Palghar, and why I
          came down quieter than I went up.
        </p>
        <div className={styles.meta}>
          <span>{POST_DATE}</span>
          <span>6 min read</span>
          <span>Kaldurg Fort, Palghar</span>
        </div>
        <div className={styles.cue}>
          <i /> Scroll to read
        </div>
      </header>

      <article className={styles.article}>
        <section data-rv className={styles.rv}>
          <p className={styles.lead}>
            Some places only make sense once you stop moving. Kaldurg is one of
            them.
          </p>
          <p>
            The fort sits in Palghar district, roughly 75 km from Mumbai by
            road, and the trek is short enough that people do it in a single
            day. I went for the climb. I stayed for the ledge at the top, where
            the rock simply ends and the whole valley opens up beneath your
            feet.
          </p>
        </section>

        <section data-rv className={styles.rv}>
          <div className={styles.k}>The basics</div>
          <h2>What you are walking into</h2>
          <div className={styles.facts}>
            {FACTS.map((f) => (
              <div className={styles.fact} key={f.label}>
                <b>{f.label}</b>
                <span>{f.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section data-rv className={styles.rv}>
          <div className={styles.k}>01</div>
          <h2>Getting to the foot of the hill</h2>
          <p>
            From Mumbai, most people take a train to Palghar and cover the last
            stretch by road. The trail begins near the Waghoba temple at the
            base of the hill, where the village ends and the forest starts.
          </p>
          <p>
            Start early. The first hour is the cool one, and it is the part of
            the day when the hill feels like it belongs to you.
          </p>
        </section>

        <section data-rv className={styles.rv}>
          <div className={styles.k}>02</div>
          <h2>The climb</h2>
          <p>
            The path winds through forest first, with shade and the smell of
            wet leaves, and then slowly opens up onto bare rock. It is not a
            technical trek, but it is steady, and the rocky stretches ask for a
            little attention, especially after rain.
          </p>
          <p>
            About two hours in, the trees thin out and you can feel the air
            change. That is when the fort starts to show itself.
          </p>
        </section>

        <p data-rv className={`${styles.quote} ${styles.rv}`}>
          The best views come after the hardest climb, and then you realise the
          view was never the point.
        </p>

        <section data-rv className={styles.rv}>
          <div className={styles.k}>03</div>
          <h2>The fort at the top</h2>
          <p>
            Kaldurg is a hill fort, and what remains is quiet and weathered:
            water tanks cut into the rock, old fortification, and a rectangular
            rock with a few steps that splits the fort into an upper and a
            lower part.
          </p>
          <p>
            From the top you look east toward the Surya river, and west toward
            Palghar and the line where the land meets the Arabian Sea. On a
            clear day it is a wide, generous view.
          </p>
        </section>

        <section data-rv className={styles.rv}>
          <div className={styles.k}>04</div>
          <h2>Doing nothing, on purpose</h2>
          <p>
            My day was hazy and cloud-heavy, so the town far below was soft and
            blurred, and the forest rolled out in every shade of green. I found
            a rock ledge, sat down, and for a while did absolutely nothing.
          </p>
          <p>
            No phone, no plan, no next step. Just the wind, a very long drop,
            and a town that looked like it belonged to a different world. I
            think that is the real reason I keep going back to the hills.
          </p>
        </section>

        <section data-rv className={styles.rv}>
          <div className={styles.k}>Before you go</div>
          <h2>A few things I would tell a friend</h2>
          <ul className={styles.tips}>
            {TIPS.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>

        <section data-rv className={styles.rv}>
          <p>
            I came down with muddy shoes and a quieter head than I took up. Not
            a bad trade for a morning.
          </p>
          <div className={styles.end}>
            <Link href={BLOG_URL}>&larr; Back to all posts</Link>
          </div>
        </section>
      </article>
    </div>
  );
}
