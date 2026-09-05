"use client";

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";

const navLinks = [
  { href: "/explore",    label: "Explore" },
  { href: "/dashboard",  label: "Dashboard" },
  { href: "/invitations", label: "Invitations ✉️" },
  { href: "/create-project", label: "Create Project" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <nav className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="13" stroke="url(#lg1)" strokeWidth="2"/>
              <circle cx="14" cy="14" r="6" fill="url(#lg2)" opacity="0.9"/>
              <circle cx="14" cy="5"  r="2.5" fill="#a855f7"/>
              <circle cx="22.5" cy="19" r="2.5" fill="#06b6d4"/>
              <circle cx="5.5"  cy="19" r="2.5" fill="#ec4899"/>
              <line x1="14" y1="7.5"  x2="14"   y2="12"   stroke="#a855f7" strokeWidth="1.5" opacity="0.6"/>
              <line x1="20.5" y1="17" x2="16.5" y2="15.5" stroke="#06b6d4" strokeWidth="1.5" opacity="0.6"/>
              <line x1="7.5"  y1="17" x2="11.5" y2="15.5" stroke="#ec4899" strokeWidth="1.5" opacity="0.6"/>
              <defs>
                <linearGradient id="lg1" x1="0" y1="0" x2="28" y2="28">
                  <stop offset="0%" stopColor="#7c3aed"/>
                  <stop offset="100%" stopColor="#06b6d4"/>
                </linearGradient>
                <linearGradient id="lg2" x1="0" y1="0" x2="28" y2="28">
                  <stop offset="0%" stopColor="#7c3aed"/>
                  <stop offset="100%" stopColor="#06b6d4"/>
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span className={styles.logoText}>
            Project<span className="text-gradient">DNA</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className={styles.navLinks}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${styles.navLink} ${pathname === link.href ? styles.active : ""}`}
              >
                {link.label}
                {pathname === link.href && <span className={styles.activeDot} />}
              </Link>
            </li>
          ))}
        </ul>

        {/* Auth Controls */}
        <div className={styles.authControls}>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="btn btn-ghost btn-sm">Sign In</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="btn btn-primary btn-sm">Get Started</button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Link href="/create-project">
              <button className="btn btn-primary btn-sm">+ New Project</button>
            </Link>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: styles.clerkAvatar,
                },
              }}
            />
          </Show>
        </div>

        {/* Mobile Hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`${styles.bar} ${mobileOpen ? styles.barOpen1 : ""}`} />
          <span className={`${styles.bar} ${mobileOpen ? styles.barOpen2 : ""}`} />
          <span className={`${styles.bar} ${mobileOpen ? styles.barOpen3 : ""}`} />
        </button>
      </nav>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.mobileLink} ${pathname === link.href ? styles.mobileLinkActive : ""}`}
            >
              {link.label}
            </Link>
          ))}
          <div className={styles.mobileAuth}>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="btn btn-ghost" style={{ width: "100%" }}>Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="btn btn-primary" style={{ width: "100%" }}>Get Started</button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <Link href="/create-project" style={{ width: "100%" }}>
                <button className="btn btn-primary" style={{ width: "100%" }}>+ New Project</button>
              </Link>
            </Show>
          </div>
        </div>
      )}
    </header>
  );
}
