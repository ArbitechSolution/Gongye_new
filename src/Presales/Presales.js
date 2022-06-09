import React, { useEffect, useState } from "react";
import mint from "../media/mint-img.png";
import klytn from "../media/klaytn-klay-logo 1.png";
import containerImage from "../media/Group 48.png";
import { useSelector, useDispatch } from "react-redux";
import { connectionAction } from "../Redux/connection/actions";
import Caver from "caver-js";
import "./Presales.css";
import "../Staking/Staking.css";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { googyeContractAddress, goongyeContractAbi } from "../Utils/Goongye";
import Modal from "react-bootstrap/Modal";
import image1 from "../media/Vector3.png";
import light from "../media/light-from-top-background.png";
const caver = new Caver(window.klaytn);
const webSupply = new Caver("https://public-node-api.klaytnapi.com/v1/cypress");

export default function AppPresale({ changeStake }) {
  let acc = useSelector((state) => state.connect?.connection);
  const { t, i18n } = useTranslation();
  const [count, setCount] = useState(1);

  const [active1, setActive1] = useState("");
  const [active2, setActive2] = useState("");
  const [active3, setActive3] = useState("");
  const [loading, isLoading] = useState(false);
  const [collectionModalShow, setCollectionModalShow] = useState(false);
  let [mintArray, setMintArray] = useState([]);
  let [publicSale, setPublicSale] = useState();
  const [balance, setBalance] = useState(0);
  const [remainingPresale, setRemainingPresale] = useState(0);
  const [webSupplyState, setWebSupplyState] = useState();
  const dispatch = useDispatch();
  const handlePlus = () => {
    setCount(count + 1);
  };
  const handleMinus = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const onConnectAccount = () => {
    dispatch(connectionAction());
    // setCollectionModalShow(true);
  };
  const tabsLight = async () => {
    try {
      let contractOfNFt = new webSupply.klay.Contract(
        goongyeContractAbi,
        googyeContractAddress
      );
      let supplyCheck = await contractOfNFt.methods.totalSupply().call();
      setWebSupplyState(supplyCheck);
      if (supplyCheck >= 200 && supplyCheck <= 1200) {
        setActive1("active");
        setActive2("disabled");
        setActive3("disabled");
      } else if (supplyCheck >= 1201 && supplyCheck <= 2200) {
        setActive2("active");
        setActive1("disabled");
        setActive3("disabled");
      } else if (supplyCheck >= 2201 && supplyCheck <= 3200) {
        setActive3("active");
        setActive2("disabled");
        setActive1("disabled");
      }
      let contractOf = new caver.klay.Contract(
        goongyeContractAbi,
        googyeContractAddress
      );
      let presaleBool = await contractOf.methods.preSaleStarted().call();
      if (presaleBool) {
        let supply = await contractOf.methods.totalSupply().call();
        let publicSale;
        if (supply <= 1200) {
          publicSale = await contractOf.methods.preSaleprice1().call();
          publicSale = publicSale * count;
          publicSale = caver.utils.fromPeb(publicSale);
          let rem = 1200 - supply;

          rem = 1000 - rem;
          setRemainingPresale(rem);
        } else if (supply <= 2200) {
          publicSale = await contractOf.methods.preSaleprice2().call();
          publicSale = publicSale * count;
          publicSale = caver.utils.fromPeb(publicSale);

          let rem = 2200 - supply;
          rem = 1000 - rem;
          setRemainingPresale(rem);
        } else if (supply <= 3200) {
          publicSale = await contractOf.methods.preSaleprice3().call();
          publicSale = publicSale * count;
          publicSale = caver.utils.fromPeb(publicSale);
          let rem = 3200 - supply;
          rem = 1000 - rem;
          setRemainingPresale(rem);
        }
        setPublicSale(publicSale);
      } else {
        console.log("Presale is not started yet!");
      }
      let supply = await contractOf.methods.totalSupply().call();
      console.log("supply tabsLight ", supply);
    } catch (e) {
      console.log("error in getting supply", e);
      // toast.error("Transaction Failed");
    }
  };
  const tabsChange = async () => {
    try {
      let contractOf = new webSupply.klay.Contract(
        goongyeContractAbi,
        googyeContractAddress
      );
      let supply = await contractOf.methods.totalSupply().call();
      setWebSupplyState(supply);
      if (supply >= 200 && supply <= 1200) {
        setActive1("active");
        setActive2("disabled");
        setActive3("disabled");
      } else if (supply >= 1201 && supply <= 2200) {
        setActive2("active");
        setActive1("disabled");
        setActive3("disabled");
      } else if (supply >= 2201 && supply <= 3200) {
        setActive3("active");
        setActive2("disabled");
        setActive1("disabled");
      }
    } catch (e) {
      console.log("errorrrrr in tabs change", e);
    }
  };
  const mintAndStake = async () => {
    console.log("myAccountAddress", acc);
    isLoading(true);
    if (acc == "No Wallet") {
      console.log(t("NoWallet"));
      toast.error(t("NoWallet"));
      isLoading(false);
    } else if (acc == "Wrong Network") {
      console.log(t("WrongNetwork"));
      toast.error(t("WrongNetwork"));
      isLoading(false);
    } else if (acc == "Connect Wallet") {
      toast.error(t("Connect"));
      isLoading(false);
    } else {
      try {
        let contractOf = new caver.klay.Contract(
          goongyeContractAbi,
          googyeContractAddress
        );
        // function mint ka call howa es me ye check kr k
        //  yeh public
        let presaleBool = await contractOf.methods.preSaleStarted().call();
        console.log("psspsp", presaleBool);
        if (presaleBool) {
          let supply = await contractOf.methods.totalSupply().call();
          console.log("supply tabsLight ", supply);
          let publicSale;
          if (supply >= 200 && supply <= 1200) {
            publicSale = await contractOf.methods.preSaleprice1().call();
            publicSale = publicSale * count;
            publicSale = caver.utils.fromPeb(publicSale);
            console.log("publicSale 1", publicSale);
          } else if (supply >= 1201 && supply <= 2200) {
            publicSale = await contractOf.methods.preSaleprice2().call();
            publicSale = publicSale * count;
            publicSale = caver.utils.fromPeb(publicSale);
            console.log("publicSale 2", publicSale);
          } else if (supply >= 2201 && supply <= 3200) {
            publicSale = await contractOf.methods.preSaleprice3().call();
            publicSale = publicSale * count;
            publicSale = caver.utils.fromPeb(publicSale);
            console.log("publicSale 3", publicSale);
          }
          console.log("publicSale all", publicSale);
          let totalPrice = await contractOf.methods.gPRice(count).call();
          console.log("totalPrice", totalPrice);
          // totalPrice = caver.utils.fromPeb(totalPrice);
          console.log("totalPrice", totalPrice);

          let balance = await caver.klay.getBalance(acc);
          balance = caver.utils.fromPeb(balance);
          console.log("Balance", balance);
          let ownerList = await contractOf.methods.walletOfOwner(acc).call();
          const length = ownerList.length;
          console.log("ownerList", length);
          if (length <= 7) {
            if (parseFloat(balance) > parseFloat(publicSale)) {
              await contractOf.methods.preSalemint(count).send({
                from: acc,
                value: totalPrice,
                gas: "5000000",
              });
              isLoading(false);
              toast.success(t("transaction.Successfull"));
              dispalyImage();
            } else {
              toast.error(t("insufficient.Balance"));
              isLoading(false);
            }
          } else {
            toast.error("Minting Limit Reached (7)");
          }
        } else {
          toast.info("Presale is not started yet!");
        }
        // let totalPrice = await contractOf.methods.gPRice(noMints).call();
        // console.log("totalPrice", totalPrice);
        // let balance = await caver.klay.getBalance(acc);
        // // balance = caver.utils.fromPeb(balance);
        // console.log("Balance", balance);
        // let ownerList = await contractOf.methods.walletOfOwner(acc).call();
        // const length = ownerList.length;
        // console.log("ownerList", length);
        // if (length <= 6) {
        //   if (parseFloat(balance) > parseFloat(totalPrice)) {
        //     await contractOf.methods.mint(noMints).send({
        //       from: acc,
        //       value: totalPrice,
        //       gas: "5000000",
        //     });
        //     isLoading(false);
        //     toast.success(t("transaction.Successfull"));
        //     dispalyImage();
        //   } else {
        //     toast.error(t("insufficient.Balance!"));
        //     isLoading(false);
        //   }
        // } else {
        //   toast.error("Minting Limit Reached (6)");
        // }
      } catch (e) {
        console.log(" Error while minting", e);
        toast.error(t("minting.Failed"));
        isLoading(false);
      }
      isLoading(false);
    }
  };
  const dispalyImage = async () => {
    try {
      let contractOf = new caver.klay.Contract(
        goongyeContractAbi,
        googyeContractAddress
      );
      if (acc) {
        let totalIDs = await contractOf.methods.walletOfOwner(acc).call();
        totalIDs = totalIDs.slice(-count);
        let imagesArray = [];
        totalIDs.forEach(async (ids) => {
          if (ids <= 8000) {
            let imageUrl = `/config/images/${ids}.jpg`;
            let imageName = `Common #${ids}`;
            imagesArray = [...imagesArray, { imageName, imageUrl }];
            setMintArray(imagesArray);
          } else {
            let imageUrl = `/config/king/${ids}.jpg`;
            let imageName = `King #${ids}`;
            imagesArray = [...imagesArray, { imageName, imageUrl }];
            setMintArray(imagesArray);
          }
        });
        setCollectionModalShow(true);
      }
    } catch (e) {
      console.log(" Error while displaying images", e);
      // toast.error("Minting Failed");
    }
  };
  const getBalance = async () => {
    if (acc) {
      try {
        let balance = await caver.klay.getBalance(acc);
        balance = caver.utils.fromPeb(balance);
        balance = parseFloat(balance).toFixed(2);
        console.log("Balance", balance);
        setBalance(balance);
      } catch (e) {
        console.log("error", e);
      }
    }
  };
  const handleCLodemodal = () => {
    setCollectionModalShow(false);
    isLoading(false);
  };
  useEffect(() => {
    tabsLight();
    getBalance();
  }, []);
  useEffect(() => {
    getBalance();
  }, [acc]);
  return (
    <div className="staking d-flex justify-content-center " id="presale">
      <div className="imgArea ">
        <img className="stakingTop-image" src={containerImage}></img>
        <span className="imgArea-text">{t("Presales.1")}</span>
      </div>

      <div className="container container-staking-outside m-5 m-md-3 m-sm-2 ps-0 m-md-1 m-sm-1">
        <div className="container-fluid container-staking m-1 p-lg-5 p-md-3">
          <div className="row ">
            <div className="col-12 d-flex justify-content-end">
              <button
                className="btnConnectInPresale  mt-3 mb-1"
                onClick={onConnectAccount}
              >
                {acc === "No Wallet"
                  ? t("NoWallet")
                  : acc === "Connect Wallet"
                  ? t("Connect")
                  : acc === "Wrong Network"
                  ? t("WrongNetwork")
                  : acc.substring(0, 4) + "..." + acc.substring(acc.length - 4)}
              </button>
            </div>
          </div>
          <div className="row mt-5 d-flex justify-content-center align-items-center g-0">
            <div className="col-lg-5 col-md-12 col-sm-12 d-flex justify-content-center align-items-center pt-3">
              <div className="mintCard">
                <img src={mint} className=" mintImage" alt="..." />
                <div className=" mintCardBody pb-1">
                  <ul>
                    <li> {t("presale.li1")}</li>
                    <li>{t("presale.li2")}</li>
                    <li>{t("presale.li3")}</li>
                    <li>{t("presale.li4")}</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-5 col-md-12 col-sm-12  d-flex justify-content-center align-items-center pt-3">
              <div className="mintCard mintCard2 presaleCard">
                <nav>
                  <div className="nav nav-tabs" id="nav-tab" role="tablist">
                    <button
                      className={`nav-link navTabs ${active1} tab1`}
                      id="nav-home-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-home"
                      type="button"
                      role="tab"
                      aria-controls="nav-home"
                      aria-selected="true"
                      onClick={() => tabsChange()}
                    >
                      <span className="tabText">{t("presale.2")}</span>
                    </button>
                    <button
                      className={`nav-link navTabs ${active2}`}
                      id="nav-profile-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-profile"
                      type="button"
                      role="tab"
                      aria-controls="nav-profile"
                      aria-selected="false"
                      onClick={() => tabsChange()}
                    >
                      <span className="tabText">{t("presale.3")}</span>
                    </button>
                    <button
                      className={`nav-link navTabs tab3 ${active3}`}
                      id="nav-contact-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-contact"
                      type="button"
                      role="tab"
                      aria-controls="nav-contact"
                      aria-selected="false"
                      onClick={() => tabsChange()}
                    >
                      <span className="tabText">{t("presale.4")}</span>
                    </button>
                  </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                  <div
                    className="tab-pane fade show active"
                    id="nav-home"
                    role="tabpanel"
                    aria-labelledby="nav-home-tab"
                  >
                    <div className="mintCardBody preSaleCardBody m-3">
                      <div className="text-white">
                        <span className="text-white me-1">Balance :</span>
                        {balance
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </div>
                      <div className="progress mt-2">
                        <div
                          className="progress-bar progress-bar-success progress-bar-striped"
                          role="progressbar"
                          aria-valuenow="0"
                          aria-valuemin="0"
                          aria-valuemax="100"
                          style={{ width: `{remainingPresale}%}` }}
                        >
                          {remainingPresale}%
                        </div>
                      </div>
                      <div className="progressValue">
                        <span>0</span>
                        <span>1,000</span>
                      </div>
                      <div className="mt-4">
                        <hr className="solid hori"></hr>
                      </div>
                      <div className="mintTotal">
                        <div>
                          <span className="totalSpan ps-2">
                            {t("presale.price")}
                          </span>
                        </div>
                        <div>
                          <span className="KLAYspan pe-2">
                            <img src={klytn} className="me-2" />
                            <span className="textColor me-1">{publicSale}</span>
                            {t("mint.KLAY")}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <hr className="solid hori"></hr>
                      </div>
                      <div className=" mt-4 row">
                        <span className="KLAYspan pe-2">
                          {t("presale.Amount")}
                        </span>
                      </div>
                      <div className="preslaesAdditionSection mt-4 ">
                        <button
                          className="btnMinus btnMinusPresale"
                          onClick={handleMinus}
                        >
                          -
                        </button>
                        <span className="spanCount ">{count}</span>
                        <button
                          className="btnPlus btnPlusPresale"
                          onClick={handlePlus}
                        >
                          +
                        </button>
                      </div>

                      <div className="btnWalletStakeArea">
                        <div>
                          <button
                            className="btnMintPresale mt-3 mb-3 "
                            onClick={() => mintAndStake()}
                          >
                            {t("navbar.mint")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="nav-profile"
                    role="tabpanel"
                    aria-labelledby="nav-profile-tab"
                  >
                    <div className="mintCardBody preSaleCardBody m-3">
                      <div className="text-white">
                        <span className="text-white me-1">Balance :</span>
                        {balance
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </div>
                      <div className="progress mt-2">
                        <div
                          className="progress-bar progress-bar-success progress-bar-striped"
                          role="progressbar"
                          aria-valuenow="40"
                          aria-valuemin="0"
                          aria-valuemax="100"
                          style={{ width: `{remainingPresale}%` }}
                        >
                          {remainingPresale}%
                        </div>
                      </div>
                      <div className="progressValue">
                        <span>0</span>
                        <span>1000</span>
                      </div>
                      <div className="mt-4">
                        <hr className="solid hori"></hr>
                      </div>
                      <div className="mintTotal">
                        <div>
                          <span className="totalSpan ps-2">
                            {t("presale.price")}
                          </span>
                        </div>
                        <div>
                          <span className="KLAYspan pe-2">
                            <img src={klytn} className="me-2" />
                            <span className="textColor me-1">{publicSale}</span>
                            {t("mint.KLAY")}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <hr className="solid hori"></hr>
                      </div>
                      <div className=" mt-4 row">
                        <span className="KLAYspan pe-2">
                          {t("presale.Amount")}
                        </span>
                      </div>
                      <div className="preslaesAdditionSection mt-4 ">
                        <button
                          className="btnMinus btnMinusPresale"
                          onClick={handleMinus}
                        >
                          -
                        </button>
                        <span className="spanCount ">{count}</span>
                        <button
                          className="btnPlus btnPlusPresale"
                          onClick={handlePlus}
                        >
                          +
                        </button>
                      </div>

                      <div className="btnWalletStakeArea">
                        <div>
                          <button
                            className="btnMintPresale mt-3 mb-3 "
                            onClick={() => mintAndStake()}
                          >
                            {t("navbar.mint")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="nav-contact"
                    role="tabpanel"
                    aria-labelledby="nav-contact-tab"
                  >
                    <div className="mintCardBody preSaleCardBody m-3">
                      <div className="text-white">
                        <span className="text-white me-1">Balance :</span>
                        {balance
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </div>
                      <div className="progress mt-2">
                        <div
                          className="progress-bar progress-bar-success progress-bar-striped"
                          role="progressbar"
                          aria-valuenow="100"
                          aria-valuemin="0"
                          aria-valuemax="100"
                          style={{ width: `{remainingPresale}%` }}
                        >
                          {remainingPresale}%
                        </div>
                      </div>
                      <div className="progressValue">
                        <span>500</span>
                        <span>1000</span>
                      </div>
                      <div className="mt-4">
                        <hr className="solid hori"></hr>
                      </div>
                      <div className="mintTotal">
                        <div>
                          <span className="totalSpan ps-2">
                            {t("presale.price")}
                          </span>
                        </div>
                        <div>
                          <span className="KLAYspan pe-2">
                            <img src={klytn} className="me-2" />
                            <span className="textColor me-1">{publicSale}</span>
                            {t("mint.KLAY")}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <hr className="solid hori"></hr>
                      </div>
                      <div className=" mt-4 row">
                        <span className="KLAYspan pe-2">
                          {t("presale.Amount")}
                        </span>
                      </div>
                      <div className="preslaesAdditionSection mt-4 ">
                        <button
                          className="btnMinus btnMinusPresale"
                          onClick={handleMinus}
                        >
                          -
                        </button>
                        <span className="spanCount ">{count}</span>
                        <button
                          className="btnPlus btnPlusPresale"
                          onClick={handlePlus}
                        >
                          +
                        </button>
                      </div>

                      <div className="btnWalletStakeArea">
                        <div>
                          {webSupplyState && webSupplyState <= 3200 ? (
                            <button
                              className="btnMintPresale mt-3 mb-3"
                              onClick={() => mintAndStake()}
                            >
                              {t("navbar.mint")}
                              {/* {t("presale.Sold")} */}
                            </button>
                          ) : (
                            <button
                              className="btnMintPresale mt-3 mb-3"
                              // onClick={() => mintAndStake()}
                            >
                              {/* {t("navbar.mint")} */}
                              {t("presale.Sold")}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/*
                <div className="presaleCard2SubHeader pt-2 pb-2">
                  <h6 className="ps-3 ">Price Per Card</h6>
                  <span className="ps-3">
                    <span className="spanBalance">0.00</span> Klay Each
                  </span>
                </div>
                <div class="mintCardBody m-3">
                  <div>
                    <div className="preslaesAdditionSection mt-4 row">
                      <div>
                        <button className="btnMinus ">-</button>
                        <span className="spanCount ">1</span>
                        <button className="btnPlus ">+</button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <hr className="solid hori"></hr>
                    </div>
                    <div className="mintTotal">
                      <div>
                        <span className="totalSpan ps-2">Total</span>
                      </div>
                      <div>
                        <span className="KLAYspan pe-2">--- KLAY</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <hr className="solid hori"></hr>
                    </div>
                    <div className="btnWalletStakeArea">
                      <div>
                        <button className="btnConnectWallet mt-3 ">
                          Connect Wallet
                        </button>
                      </div>
                      <div>
                        <button className="btnMintPresale mt-3 mb-3">
                          Mint & Stake Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
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
                        onClick={() => onConnectAccount()}
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
                                src={item.imageUrl}
                              />
                            </div>

                            {/* <div className="col-12 mintCol mt-2 mb-5">
                              <button
                                className="btnLater mt-2"
                                onClick={() => setCollectionModalShow(false)}
                              >
                                {t("modal.later")}
                              </button>
                            </div> */}
                          </div>
                        );
                      })}
                      <div className="col-12 mintCol mt-5 mb-5">
                        <button
                          className="btnStaking mt-2 me-2"
                          // href="#stake"
                          onClick={() => changeStake()}
                        >
                          {t("modal.staking")}
                        </button>
                        <button
                          className="btnBreeding mt-2 me-2"
                          // onClick={() => updgradToKing(item)}
                          // href="#stake"
                          onClick={() => changeStake()}
                        >
                          {t("staking.parabreed")}
                        </button>
                        <button
                          className="btnLater mt-2"
                          onClick={() => handleCLodemodal()}
                        >
                          {t("modal.later")}
                        </button>
                      </div>
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
}
