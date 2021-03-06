import React, { useEffect, useState } from "react";
import containerImage from "../media/Group 48.png";
import Twitter from "../media/twitter.png";
import Telegram from "../media/telegram.png";
import Kakao from "../media/kakao.png";
import Discord from "../media/discord.png";
import Logo from "../media/logo.png";
import Doc from "../media/D.svg";
import Whitepaper from "../media/Whitepaper.svg";
import { useTranslation } from "react-i18next";
import { Navbar, Nav } from "react-bootstrap";

import "./Staking.css";
export default function NavbarStaking({
  changeMain,
  changeStake,
  changePresale,
}) {
  const { t, i18n } = useTranslation();
  const [green, isGreen] = useState("en");

  const handleChangeLanguage = async (lang) => {
    await i18n.changeLanguage(lang);
    console.log(i18n, ":i18n");
    isGreen(lang);
  };
  return (
    <>
      <section id="topbar" className="stakingTopbar d-flex align-items-center">
        <div className="container d-flex justify-content-center justify-content-md-between">
          <div className="contact-info d-flex align-items-center"></div>
          <div className="social-links" data-aos="fade-down">
            <span
              className={
                i18n.language == "en"
                  ? "Eng green languageChnage"
                  : "Eng languageChnage"
              }
              onClick={() => handleChangeLanguage("en")}
            >
              ENG
            </span>
            /
            <span
              className={
                i18n.language == "ko"
                  ? "Kor pe-4 green languageChnage"
                  : "Kor pe-4 languageChnage"
              }
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
              href="https://t.me/goongyeglobal"
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
            {i18n.language == "en" ? (
              <a
                href="https://cagc.gitbook.io/apegoongye-global/crazyapegoongye-club/story"
                target="_blank"
                rel="noreferrer"
                className="discord pe-1"
              >
                <img src={Doc} alt="" />
              </a>
            ) : (
              <a
                href="https://cagc.gitbook.io/crazyapegoongye/crazyapegoongye/story"
                target="_blank"
                rel="noreferrer"
                className="discord pe-1"
              >
                <img src={Doc} alt="" />
              </a>
            )}
            <a
              href="https://drive.google.com/file/d/1kiuCB8hf2sS1unpm9i5Ibr6-HiIoQAmf/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
              className="discord pe-1"
            >
              <img src={Whitepaper} alt="" />
            </a>
          </div>
        </div>
      </section>

      <div className="navbarContainer">
        <Navbar collapseOnSelect expand="lg" className="headerContainerStaking">
          <Navbar.Brand href="#home">
            <a href="/" className="logo " onClick={() => changeMain()}>
              <img
                src={Logo}
                alt=""
                data-aos="zoom-in"
                className=" goongyeLogo"
              />
            </a>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto me-5">
              <Nav.Link
                className="nav-link scrollto"
                href="#story"
                onClick={() => changeMain()}
              >
                {t("navbar.story")}
              </Nav.Link>
              <Nav.Link
                className="nav-link scrollto"
                href="#tokenomics"
                onClick={() => changeMain()}
              >
                {t("navbar.tokenomics")}
              </Nav.Link>
              <Nav.Link
                className="nav-link scrollto"
                href="#nft"
                onClick={() => changeMain()}
              >
                {t("navbar.NFT")}
              </Nav.Link>
              <Nav.Link
                className="nav-link scrollto"
                href="#mint"
                onClick={() => changeMain()}
              >
                {t("navbar.mint")}
              </Nav.Link>
              <Nav.Link
                className="nav-link scrollto"
                href="#presale"
                onClick={() => changePresale()}
              >
                {t("navbar.presale")}
              </Nav.Link>
              <Nav.Link
                className="nav-link scrollto"
                href="#stake"
                onClick={() => changeStake()}
              >
                {t("navbar.stakeBreed")}
              </Nav.Link>

              <Nav.Link
                className="nav-link scrollto"
                href="#roadmap"
                onClick={() => changeMain()}
              >
                {t("navbar.roadmap")}
              </Nav.Link>
              <Nav.Link
                className="nav-link scrollto"
                href="#team"
                onClick={() => changeMain()}
              >
                {t("navbar.team")}
              </Nav.Link>
              <Nav.Link
                className="nav-link scrollto"
                href="#faq"
                onClick={() => changeMain()}
              >
                {t("navbar.FAQ")}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    </>
  );
}
