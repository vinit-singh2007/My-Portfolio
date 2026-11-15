import React, { ReactNode } from "react";
import { Mail, Pin, Window } from "@/components/blog/Icons";

export type Article = {
  slug: string;
  bg: string;
  side?: string;
  banner?: string;
  slides: ReactNode[];
};

const Links = () => (
  <div className="links">
    <span><Mail />Hackathons</span><span><Window />Learning</span><span><Pin />Travel</span>
  </div>
);

const steps = [
  ["Modern JavaScript first", "Destructuring, promises and async/await."],
  ["Node.js and Express", "A small REST API before any database."],
  ["MongoDB with Mongoose", "Schemas, then create, read, update, delete."],
  ["React for the interface", "Components, state, effects, fetching."],
  ["Connect it and ship it", "Auth, env variables, deployment."],
];

export const articles: Article[] = [
  {
    slug: "hackathon-mumbai",
    bg: "",
    banner: "/ethglobal-mumbai-hd.jpg", // full banner; text is written on its left side
    slides: [
      <>
        <h1>ETHGlobal Mumbai</h1>
        <div className="sub">an experience<br />beyond building.</div>
        <p>Three days in Mumbai, packed with learning, building and collaboration, and surrounded by people from across the Web3 ecosystem.</p>
        <p>I went to build something. I came back with <u>new ideas, new skills and new friends</u>.</p>
        <Links />
      </>,
      <>
        <h3>Building ORCA</h3>
        <p>I teamed up with my friend and teammate <a href="https://www.linkedin.com/in/shaktisingh5580/" target="_blank" rel="noreferrer">Shakti Singh</a> to work on <u>ORCA</u>.</p>
        <p>Hackathons move fast. You pick an idea, try a new technology, break it, fix it and keep going until something works. That pressure is exactly where I learn the most.</p>
      </>,
      <>
        <h3>What I took away</h3>
        <ul className="plain">
          <li>A deeper understanding of the Ethereum and Web3 ecosystem.</li>
          <li>A look at new technologies and how they work in the real world.</li>
          <li>Hands-on learning through building, challenges and teamwork.</li>
          <li>Connections with talented builders and developers.</li>
        </ul>
      </>,
      <>
        <h3>The people made it</h3>
        <p>The best part wasn’t only the code. It was the conversations between sessions, the late-night debugging with teammates, and the friendships that started along the way.</p>
        <div className="callout">Keep learning. Keep building. Keep exploring.</div>
        <p>Grateful for the experience, the connections and everything I learned.</p>
      </>,
    ],
  },
  {
    slug: "learning-mern",
    bg: "/clouds.jpg",
    slides: [
      <>
        <h1>Learning MERN</h1>
        <div className="sub">is a full-stack journey<br />from JavaScript to deployed app.</div>
        <p>I’m interested in how a whole product fits together: <u>how the database, server and interface</u> talk to each other, and where it gets confusing.</p>
        <p>I picked MongoDB, Express, React and Node.js because they all speak JavaScript. One language across every layer means I spend my time learning ideas instead of switching syntax.</p>
        <p>I’m learning it bottom-up, one layer at a time. Slide through to see how.</p>
        <Links />
      </>,
      <>
        <h3>The order that worked for me</h3>
        <ol className="road">
          {steps.map(([t, d]) => <li key={t}><b>{t}</b>{d}</li>)}
        </ol>
      </>,
      <>
        <h3>The first thing that made sense</h3>
        <p>One Express route talking to MongoDB showed me how the pieces fit:</p>
        <pre>{`app.get("/api/posts", async (req, res) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 });
  res.json(posts);
});`}</pre>
        <p>React then calls <code>fetch("/api/posts")</code> and renders the result. That round trip, from browser to server to database and back, is the whole stack in miniature.</p>
      </>,
      <>
        <h3>Mistakes I made so you don’t have to</h3>
        <ul className="plain">
          <li>Jumping into React before understanding how a server responds.</li>
          <li>Skipping validation, then finding bad data in the database.</li>
          <li>Committing my <code>.env</code> file. Add it to <code>.gitignore</code> on day one.</li>
          <li>Only following tutorials. Building my own small project taught me more.</li>
        </ul>
      </>,
      <>
        <h3>What I’m building next</h3>
        <div className="callout">My rule now: after every new concept, build something tiny with it the same day.</div>
        <p>Next up is a full CRUD app with login, then a project I can deploy and share. I’ll write that build up here as a follow-up.</p>
      </>,
    ],
  },
];
