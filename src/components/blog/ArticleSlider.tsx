"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Chevron, Wave } from "./Icons";
import Glow from "./Glow";
import "./articleSlider.css";

export default function ArticleSlider({
  slides,
  bg,
  side,
  banner,
  onClose,
}: {
  slides: React.ReactNode[];
  bg?: string;
  side?: string;
  banner?: string;
  onClose?: () => void;
}) {
  const n = slides.length;
  const vp = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const [dx, setDx] = useState(0);
  const [w, setW] = useState(0);
  const [drag, setDrag] = useState(false);
  const startX = useRef(0);

  const go = useCallback((i: number) => { setIdx(Math.max(0, Math.min(n - 1, i))); setDx(0); }, [n]);

  useEffect(() => {
    const measure = () => setW(vp.current?.clientWidth ?? 0);
    measure();
    addEventListener("resize", measure);
    document.body.style.overflow = "hidden"; // the page itself never scrolls here
    return () => { removeEventListener("resize", measure); document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(idx + 1);
      if (e.key === "ArrowLeft") go(idx - 1);
      if (e.key === "Escape" && onClose) onClose();
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [idx, go, onClose]);

  useEffect(() => {
    if (!drag) return;
    const move = (e: PointerEvent) => {
      let d = e.clientX - startX.current;
      if ((idx === 0 && d > 0) || (idx === n - 1 && d < 0)) d *= 0.3; // edge resistance
      setDx(d);
    };
    const up = () => {
      setDrag(false);
      const t = w * 0.15;
      go(dx < -t ? idx + 1 : dx > t ? idx - 1 : idx);
    };
    addEventListener("pointermove", move);
    addEventListener("pointerup", up);
    addEventListener("pointercancel", up);
    return () => {
      removeEventListener("pointermove", move);
      removeEventListener("pointerup", up);
      removeEventListener("pointercancel", up);
    };
  }, [drag, idx, dx, w, n, go]);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center overflow-hidden">
      {onClose ? (
        <button
          onClick={onClose}
          className="blog-back-pill"
          aria-label="Back to blog"
        >
          &larr; Blog
        </button>
      ) : (
        <Link href="/#blog" className="blog-back-pill" aria-label="Back to blog">
          &larr; Blog
        </Link>
      )}

      <div
        id="bg"
        style={{
          backgroundImage: bg ? `url(${bg})` : "none",
          backgroundColor: banner ? "#2b0615" : undefined,
        }}
      />
      {banner && <Glow />}

      <div
        className={`wrap${banner ? " hero" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget && onClose) {
            onClose();
          }
        }}
      >
        <div className="frame">
          {banner && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="banner" src={banner} alt="Article banner" />
          )}
          <article className="glass">
            <div className="mark"><Wave /></div>
            <div className="bar">
              {onClose ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="back bg-transparent border-0 p-0 text-inherit cursor-pointer flex items-center gap-2"
                  aria-label="Back to blog"
                >
                  <ArrowLeft />Blog
                </button>
              ) : (
                <Link className="back" href="/#blog" aria-label="Back to blog">
                  <ArrowLeft />Blog
                </Link>
              )}
              <div className="flex items-center gap-3">
                <span className="count">{idx + 1} / {n}</span>
                {onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="close-btn md:hidden"
                    aria-label="Close"
                  >
                    &times;
                  </button>
                )}
              </div>
            </div>
            <div
              ref={vp}
              className={`vp${drag ? " drag" : ""}`}
              onPointerDown={(e) => {
                startX.current = e.clientX;
                setDx(0);
                setDrag(true);
                try {
                  e.currentTarget.setPointerCapture(e.pointerId);
                } catch {}
              }}
            >
              <div
                className={`track${drag ? " nodrag" : ""}`}
                style={{ transform: `translateX(${-idx * w + dx}px)` }}
              >
                {slides.map((s, i) => <section className="slide" key={i}>{s}</section>)}
              </div>
            </div>
            <div className="nav">
              <button onClick={() => go(idx - 1)} disabled={idx === 0} aria-label="Previous slide"><Chevron dir="l" /></button>
              <div className="dots">{slides.map((_, i) => <i key={i} className={i === idx ? "on" : ""} />)}</div>
              <button onClick={() => go(idx + 1)} disabled={idx === n - 1} aria-label="Next slide"><Chevron dir="r" /></button>
            </div>
          </article>
        </div>
        {side && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="side" src={side} alt="" />
        )}
      </div>
    </div>
  );
}
