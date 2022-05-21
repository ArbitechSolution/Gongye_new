import React from "react";
import containerImage from "../media/Group 48.png";
import Twitter from "../media/twitter.png";
import Telegram from "../media/telegram.png";
import Kakao from "../media/kakao.png";
import Discord from "../media/discord.png";
import Logo from "../media/logo.png";
import { useTranslation } from "react-i18next";

import "./Staking.css";
export default function Navbar({ changeMain, changeStake, changePresale }) {
  const { t, i18n } = useTranslation();

  function handleChangeLanguage(lang) {
    console.log("lang", lang);
    // console.log(2 - 3);
    i18n.changeLanguage(lang);
  }

  return (
    <>
      <section id="topbar" className="d-flex align-items-center">
        <div className="container d-flex justify-content-center justify-content-md-between">
          <div className="contact-info d-flex align-items-center"></div>
          <div className="social-links" data-aos="fade-down">
            <span
              className="Eng green languageChnage"
              onClick={() => handleChangeLanguage("eng")}
            >
              ENG
            </span>
            /
            <span
              className="Kor pe-4 languageChnage"
              onClick={() => handleChangeLanguage("ko")}
            >
              KOR
            </span>
            <a
              href="https://twitter.com/crazyapegoongye"
              target="_blank"
              rel="noreferrer"
              className="twitter pe-1"
            >
              <img src={Twitter} alt="" />
            </a>
            <a
              href="https://t.me/+5VvQvVvtYIA2OTc9"
              target="_blank"
              rel="noreferrer"
              className="telegram pe-1"
            >
              <img src={Telegram} alt="" />
            </a>
            <a
              href="https://open.kakao.com/o/gzwaZ0be"
              target="_blank"
              rel="noreferrer"
              className="kakao pe-1"
            >
              <img src={Kakao} alt="" />
            </a>
            <a
              href="https://discord.gg/GJB55Rwbfe"
              target="_blank"
              rel="noreferrer"
              className="discord pe-1"
            >
              <img src={Discord} alt="" />
            </a>
          </div>
        </div>
      </section>

      <header id="header" className="d-flex align-items-center">
        <div className="container d-flex align-items-center justify-content-between">
          <a href="/" className="logo">
            <img src={Logo} alt="" data-aos="zoom-in" className="img-fluid" />
          </a>

          <nav id="navbarID" className="navbar" data-aos="zoom-in">
            <ul>
              <li>
                <a
                  className="nav-link scrollto"
                  href="#story"
                  onClick={() => changeMain()}
                >
                  {t("navbar.story")}
                </a>
              </li>
              <li>
                <a
                  className="nav-link scrollto"
                  href="#tokenomics"
                  onClick={() => changeMain()}
                >
                  {t("navbar.tokenomics")}
                </a>
              </li>
              <li>
                <a
                  className="nav-link scrollto"
                  href="#nft"
                  onClick={() => changeMain()}
                >
                  {t("navbar.NFT")}
                </a>
              </li>
              <li>
                <a
                  className="nav-link scrollto"
                  href="#mint"
                  onClick={() => changeMain()}
                >
                  {t("navbar.mint")}
                </a>
              </li>
              <li>
                <a
                  className="nav-link scrollto"
                  href="#stake"
                  onClick={() => changeStake()}
                >
                  {t("navbar.stakeBreed")}
                </a>
              </li>
              <li>
                <a
                  className="nav-link scrollto"
                  href="#roadmap"
                  onClick={() => changeMain()}
                >
                  {t("navbar.roadmap")}
                </a>
              </li>
              <li>
                <a
                  className="nav-link scrollto"
                  href="#team"
                  onClick={() => changeMain()}
                >
                  {t("navbar.team")}
                </a>
              </li>
              <li>
                <a
                  className="nav-link scrollto"
                  href="#faq"
                  onClick={() => changeMain()}
                >
                  {t("navbar.FAQ")}
                </a>
              </li>
            </ul>
            <i
              className="bi bi-list mobile-nav-toggle"
              data-toggle="collapse"
              data-target="#navbarID"
              aria-controls="navbarID"
              aria-expanded="false"
            ></i>
          </nav>
        </div>
      </header>
    </>
  );
}
