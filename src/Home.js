import React, { useEffect, useState } from "react";
import "./Home.css";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import Twitter from "./media/twitter.png";
import Telegram from "./media/telegram.png";
import Kakao from "./media/kakao.png";
import Discord from "./media/discord.png";
import Logo from "./media/logo.png";
import Head from "./media/head.png";
import Ape1 from "./media/ape-1.png";
import Ape2 from "./media/ape-2.png";
import Crazy from "./media/crazy-goongye.png";
import King from "./media/king-goongye.png";
import Breed from "./media/breed.png";
import PSSJ from "./media/PSSJ.png";
import Zoe from "./media/Zoe.png";
import Sophia from "./media/Sophia.png";
import Abbey from "./media/Abbey.png";
import NFT1 from "./media/nft-1.png";
import NFT2 from "./media/nft-2.png";
import NFT3 from "./media/nft-3.png";
import NFT4 from "./media/nft-4.png";
import NFT5 from "./media/nft-5.png";
import NFT6 from "./media/nft-6.png";
import Scene1 from "./media/scene-1.png";
import Scene2 from "./media/scene-2.png";
import Scene3 from "./media/scene-3.png";
import Scene4 from "./media/scene-4.png";
import MintImage from "./media/mint-img.png";
import MintSmImage from "./media/mint-sm-img.png";
import on from "./media/On.png";
import off from "./media/Line31.png";
import image1 from "./media/Vector3.png";
import containerImage from "./media/Group 48.png";
import light from "./media/light-from-top-background.png";
import Modal from "react-bootstrap/Modal";
import { Navbar, Nav } from "react-bootstrap";
import Caver from "caver-js";
import { connectionAction } from "./Redux/connection/actions";
import { toast } from "react-toastify";
import { googyeContractAddress, goongyeContractAbi } from "./Utils/Goongye.js";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import useAudio from "./useAudio";
const caver = new Caver(window.klaytn);
const Home = ({ changeMain, changeStake, changePresale }) => {
  const [playing, togglePlaying] = useAudio();
  const [loading, isLoading] = useState(false);
  const { t, i18n } = useTranslation();

  function handleChangeLanguage(lang) {
    console.log("lang", lang);
    // console.log(2 - 3);
    i18n.changeLanguage(lang);
  }
  // useEffect(() => {
  //   setTimeout(() => {
  //     playingSound();
  //   }, 10000);
  // }, []);

  const playingSound = () => {
    togglePlaying();
  };
  const options1 = {
    autoplay: true,
    autoplayhoverpause: true,
    autoplaytimeout: 100,
    items: 1,
    nav: false,
    dots: true,
    loop: true,
  };

  const options2 = {
    autoplay: true,
    autoplayhoverpause: true,
    autoplaytimeout: 100,
    items: 6,
    nav: false,
    dots: true,
    loop: true,
    responsive: {
      0: {
        items: 2,
        dots: true,
      },
      769: {
        items: 3,
        dots: true,
      },
      1200: {
        items: 4,
        dots: true,
      },
      1300: {
        items: 6,
        dots: false,
      },
    },
  };

  const options3 = {
    autoplay: true,
    autoplayhoverpause: true,
    autoplaytimeout: 100,
    items: 4,
    nav: false,
    dots: false,
    loop: false,
    responsive: {
      0: {
        items: 2,
        dots: true,
        loop: true,
      },
      769: {
        items: 3,
        dots: true,
        loop: true,
      },
      1200: {
        items: 4,
        dots: false,
        loop: false,
      },
    },
  };
  const dispatch = useDispatch();
  let acc = useSelector((state) => state.connect?.connection);
  let [noMints, setNomints] = useState(1);
  let [ttlKlay, setTtlKlay] = useState(0);
  let [mintArray, setMintArray] = useState([]);
  let [mintCollectionArray, setMintCollectionArray] = useState([]);
  // const [modalShow, setModalShow] = useState(false);
  const [collectionModalShow, setCollectionModalShow] = useState(false);

  console.log("acc", acc);
  const onConnectAccount = () => {
    dispatch(connectionAction());
  };

  const getInitialMintPrice = async () => {
    try {
      let contractOf = new caver.klay.Contract(
        goongyeContractAbi,
        googyeContractAddress
      );
      let totalPrice = await contractOf.methods.gPRice(1).call();
      totalPrice = caver.utils.fromPeb(totalPrice);
      setTtlKlay(totalPrice);
    } catch (e) {
      console.log("Error while getting minting price", e);
    }
  };

  const increment = async () => {
    if (noMints < 3) {
      const web3 = window.web3;
      let contractOf = new caver.klay.Contract(
        goongyeContractAbi,
        googyeContractAddress
      );
      let newNum = noMints + 1;
      let totalPrice = await contractOf.methods.gPRice(newNum).call();
      console.log("totalPrice", totalPrice);

      totalPrice = parseFloat(totalPrice) / 1000000000000000000;
      setTtlKlay(totalPrice);
      setNomints(newNum);
      console.log("Incremetn", totalPrice);
    }
  };
  const decrement = async () => {
    if (noMints > 1) {
      console.log("decremetn");
      const web3 = window.web3;
      let contractOf = new caver.klay.Contract(
        goongyeContractAbi,
        googyeContractAddress
      );
      let newNum = noMints - 1;
      console.log("newNum", newNum);

      let totalPrice = await contractOf.methods.gPRice(newNum).call();
      console.log("totalPrice", totalPrice);

      totalPrice = parseFloat(totalPrice) / 1000000000000000000;
      setTtlKlay(totalPrice);
      console.log("Incremetn", totalPrice);
      setNomints(newNum);
    }
  };

  const mintAndStake = async () => {
    // let myAccountAddress = await loadWeb3();
    console.log("myAccountAddress", acc);
    isLoading(true);
    if (acc == "No Wallet") {
      console.log(t("NoWallet"));
      toast.error(t("NoWallet"));
    } else if (acc == "Wrong Network") {
      console.log(t("WrongNetwork"));
      toast.error(t("WrongNetwork"));
    } else if (acc == "Connect Wallet") {
      toast.error(t("Connect"));
    } else {
      try {
        const { klaytn } = window;
        let contractOf = new caver.klay.Contract(
          goongyeContractAbi,
          googyeContractAddress
        );

        let totalPrice = await contractOf.methods.gPRice(noMints).call();
        console.log("totalPrice", totalPrice);
        let balance = await caver.klay.getBalance(acc);
        // balance = caver.utils.fromPeb(balance);
        console.log("Balance", balance);
        let ownerList = await contractOf.methods.walletOfOwner(acc).call();
        const length = ownerList.length;
        console.log("ownerList", length);
        // dispalyImage();
        // if (length < 7) {
        if (parseFloat(balance) > parseFloat(totalPrice)) {
          await contractOf.methods.mint(noMints).send({
            from: acc,
            value: totalPrice,
            gas: "5000000",
          });
          isLoading(false);
          toast.success(t("transaction.Successfull"));
          dispalyImage();
        } else {
          toast.error(t("insufficient.Balance!"));
        }
        // } else {
        //   toast.error("Minting Limit Reached (6)");
        // }
      } catch (e) {
        console.log(" Error while minting", e);
        toast.error(t("minting.Failed"));
        isLoading(false);
      }
    }
  };

  const dispalyImage = async () => {
    console.log("account in displying images", acc);
    try {
      let contractOf = new caver.klay.Contract(
        goongyeContractAbi,
        googyeContractAddress
      );
      if (acc) {
        let totalIDs = await contractOf.methods.walletOfOwner(acc).call();
        totalIDs = totalIDs.slice(-noMints);
        console.log("owner", totalIDs);
        let imagesArray = [];
        totalIDs.forEach(async (ids) => {
          let imageUrl = `/config/images/${ids}.jpg`;
          let imageName = `Common #${ids}`;
          // console.log("imageUrl", imageUrl);
          // console.log("iamgeName", imageName);
          imagesArray = [...imagesArray, { imageName, imageUrl }];
          setMintArray(imagesArray);
        });
        setCollectionModalShow(true);
      }
    } catch (e) {
      console.log(" Error while displaying images", e);
      // toast.error("Minting Failed");
    }
  };
  const handleCollectionOpen = async () => {
    try {
      let contractOf = new caver.klay.Contract(
        goongyeContractAbi,
        googyeContractAddress
      );
      if (acc) {
        let totalIDs = await contractOf.methods.walletOfOwner(acc).call();
        console.log("owner", totalIDs);
        let imagesArray = [];
        totalIDs.forEach(async (ids) => {
          let imageUrl = `/config/images/${ids}.jpg`;
          let imageName = `Common #${ids}`;
          // console.log("imageUrl", imageUrl);
          // console.log("iamgeName", imageName);
          imagesArray = [...imagesArray, { imageName, imageUrl }];
          setMintCollectionArray(imagesArray);
        });
        setCollectionModalShow(true);
      }
    } catch (e) {
      console.log(" Error while displaying images", e);
      // toast.error("Minting Failed");
    }
  };

  useEffect(() => {
    getInitialMintPrice();
    // dispalyImage();
  }, [acc]);
  const [show, setShow] = useState(true);
  console.log("Collection Array", mintArray);
  return (
    <div className="home" id="home">
      {/* <div className="divMintMdal">{show && <MintModal />}</div> */}
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

      <div className="navbarContainer">
        <Navbar collapseOnSelect expand="lg" className="headerContainer">
          {/* <Container className=""> */}
          <Navbar.Brand href="#home">
            <a href="/" className="logo ms-lg-5" onClick={() => changeMain()}>
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
          {/* </Container> */}
        </Navbar>
      </div>

      <section
        id="hero"
        className="d-flex align-items-center"
        data-aos="fade"
        data-aos-delay="0"
      >
        <div className="container position-relative text-center">
          <img
            src={Head}
            className="head-img pb-3 pt-5"
            data-aos="fade-down"
            data-aos-offset="0"
            alt=""
          />
          <h1 data-aos="fade-up" data-aos-offset="0">
            {t("landing.title")}
            <br />
            {t("landing.subtitle")}
          </h1>
          <p className="text-light" data-aos="zoom-in" data-aos-offset="0">
            {t("landing.para")}
          </p>
          <h2 data-aos="fade-up" data-aos-offset="0">
            {t("landing.footerTitle")}
          </h2>
        </div>
      </section>

      <section id="story">
        <div className="container">
          <div
            className="section-title"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <h2> {t("story.title")}</h2>
          </div>
          <div className="row pt-5">
            <div className="col-lg-6 img-part">
              <img
                src={Ape1}
                className="w-75 img-1"
                data-aos="fade-up"
                data-aos-delay="400"
                alt=""
              />
              <img
                src={Ape2}
                className="w-75 img-2"
                data-aos="fade-up"
                data-aos-delay="600"
                alt=""
              />
            </div>
            <div className="col-lg-6 pt-4 pt-lg-0">
              <h3
                className="story-heading pb-2"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                {t("stroy.background")}
              </h3>
              <p className="text-light" data-aos="fade-up" data-aos-delay="400">
                {t("stroy.paraback1")}
              </p>
              <p className="text-light" data-aos="fade-up" data-aos-delay="600">
                {t("stroy.paraback2")}
              </p>
              <h3
                className="story-heading pb-2"
                data-aos="fade-up"
                data-aos-delay="800"
              >
                {t("story.story")}
              </h3>
              <p
                className="text-light"
                data-aos="fade-up"
                data-aos-delay="1000"
              >
                {t("story.parastory1")}
              </p>
              <p
                className="text-light"
                data-aos="fade-up"
                data-aos-delay="1000"
              >
                {t("story.parastory2")}
              </p>
              <p
                className="text-light"
                data-aos="fade-up"
                data-aos-delay="1000"
              >
                {t("story.parastory3")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="scene">
        <div className="container">
          <OwlCarousel className="owl-theme" {...options1}>
            <div className="col text-center text-light">
              <div className="d-flex justify-content-center">
                <img src={Scene1} className="img" alt="" />
              </div>
              <div className="scene-text mt-4 d-flex justify-content-space-between">
                <h4> {t("storyCarousel.scene1")}</h4>
                <p>{t("storyCarousel.para1")}</p>
              </div>
            </div>
            <div className="col text-center text-light">
              <div className="d-flex justify-content-center">
                <img src={Scene2} className="img" alt="" />
              </div>
              <div className="scene-text mt-4 d-flex justify-content-space-between">
                <h4> {t("storyCarousel.scene2")}</h4>
                <p>{t("storyCarousel.para2")}</p>
              </div>
            </div>
            <div className="col text-center text-light">
              <div className="d-flex justify-content-center">
                <img src={Scene3} className="img" alt="" />
              </div>
              <div className="scene-text mt-4 d-flex justify-content-space-between">
                <h4> {t("storyCarousel.scene3")}</h4>
                <p>{t("storyCarousel.para3")}</p>
              </div>
            </div>
            <div className="col text-center text-light">
              <div className="d-flex justify-content-center">
                <img src={Scene4} className="img" alt="" />
              </div>
              <div className="scene-text mt-4 d-flex justify-content-space-between">
                <h4> {t("storyCarousel.scene4")}</h4>
                <p>{t("storyCarousel.para4")}</p>
              </div>
            </div>
          </OwlCarousel>
        </div>
      </section>

      <section id="tokenomics">
        <div className="container">
          <div
            className="section-title"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <h2 className="text-light">{t("tokenomics.title")}</h2>
          </div>
          <div
            className="row pt-4 top-section"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="col-md-4 img-box pb-4 text-center">
              <img src={Crazy} alt="" className="img pb-4" />
              <h4> {t("tokenomics.card1Title")}</h4>
              <p> {t("tokenomics.card1subTitle")}</p>
              <p>
                <span className="blue">{t("tokenomics.card1balance")}</span>
                <span className="green">{t("tokenomics.manguni")}</span>
                {t("tokenomics.perday")}
              </p>
            </div>
            <div
              className="col-md-4 py-4 d-flex align-items-center justify-content-center"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              <img src={Breed} alt="" className="w-50" />
            </div>
            <div
              className="col-md-4 img-box pb-4 text-center"
              data-aos="fade-up"
              data-aos-delay="900"
            >
              <img src={King} alt="" className="img pb-4" />
              <h4> {t("tokenomics.card2Title")}</h4>
              <p> {t("tokenomics.card2subTitle")}</p>
              <p>
                <span className="blue">{t("tokenomics.number2")}</span>
                <span className="green">{t("tokenomics.manguni")}</span>
                {t("tokenomics.perday")}
              </p>
            </div>
          </div>
          <div className="row pt-4 text-light desc">
            <p data-aos="fade-up" data-aos-delay="100">
              <span className="green">{t("tokenomics.manguni")}</span>
              {t("tokenomics.para1")}
              <span className="blue">{t("tokenomics.card1balance")}</span>
              <span className="green">{t("tokenomics.manguni")}</span>
              <span className="blue">{t("tokenomics.tokens")}</span>
              {t("tokenomics.perday")}
            </p>
            <p data-aos="fade-up" data-aos-delay="200">
              {t("tokenomics.cost")}
              <span className="blue">{t("tokenomics.1000")}</span>
              <span className="green">{"tokenomics.KLAY"}</span>
              <span className="blue">{t("tokenomics.tokens")}</span>
              {t("tokenomics.para2")}
              <span className="blue">{t("tokenomics.1000")}</span>
              <span className="green">{t("tokenomics.manguni")}</span>
              <span className="blue">{t("tokenomics.tokens")}</span> p
              {t("tokenomics.para2h2")}
              <span className="blue">{t("tokenomics.card1balance")}</span>
              {t("tokenomics.king")}
            </p>
            <p data-aos="fade-up" data-aos-delay="300">
              {t("tokenomics.para3")}
            </p>
            <p data-aos="fade-up" data-aos-delay="400">
              <span className="green">{t("tokenomics.manguni")}</span>
              <span className="blue">{t("tokenomics.tokens")}</span>
              {t("tokenomics.para4")}
            </p>
            <p data-aos="fade-up" data-aos-delay="500">
              <span className="green">{t("tokenomics.manguni2")}</span>
              {t("tokenomics.para5")}
              <span className="green">{t("tokenomics.manguni")}</span>
              <span className="blue">{t("tokenomics.tokens")}</span>
              {t("tokenomics.para5h2")}
            </p>
          </div>
        </div>
      </section>

      <section id="staking">
        <div className="container">
          <div
            className="section-title"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <h2> {t("Staking.1")}</h2>
          </div>
          <div className="row pt-4 text-light desc">
            <p data-aos="fade-up" data-aos-delay="100">
              {t("staking.parah1")}
            </p>
            <p data-aos="fade-up" data-aos-delay="200">
              {t("staking.parah2")}
              <span className="blue pe-1 ps-1">
                {t("tokenomics.card1balance")}
              </span>
              <span className="green pe-1"> {t("staking.MAGUNI")}</span>
              <span className="blue">{t("staking.tokens")} </span>
              {t("staking.day")}
            </p>
            <p data-aos="fade-up" data-aos-delay="300">
              {t("staking.parah3")}
              <span className="green ps-1 pe-1"> {t("staking.MAGUNI")}</span>
              <span className="blue pe-1">{t("staking.tokens")}</span>
              {t("staking.parah4")}
              <span className="blue ps-1 pe-1">{t("tokenomics.1000")}</span>
              <span className="green pe-1"> {t("staking.MAGUNI")}</span>
              <span className="blue">{t("staking.tokens")} </span>
              {t("staking.day")}
            </p>
          </div>
        </div>
      </section>

      <section id="nft">
        <div className="container">
          <div
            className="section-title"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <h2 className="text-light"> {t("nftCarousel.1")}</h2>
          </div>

          <OwlCarousel className="owl-theme" {...options2}>
            <div className="slide-img p-2">
              <img src={NFT1} alt="" />
            </div>
            <div className="slide-img p-2">
              <img src={NFT2} alt="" />
            </div>
            <div className="slide-img p-2">
              <img src={NFT3} alt="" />
            </div>
            <div className="slide-img p-2">
              <img src={NFT4} alt="" />
            </div>
            <div className="slide-img p-2">
              <img src={NFT5} alt="" />
            </div>
            <div className="slide-img p-2">
              <img src={NFT6} alt="" />
            </div>
          </OwlCarousel>

          <div
            className="cta text-center py-5"
            data-aos="zoom-in"
            data-aos-delay="300"
          >
            <a href="#opensea" className="btn-nft-cta">
              {t("nftCarousel.2")}
            </a>
          </div>
        </div>
      </section>

      <section id="mint">
        <div className="container">
          <div
            className="section-title"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <h2> {t("mint.1")}</h2>
          </div>
          <div className="row pt-5">
            <div
              className="col-md-6 px-4"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="fancy-list p-0">
                <img src={MintImage} alt="" className="img-fluid" />
                <ul className="pt-3">
                  <li>{t("mint.li1")}</li>
                  <li>{t("mint.li2")}</li>
                  <li>{t("mint.li3")}</li>
                  {/* <li>
                    The number of mints per transaction is set according to each
                    sales round.
                  </li> */}
                </ul>
              </div>
            </div>
            <div
              className="col-md-6 mt-4 mt-md-0 px-3"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="mint-form">
                <div className="form-head py-3 px-3">
                  <div className="row">
                    <div className="col-9">
                      <h5 className="m-0">{t("mint.h3")}</h5>
                      <span>{t("mint.para1")}</span>
                    </div>
                    <div className="col-3 text-center">
                      <img
                        src={MintSmImage}
                        className="mint-sm-img rounded"
                        alt=""
                      />
                    </div>
                  </div>
                </div>

                <div className="form-desc p-3">
                  <p className="m-0">{t("mint.price")}</p>
                  <div className="d-flex  justify-content-between">
                    <p className="m-0">
                      <span className="green">0.00</span> {t("mint.Each")}
                    </p>
                    <p className="m-0">
                      <span className="blue">{t("tokenomics.1000")}</span>
                      {t("mint.Remaining")}
                    </p>
                  </div>
                  {!playing ? (
                    <img
                      className="offIcon"
                      onClick={playingSound}
                      src={off}
                      alt="Sound Icon"
                    />
                  ) : (
                    <img
                      className="onIcon"
                      onClick={playingSound}
                      src={on}
                      alt="Sound Icon"
                    />
                  )}
                  {/* <img className="onIcon" src={on} onClick={playingSound} />
                  {!playing && (
                    <img className="offIcon" src={off} onClick={playingSound} />
                  )} */}
                </div>

                <div className="form pt-3 px-3">
                  <div className="input-group p-2">
                    <button
                      className="btn-minus"
                      type="button"
                      id=""
                      onClick={() => decrement()}
                    >
                      <i className="bx bx-minus"></i>
                    </button>
                    {/* <input
                      type="text"
                      className="form-control number"
                      placeholder="1"
                    >
                      {noMints}
                    </input> */}
                    <span className="number">{noMints}</span>
                    <button
                      className="btn-plus"
                      type="button"
                      id=""
                      onClick={() => increment()}
                    >
                      <i className="bx bx-plus"></i>
                    </button>
                    <span className="input-group-text form-control">
                      {t("mint.max")}
                    </span>
                  </div>
                  <hr className="my-3" />

                  <div className="total text-white">
                    <span className="text">{t("mint.Total")}</span>
                    <span className="value">
                      {ttlKlay} {t("mint.KLAY")}
                    </span>
                  </div>
                  <hr className="my-3" />

                  <div className="form-btn">
                    <a
                      href="#connect"
                      className="form-control btn-connect mb-3"
                      onClick={onConnectAccount}
                    >
                      {acc === "No Wallet"
                        ? t("NoWallet")
                        : acc === "Connect Wallet"
                        ? t("Connect")
                        : acc === "Wrong Network"
                        ? t("WrongNetwork")
                        : acc.substring(0, 4) +
                          "..." +
                          acc.substring(acc.length - 4)}
                    </a>
                    <a
                      href="#mint-stake"
                      className="form-control btn-mint mb-3"
                      onClick={() => mintAndStake()}
                    >
                      {loading ? (
                        <>
                          <span
                            class="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          <span className="laoding ms-1">Loading...</span>
                        </>
                      ) : (
                        t("mint.Mint")
                      )}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="roadmap">
        <div className="container">
          <div
            className="section-title"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <h2 className="text-light"> {t("Roadmap.1")}</h2>
          </div>
          <ul className="per_row">
            <li className="on" data-aos="fade" data-aos-delay="300">
              <p
                className="per aos-init"
                data-aos="flip-left"
                data-aos-delay="600"
              >
                <span>{t("roadmap.5")}</span>
              </p>
              <div className="box">
                <div>
                  {t("roadmap.parah1")}
                  <span className="blue ms-1"> {t("roadmap.Goongye")}</span>
                </div>
              </div>
            </li>
            <li className="on" data-aos="fade" data-aos-delay="400">
              <p
                className="per aos-init"
                data-aos="flip-left"
                data-aos-delay="700"
              >
                <span>
                  <span>{t("roadmap.10")}</span>
                </span>
              </p>
              <div className="box">
                <div>
                  {t("roadmap.parah2")}
                  <span className="blue ms-1">{t("roadmap.presale")}</span>
                </div>
              </div>
            </li>
            <li className="on" data-aos="fade" data-aos-delay="500">
              <p
                className="per aos-init"
                data-aos="flip-left"
                data-aos-delay="800"
              >
                <span>
                  <span>{t("roadmap.15")}</span>
                </span>
              </p>
              <div className="box">
                <div>
                  <span className="blue me-1">{t("roadmap.prize")}</span>
                  {t("roadmap.parah3")}
                </div>
              </div>
            </li>
            <li className="on" data-aos="fade" data-aos-delay="300">
              <p
                className="per aos-init"
                data-aos="flip-left"
                data-aos-delay="600"
              >
                <span>
                  <span>{t("roadmap.20")}</span>
                </span>
              </p>
              <div className="box">
                <div>
                  <span className="blue me-1">{t("roadmap.Start")}</span>
                  {t("roadmap.parah4")}
                </div>
              </div>
            </li>
            <li data-aos="fade" data-aos-delay="400">
              <p
                className="per aos-init"
                data-aos="flip-left"
                data-aos-delay="700"
              >
                <span>
                  <span>{t("roadmap.30")}</span>
                </span>
              </p>
              <div className="box">
                <div>
                  {t("roadmap.parah5")}
                  <span className="blue">{"roadmap.People"}</span>
                </div>
              </div>
            </li>
            <li className="on" data-aos="fade" data-aos-delay="400">
              <p
                className="per aos-init"
                data-aos="flip-left"
                data-aos-delay="800"
              >
                <span>
                  <span>{t("roadmap.40")}</span>
                </span>
              </p>
              <div className="box">
                <div>
                  <span className="blue">{"roadmap.Tokenomics"}</span>
                  {t("roadmap.parah6")}
                </div>
              </div>
            </li>
            <li data-aos="fade" data-aos-delay="300">
              <p
                className="per aos-init"
                data-aos="flip-left"
                data-aos-delay="600"
              >
                <span>
                  <span>{t("roadmap.45")}</span>
                </span>
              </p>
              <div className="box">
                <div>
                  {t("roadmap.Open")}
                  <span className="blue">{t("roadmap.parah7")}</span>
                  {t("roadmap.parah8")}
                </div>
              </div>
            </li>
            <li className="on" data-aos="fade" data-aos-delay="400">
              <p
                className="per aos-init"
                data-aos="flip-left"
                data-aos-delay="700"
              >
                <span>
                  <span>{t("roadmap.50")}</span>
                </span>
              </p>
              <div className="box">
                <div>
                  {t("roadmap.Purchase")}
                  <span className="blue">{t("roadmap.parah9")}</span>
                  {t("roadmap.parah10")}
                </div>
              </div>
            </li>
            <li data-aos="fade" data-aos-delay="500">
              <p
                className="per aos-init"
                data-aos="flip-left"
                data-aos-delay="800"
              >
                <span>
                  <span>{t("roadmap.60")}</span>
                </span>
              </p>
              <div className="box">
                <div>
                  <span className="blue">{t("roadmap.parah11")}</span>
                  {t("roadmap.parah12")}
                </div>
              </div>
            </li>
            <li className="on" data-aos="fade" data-aos-delay="300">
              <p
                className="per aos-init"
                data-aos="flip-left"
                data-aos-delay="600"
              >
                <span>
                  <span>{t("roadmap.70")}</span>
                </span>
              </p>
              <div className="box">
                <div>
                  {t("roadmap.parah13")}
                  <span className="blue">{t("roadmap.GoongyeApe")}</span>
                  {t("roadmap.parah14")}
                </div>
              </div>
            </li>
            <li data-aos="fade" data-aos-delay="400">
              <p
                className="per aos-init"
                data-aos="flip-left"
                data-aos-delay="700"
              >
                <span>
                  <span>{t("roadmap.75")}</span>
                </span>
              </p>
              <div className="box">
                <div>
                  {t("roadmap.Add")}
                  <span className="blue">{t("roadmap.governance")}</span>
                  {t("roadmap.parah15")}
                </div>
              </div>
            </li>
            <li data-aos="fade" data-aos-delay="500">
              <p
                className="per aos-init"
                data-aos="flip-left"
                data-aos-delay="800"
              >
                <span>
                  <span>{t("roadmap.80")}</span>
                </span>
              </p>
              <div className="box">
                <div>
                  {t("roadmap.conduct")}
                  <span className="blue">{t("roadmap.parah16")}</span>
                  {t("roadmap.parah17")}
                </div>
              </div>
            </li>
            <li className="on" data-aos="fade" data-aos-delay="300">
              <p
                className="per aos-init"
                data-aos="flip-left"
                data-aos-delay="600"
              >
                <span>
                  <span>{t("roadmap.85")}</span>
                </span>
              </p>
              <div className="box">
                <div>
                  {t("roadmap.Open")}
                  <span className="blue">{t("roadmap.parah18")}</span>
                </div>
              </div>
            </li>
            <li data-aos="fade" data-aos-delay="400">
              <p
                className="per aos-init"
                data-aos="flip-left"
                data-aos-delay="700"
              >
                <span>
                  <span>{t("roadmap.90")}</span>
                </span>
              </p>
              <div className="box">
                <div>
                  {t("roadmap.Issue")}
                  <span className="blue">{t("roadmap.NFT")}</span>
                  {t("roadmap.parah19")}
                </div>
              </div>
            </li>
            <li data-aos="fade" data-aos-delay="500">
              <p
                className="per aos-init"
                data-aos="flip-left"
                data-aos-delay="800"
              >
                <span>
                  <span>{t("roadmap.95")}</span>
                </span>
              </p>
              <div className="box">
                <div>
                  {t("roadmap.parah20")}
                  <span className="blue">{t("roadmap.parah21")}</span>
                  {t("roadmap.parah22")}
                </div>
              </div>
            </li>
            <li className="on last" data-aos="fade" data-aos-delay="300">
              <p
                className="per aos-init"
                data-aos="flip-left"
                data-aos-delay="500"
              >
                <span>
                  <span>{t("roadmap.100")}</span>
                </span>
              </p>
              <div className="box">
                <div>{t("roadmap.parah23")}</div>
              </div>
            </li>
          </ul>

          <div
            data-aos="fade-up"
            data-aos-delay="100"
            className="pt-3 text-center text-light"
          >
            {t("roadmap.foooter")}
          </div>
        </div>
      </section>

      <section id="team">
        <div className="container">
          <div
            className="section-title"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <h2>{t("team.para1")}</h2>
          </div>

          <OwlCarousel className="owl-theme" {...options3}>
            <div
              className="team-info p-2"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <img src={PSSJ} alt="" />
              <h4 className="name pt-3" c>
                {t("team.para1h")}
              </h4>
              <span className="pos">{t("team.para2")}</span>
            </div>
            <div
              className="team-info p-2"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <img src={Zoe} alt="" />
              <h4 className="name pt-3" c>
                {t("team.para2h")}
              </h4>
              <span className="pos">{t("team.para3")}</span>
            </div>
            <div
              className="team-info p-2"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <img src={Sophia} alt="" />
              <h4 className="name pt-3" c>
                {t("team.para4h")}
              </h4>
              <span className="pos">{t("team.para4")}</span>
            </div>
            <div
              className="team-info p-2"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <img src={Abbey} alt="" />
              <h4 className="name pt-3" c>
                {t("team.para5h")}
              </h4>
              <span className="pos">{t("team.para5")}</span>
            </div>
          </OwlCarousel>
        </div>
      </section>

      <section id="faq">
        <div className="container">
          <div
            className="section-title"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <h2 className="text-light">{t("FAQ.1")}</h2>
          </div>
          <div className="row pt-4">
            <div className="accordion accordion-flush text-light" id="faqs">
              <div
                className="accordion-item"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <span className="accordion-header" id="flush-headingOne">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseOne"
                    aria-expanded="false"
                    aria-controls="flush-collapseOne"
                  >
                    <h3 className="pe-3">{t("faq.Q")}</h3>
                    {t("faq.parah1")}
                  </button>
                </span>
                <div
                  id="flush-collapseOne"
                  className="accordion-collapse collapse"
                  aria-labelledby="flush-headingOne"
                  data-bs-parent="#faqs"
                >
                  <div className="accordion-body d-flex flex-row align-items-baseline">
                    <h3 className="pe-3">{t("faq.A")}</h3>
                    <p> {t("faq.parah2")}</p>
                  </div>
                </div>
              </div>
              <div
                className="accordion-item"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <span className="accordion-header" id="flush-headingTwo">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseTwo"
                    aria-expanded="false"
                    aria-controls="flush-collapseTwo"
                  >
                    <h3 className="pe-3">{t("faq.Q")}</h3> {t("faq.parah3")}
                  </button>
                </span>
                <div
                  id="flush-collapseTwo"
                  className="accordion-collapse collapse"
                  aria-labelledby="flush-headingTwo"
                  data-bs-parent="#faqs"
                >
                  <div className="accordion-body d-flex flex-row align-items-baseline">
                    <h3 className="pe-3">{t("faq.A")}</h3>
                    <p>{t("faq.parah4")}</p>
                  </div>
                </div>
              </div>
              <div
                className="accordion-item"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <span className="accordion-header" id="flush-headingThree">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseThree"
                    aria-expanded="false"
                    aria-controls="flush-collapseThree"
                  >
                    <h3 className="pe-3">{t("faq.Q")}</h3> {t("faq.parah5")}
                  </button>
                </span>
                <div
                  id="flush-collapseThree"
                  className="accordion-collapse collapse"
                  aria-labelledby="flush-headingOne"
                  data-bs-parent="#faqs"
                >
                  <div className="accordion-body d-flex flex-row align-items-baseline">
                    <h3 className="pe-3">{t("faq.A")}</h3>
                    <p>
                      {t("faq.parah6.1")}
                      <br />
                      {t("faq.parah6.2")}
                      <br />
                      {t("faq.parah6.3")}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="accordion-item"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <span className="accordion-header" id="flush-headingFour">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseFour"
                    aria-expanded="false"
                    aria-controls="flush-collapseFour"
                  >
                    <h3 className="pe-3">{t("faq.Q")}</h3> {t("faq.parah7")}
                  </button>
                </span>
                <div
                  id="flush-collapseFour"
                  className="accordion-collapse collapse"
                  aria-labelledby="flush-headingFour"
                  data-bs-parent="#faqs"
                >
                  <div className="accordion-body d-flex flex-row align-items-baseline">
                    <h3 className="pe-3">{t("faq.A")}</h3>
                    <p>{t("faq.parah8")}</p>
                  </div>
                </div>
              </div>
              <div
                className="accordion-item"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <span className="accordion-header" id="flush-headingFive">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseFive"
                    aria-expanded="false"
                    aria-controls="flush-collapseFive"
                  >
                    <h3 className="pe-3">{t("faq.Q")}</h3>
                    {t("faq.parah9")}
                  </button>
                </span>
                <div
                  id="flush-collapseFive"
                  className="accordion-collapse collapse"
                  aria-labelledby="flush-headingFive"
                  data-bs-parent="#faqs"
                >
                  <div className="accordion-body d-flex flex-row align-items-baseline">
                    <h3 className="pe-3">{t("faq.A")}</h3>
                    <p>{t("faq.parah10")}</p>
                  </div>
                </div>
              </div>
              <div
                className="accordion-item"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <span className="accordion-header" id="flush-headingSix">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseSix"
                    aria-expanded="false"
                    aria-controls="flush-collapseSix"
                  >
                    <h3 className="pe-3">{t("faq.Q")}</h3>
                    {t("faq.parah11")}
                  </button>
                </span>
                <div
                  id="flush-collapseSix"
                  className="accordion-collapse collapse"
                  aria-labelledby="flush-headingSix"
                  data-bs-parent="#faqs"
                >
                  <div className="accordion-body d-flex flex-row align-items-baseline">
                    <h3 className="pe-3">{t("faq.A")}</h3>
                    <p>
                      {t("faq.parah12.1")}

                      <br />
                      {t("faq.parah12.2")}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="accordion-item"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <span className="accordion-header" id="flush-headingSeven">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseSeven"
                    aria-expanded="false"
                    aria-controls="flush-collapseSeven"
                  >
                    <h3 className="pe-3">{t("faq.Q")}</h3> {t("faq.parah13")}
                  </button>
                </span>
                <div
                  id="flush-collapseSeven"
                  className="accordion-collapse collapse"
                  aria-labelledby="flush-headingSeven"
                  data-bs-parent="#faqs"
                >
                  <div className="accordion-body d-flex flex-row align-items-baseline">
                    <h3 className="pe-3">{t("faq.A")}</h3>
                    <p>
                      {t("faq.parah14.1")}

                      <br />
                      {t("faq.parah14.2")}

                      <br />
                      {t("faq.parah14.3")}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="accordion-item"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <span className="accordion-header" id="flush-headingEight">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseEight"
                    aria-expanded="false"
                    aria-controls="flush-collapseEight"
                  >
                    <h3 className="pe-3">{t("faq.Q")}</h3> {t("faq.parah15")}
                  </button>
                </span>
                <div
                  id="flush-collapseEight"
                  className="accordion-collapse collapse"
                  aria-labelledby="flush-headingEight"
                  data-bs-parent="#faqs"
                >
                  <div className="accordion-body d-flex flex-row align-items-baseline">
                    <h3 className="pe-3">{t("faq.A")}</h3>
                    <p>{t("faq.parah16")}</p>
                  </div>
                </div>
              </div>
              <div
                className="accordion-item"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <span className="accordion-header" id="flush-headingNine">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseNine"
                    aria-expanded="false"
                    aria-controls="flush-collapseNine"
                  >
                    <h3 className="pe-3">{t("faq.Q")}</h3> {t("faq.parah17")}
                  </button>
                </span>
                <div
                  id="flush-collapseNine"
                  className="accordion-collapse collapse"
                  aria-labelledby="flush-headingNine"
                  data-bs-parent="#faqs"
                >
                  <div className="accordion-body d-flex flex-row align-items-baseline">
                    <h3 className="pe-3">{t("faq.A")}</h3>
                    <p>{t("faq.parah18")}</p>
                  </div>
                </div>
              </div>
              <div
                className="accordion-item"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <span className="accordion-header" id="flush-headingTen">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseTen"
                    aria-expanded="false"
                    aria-controls="flush-collapseTen"
                  >
                    <h3 className="pe-3">{t("faq.Q")}</h3> {t("faq.parah19")}
                  </button>
                </span>
                <div
                  id="flush-collapseTen"
                  className="accordion-collapse collapse"
                  aria-labelledby="flush-headingTen"
                  data-bs-parent="#faqs"
                >
                  <div className="accordion-body d-flex flex-row align-items-baseline">
                    <h3 className="pe-3">{t("faq.A")}</h3>
                    <p>
                      {t("faq.parah20.1")}

                      <br />
                      {t("faq.parah20.1")}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="accordion-item"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <span className="accordion-header" id="flush-headingEleven">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseEleven"
                    aria-expanded="false"
                    aria-controls="flush-collapseEleven"
                  >
                    <h3 className="pe-3">{t("faq.Q")}</h3> {t("faq.parah21")}
                  </button>
                </span>
                <div
                  id="flush-collapseEleven"
                  className="accordion-collapse collapse"
                  aria-labelledby="flush-headingEleven"
                  data-bs-parent="#faqs"
                >
                  <div className="accordion-body d-flex flex-row align-items-baseline">
                    <h3 className="pe-3">{t("faq.A")}</h3>
                    <p>
                      {t("faq.parah22.1")}

                      <br />
                      {t("faq.parah22.2")}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="accordion-item"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <span className="accordion-header" id="flush-headingTwelve">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseTwelve"
                    aria-expanded="false"
                    aria-controls="flush-collapseTwelve"
                  >
                    <h3 className="pe-3">{t("faq.Q")}</h3> {t("faq.parah23")}
                  </button>
                </span>
                <div
                  id="flush-collapseTwelve"
                  className="accordion-collapse collapse"
                  aria-labelledby="flush-headingTwelve"
                  data-bs-parent="#faqs"
                >
                  <div className="accordion-body d-flex flex-row align-items-baseline">
                    <h3 className="pe-3">{t("faq.A")}</h3>
                    <p>{t("faq.parah24")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer
        id="footer"
        data-aos="fade-down"
        data-aos-delay="100"
        data-aos-offset="0"
      >
        <div className="container">
          <div className="row">
            <div className="col-md-3 text-center">
              <a href="/" className="logo">
                <img src={Logo} alt="" className="img-fluid" />
              </a>
            </div>
            <div className="col-md-6 py-3 py-md-0 text-center">
              <p className="m-0">
                <a href="mailto:maguni@crazyapegongyeclub.com">
                  {t("footer.1")}
                </a>
              </p>
              <p className="m-0">{t("footer.2")}</p>
            </div>
            <div className="col-md-3 social">
              <a
                href="https://twitter.com/crazyapegoongye"
                target="_blank"
                rel="noreferrer"
                className="twitter"
              >
                <img src={Twitter} alt="" />
              </a>
              <a
                href="https://t.me/+5VvQvVvtYIA2OTc9"
                target="_blank"
                rel="noreferrer"
                className="telegram"
              >
                <img src={Telegram} alt="" />
              </a>
              <a
                href="https://open.kakao.com/o/gzwaZ0be"
                target="_blank"
                rel="noreferrer"
                className="kakao"
              >
                <img src={Kakao} alt="" />
              </a>
              <a
                href="https://discord.gg/GJB55Rwbfe"
                target="_blank"
                rel="noreferrer"
                className="discord"
              >
                <img src={Discord} alt="" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      <a
        href="#top"
        className="back-to-top d-flex align-items-center justify-content-center"
      >
        <i className="bi bi-arrow-up-short"></i>
      </a>
      {/* <div className="col-lg-8 col-11 mb-md-1 mb-4 mt-4">
        {modalShow ? <MintModal mintArray={mintArray} acc={acc} /> : <></>}
      </div> */}

      {collectionModalShow ? (
        <Modal
          show={collectionModalShow}
          onHide={() => setCollectionModalShow(false)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          className="mintModal"
        >
          <Modal.Body
            className="model-image"
            style={{ border: "2px solid #FF5043" }}
          >
            <div className="minting d-flex justify-content-center" id="mint">
              <img className="lightImg" src={light} alt="" />
              <div className="imgArea mt-lg-0 mt-md-0 mt-sm-2">
                <img className="presalesTop-image" src={containerImage}></img>
                <span className="imgArea-text">{t("mint.1")}</span>
              </div>
              <div className=" container-presales-outside m-5 m-md-3 m-sm-2 ps-0 m-md-1 m-sm-1">
                <div className="container-presales m-1 p-lg-5 p-md-3">
                  <div className="row ">
                    <div className="connectBtnInPresale d-flex justify-content-end align-items-center">
                      <button
                        className="btnConnectInPresale  mt-2 mb-4"
                        onClick={onConnectAccount}
                      >
                        {acc === "No Wallet"
                          ? t("NoWallet")
                          : acc === "Connect Wallet"
                          ? t("Connect")
                          : acc === "Wrong Network"
                          ? t("WrongNetwork")
                          : acc.substring(0, 4) +
                            "..." +
                            acc.substring(acc.length - 4)}
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="row  mintRow">
                      <div className="col-12 mintCol">
                        <img className="congrtsBar" src={image1} />
                        <span className="textCongrts">
                          {t("modal.congratulation")}
                        </span>
                      </div>
                      <div className="col-12 mintCol mt-4">
                        <span className="heading">{t("modal.heading")}</span>
                      </div>
                      {/* {props?.mintArray.length == 1 ? ( */}
                      {/* <div className=" d-flex flex-column justify-content-center mb-3 mt-3"> */}
                      {mintArray.map((item, index) => {
                        return (
                          <div key={index}>
                            <div className="col-12 mintCol mt-4">
                              <img
                                className=" pt-4 pb-3"
                                width="240px"
                                src={`${item.imageUrl}`}
                              />
                            </div>
                            <div className="col-12 mintCol mt-5 mb-5">
                              <button
                                className="btnStaking mt-2 me-2"
                                onClick={() => setCollectionModalShow(false)}
                              >
                                {t("modal.staking")}
                              </button>
                              <button
                                className="btnLater mt-2"
                                onClick={() => setCollectionModalShow(false)}
                              >
                                {t("modal.later")}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Home;
