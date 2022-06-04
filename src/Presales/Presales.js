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
export default function AppPresale({ changeStake }) {
  let acc = useSelector((state) => state.connect?.connection);
  const { t, i18n } = useTranslation();
  const [count, setCount] = useState(1);

  const [active1, setActive1] = useState("active");
  const [active2, setActive2] = useState(false);
  const [active3, setActive3] = useState(false);
  const [loading, isLoading] = useState(false);
  const [collectionModalShow, setCollectionModalShow] = useState(false);
  let [mintArray, setMintArray] = useState([]);
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
      let contractOf = new caver.klay.Contract(
        goongyeContractAbi,
        googyeContractAddress
      );
      let supply = await contractOf.methods.totalSupply().call();
      console.log("supply tabsLight ", supply);
      if (supply <= 250) {
        setActive1("active");
        setActive2("disabled");
        setActive3("disabled");
      } else if (supply <= 300) {
        setActive2("active");
        setActive1("disabled");
        setActive3("disabled");
      } else if (supply <= 5000) {
        setActive3("active");
        setActive2("disabled");
        setActive1("disabled");
      }
    } catch (e) {
      console.log("error", e);
      // toast.error("Transaction Failed");
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

        let presaleBool = await contractOf.methods.preSaleStarted().call();
        console.log("psspsp", presaleBool);
        if (presaleBool) {
          let supply = await contractOf.methods.totalSupply().call();
          console.log("supply tabsLight ", supply);
          let publicSale;
          if (supply <= 250) {
            publicSale = await contractOf.methods.preSaleprice1().call();
            publicSale = publicSale * count;
            publicSale = caver.utils.fromPeb(publicSale);
            console.log("publicSale 1", publicSale);
          } else if (supply <= 300) {
            publicSale = await contractOf.methods.preSaleprice2().call();
            publicSale = publicSale * count;
            publicSale = caver.utils.fromPeb(publicSale);
            console.log("publicSale 2", publicSale);
          } else if (supply <= 500) {
            publicSale = await contractOf.methods.preSaleprice3().call();
            publicSale = publicSale * count;
            publicSale = caver.utils.fromPeb(publicSale);
            console.log("publicSale 3", publicSale);
          }
          console.log("publicSale all", publicSale);
          // let totalPrice = await contractOf.methods.gPRice(count).call();
          // console.log("totalPrice", totalPrice);
          let balance = await caver.klay.getBalance(acc);
          // balance = caver.utils.fromPeb(balance);
          console.log("Balance", balance);
          let ownerList = await contractOf.methods.walletOfOwner(acc).call();
          const length = ownerList.length;
          console.log("ownerList", length);
          if (length <= 6) {
            if (parseFloat(balance) > parseFloat(publicSale)) {
              await contractOf.methods.preSalemint(count).send({
                from: acc,
                value: publicSale,
                gas: "5000000",
              });
              isLoading(false);
              toast.success(t("transaction.Successfull"));
              dispalyImage();
            } else {
              toast.error(t("insufficient.Balance!"));
              isLoading(false);
            }
          } else {
            toast.error("Minting Limit Reached (6)");
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
          if (ids <= 500) {
            let imageUrl = `/config/images/${ids}.jpg`;
            let imageName = `Common #${ids}`;
            imagesArray = [...imagesArray, { imageName, imageUrl }];
            setMintArray(imagesArray);
          } else {
            let imageUrl = `/config/king/${ids - 500}.jpg`;
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
  const handleCLodemodal = () => {
    setCollectionModalShow(false);
    isLoading(false);
  };
  useEffect(() => {
    tabsLight();
  }, []);

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
              <div class="mintCard">
                <img src={mint} class=" mintImage" alt="..." />
                <div class=" mintCardBody pb-1">
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
              <div class="mintCard mintCard2 presaleCard">
                <nav>
                  <div class="nav nav-tabs" id="nav-tab" role="tablist">
                    <button
                      class={`nav-link navTabs ${active1} tab1`}
                      id="nav-home-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-home"
                      type="button"
                      role="tab"
                      aria-controls="nav-home"
                      aria-selected="true"
                    >
                      <span className="tabText">{t("presale.2")}</span>
                    </button>
                    <button
                      class={`nav-link navTabs ${active2}`}
                      id="nav-profile-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-profile"
                      type="button"
                      role="tab"
                      aria-controls="nav-profile"
                      aria-selected="false"
                    >
                      <span className="tabText">{t("presale.3")}</span>
                    </button>
                    <button
                      class={`nav-link navTabs tab3 ${active3}`}
                      id="nav-contact-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-contact"
                      type="button"
                      role="tab"
                      aria-controls="nav-contact"
                      aria-selected="false"
                    >
                      <span className="tabText">{t("presale.4")}</span>
                    </button>
                  </div>
                </nav>
                <div class="tab-content" id="nav-tabContent">
                  <div
                    class="tab-pane fade show active"
                    id="nav-home"
                    role="tabpanel"
                    aria-labelledby="nav-home-tab"
                  >
                    <div class="mintCardBody preSaleCardBody m-3">
                      <div class="progress mt-5">
                        <div
                          class="progress-bar progress-bar-success progress-bar-striped"
                          role="progressbar"
                          aria-valuenow="0"
                          aria-valuemin="0"
                          aria-valuemax="100"
                          style={{ width: "0%" }}
                        >
                          0%
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
                            <span className="textColor me-1">100</span>
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
                    class="tab-pane fade"
                    id="nav-profile"
                    role="tabpanel"
                    aria-labelledby="nav-profile-tab"
                  >
                    <div class="mintCardBody preSaleCardBody m-3">
                      <div class="progress mt-5">
                        <div
                          class="progress-bar progress-bar-success progress-bar-striped"
                          role="progressbar"
                          aria-valuenow="40"
                          aria-valuemin="0"
                          aria-valuemax="100"
                          style={{ width: "40%" }}
                        >
                          40%
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
                            <span className="textColor me-1">125</span>
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
                    class="tab-pane fade"
                    id="nav-contact"
                    role="tabpanel"
                    aria-labelledby="nav-contact-tab"
                  >
                    <div class="mintCardBody preSaleCardBody m-3">
                      <div class="progress mt-5">
                        <div
                          class="progress-bar progress-bar-success progress-bar-striped"
                          role="progressbar"
                          aria-valuenow="100"
                          aria-valuemin="0"
                          aria-valuemax="100"
                          style={{ width: "100%" }}
                        >
                          100%
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
                            <span className="textColor me-1">150</span>
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
                            className="btnMintPresale mt-3 mb-3"
                            onClick={() => mintAndStake()}
                          >
                            {t("navbar.mint")}
                            {/* {t("presale.Sold")} */}
                          </button>
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
