import React, { useEffect, useState } from "react";
import containerImage from "../media/Group 48.png";
import Twitter from "../media/twitter.png";
import Telegram from "../media/telegram.png";
import Kakao from "../media/kakao.png";
import Discord from "../media/discord.png";
import Logo from "../media/logo.png";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { googyeContractAddress, goongyeContractAbi } from "../Utils/Goongye";
import { toast } from "react-toastify";
import "./Staking.css";
import "../MintModal.css";
import Caver from "caver-js";
import { connectionAction } from "../Redux/connection/actions";
import image1 from "../media/Vector3.png";
import light from "../media/light-from-top-background.png";
import Modal from "react-bootstrap/Modal";
export default function Staking({ changeMain, changeStake, changePresale }) {
  let acc = useSelector((state) => state.connect?.connection);
  const caver = new Caver(window.klaytn);
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [collectionModalShow, setCollectionModalShow] = useState(false);
  let [mintArray, setMintArray] = useState([]);
  const [indexForTransfer, setIndexForTransfer] = useState(null);
  const onConnectAccount = () => {
    dispatch(connectionAction());
    // setCollectionModalShow(true);
  };
  const handleTransfer = (index, item) => {
    console.log("index", index);
    console.log("item", item);
    setCollectionModalShow(true);
    setIndexForTransfer(item);
  };
  const dispalyImage = async () => {
    console.log("account in displying images", acc);
    // if (acc == "No Wallet") {
    //   console.log("No wallet");
    //   toast.error(acc);
    // } else if (acc == "Wrong Network") {
    //   console.log("Wrong Network");
    //   toast.error(acc);
    // } else if (acc == "Connect Wallet") {
    //   toast.error(acc);
    // } else {
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
          setMintArray(imagesArray);
        });
      }
    } catch (e) {
      console.log(" Error while displaying images", e);
      // toast.error("Minting Failed");
    }
    // }
  };
  useEffect(() => {
    dispalyImage();
  }, [acc]);
  return (
    <div className="staking d-flex justify-content-center " id="staking">
      <div className="imgArea ">
        <img className="stakingTop-image" src={containerImage}></img>
        <span className="imgArea-text">{t("staking.para1")}</span>
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
          <div className="row btn-group ">
            <div className="col-lg-6 col-md-12">
              <button className="btnStake  mt-2" onClick={dispalyImage}>
                {t("staking.para2")}
              </button>
            </div>
            <div className="col-lg-6 col-md-12 mt-2">
              <button className="btnAllReward">{t("staking.para3")}</button>
            </div>
          </div>

          <div className="mt-2">
            <span className="balanceMag">{t("staking.para4")} : 0.00</span>
          </div>
          <div className="mt-2">
            <span className="textMyCrazy">{t("staking.para5")}</span>
          </div>
          <div className="row ">
            {mintArray.map((item, index) => {
              return (
                <div className="col col-lg-3  col-md-6 col-sm-12 pt-3 d-flex justify-content-center align-items-center">
                  <div className="card">
                    <img
                      className="card-img-top"
                      src={item.imageUrl}
                      alt="Card image cap"
                    />
                    <div className="card-body">
                      <h5 className="card-title">{item.imageName}</h5>
                      <h6 className="card-sub-title"> {t("staking.para7")}:</h6>
                      <p className="card-text">{t("staking.para8")}</p>
                      <a href="#" className="card-Link">
                        https://crazyapegoongyeclub.com/
                      </a>
                      <div className="card_btn">
                        <button className="btn-stake me-2">
                          {t("staking.para9")}
                        </button>{" "}
                        <button className="btn-breed">
                          {t("staking.parabreed")}
                        </button>
                      </div>
                      <div className="card-buttons mt-2">
                        <button className="btn-changeName">
                          {t("staking.para10")}
                        </button>
                        <button className="btn-changeBio">
                          {t("staking.para11")}
                        </button>
                        <button
                          className="btn-transfer"
                          onClick={() => handleTransfer(index, item)}
                        >
                          {t("staking.transefer")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* <div className="col col-lg-3  col-md-6 col-sm-12 pt-3">
              <div className="card">
                <img
                  className="card-img-top"
                  src={"image2"}
                  alt="Card image cap"
                />
                <div className="card-body">
                  <h5 className="card-title">Crazy Ape Goongye #101</h5>
                  <h6 className="card-sub-title">Daily Reward:</h6>
                  <p className="card-text">
                    The Crazy Ape Goongye Club is an ecosystem on the blockchain
                    populated by theruthless tyrant. a limited series of 10,000
                    NFT .. The $MAGUNI token is the utility that powers the CAGC
                    ecosystem.
                  </p>
                  <a href="#" className="card-Link">
                    https://crazyapegoongyeclub.com/
                  </a>
                  <div className="card-buttons mt-2">
                    <button className="btn-stake">Stake</button>
                    <button className="btn-changeName">Change Name</button>
                    <button className="btn-changeBio">Change Bio</button>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
          {/* <div className="mt-5">
            <span className="textMyCrazy">Staked Crazy Ape Goongye</span>
          </div> */}
          {/* <div className="row">
            <div className="col col-lg-3  col-md-6 col-sm-12 pt-3">
              <div className="card">
                <img
                  className="card-img-top"
                  src={"image3"}
                  alt="Card image cap"
                />
                <div className="card-body">
                  <h5 className="card-title">Crazy Ape Goongye #101</h5>
                  <h6 className="card-sub-title">Daily Reward:</h6>
                  <p className="card-text">
                    The Crazy Ape Goongye Club is an ecosystem on the blockchain
                    populated by theruthless tyrant. a limited series of 10,000
                    NFT .. The $MAGUNI token is the utility that powers the CAGC
                    ecosystem.
                  </p>
                  <a href="#" className="card-Link">
                    https://crazyapegoongyeclub.com/
                  </a>
                  <div className="card-buttons mt-2">
                    <button className="btn-stake">Stake</button>
                    <button className="btn-changeName">Change Name</button>
                    <button className="btn-changeBio">Change Bio</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col col-lg-3  col-md-6 col-sm-12 pt-3">
              <div className="card">
                <img
                  className="card-img-top"
                  src={"image4"}
                  alt="Card image cap"
                />
                <div className="card-body">
                  <h5 className="card-title">Crazy Ape Goongye #101</h5>
                  <h6 className="card-sub-title">Daily Reward:</h6>
                  <p className="card-text">
                    The Crazy Ape Goongye Club is an ecosystem on the blockchain
                    populated by theruthless tyrant. a limited series of 10,000
                    NFT .. The $MAGUNI token is the utility that powers the CAGC
                    ecosystem.
                  </p>
                  <a href="#" class="card-Link">
                    https://crazyapegoongyeclub.com/
                  </a>
                  <div className="card-buttons mt-2">
                    <button className="btn-stake">Stake</button>
                    <button className="btn-changeName">Change Name</button>
                    <button className="btn-changeBio">Change Bio</button>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          {/* <div className="mt-5">
            <span className="textMyCrazy">Staked King Ape Goongye</span>
          </div> */}
          {/* <div className="row mb-3">
            <div className="col col-lg-3  col-md-6 col-sm-12 mb-5 pt-3">
              <div className="card">
                <img
                  className="card-img-top"
                  src={"image5"}
                  alt="Card image cap"
                />
                <div className="card-body">
                  <h5 className="card-title">Crazy Ape Goongye #101</h5>
                  <h6 className="card-sub-title">Daily Reward:</h6>
                  <p className="card-text">
                    The Crazy Ape Goongye Club is an ecosystem on the blockchain
                    populated by theruthless tyrant. a limited series of 10,000
                    NFT .. The $MAGUNI token is the utility that powers the CAGC
                    ecosystem.
                  </p>
                  <a href="#" className="card-Link">
                    https://crazyapegoongyeclub.com/
                  </a>
                  <div className="card-buttons mt-2">
                    <button className="btn-stake">Stake</button>
                    <button className="btn-changeName">Change Name</button>
                    <button className="btn-changeBio">Change Bio</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="col col-lg-3  col-md-6 col-sm-12 mb-5 pt-3">
              <div class="card">
                <img class="card-img-top" src={"image6"} alt="Card image cap" />
                <div class="card-body">
                  <h5 class="card-title">Crazy Ape Goongye #101</h5>
                  <h6 className="card-sub-title">Daily Reward:</h6>
                  <p class="card-text">
                    The Crazy Ape Goongye Club is an ecosystem on the blockchain
                    populated by theruthless tyrant. a limited series of 10,000
                    NFT .. The $MAGUNI token is the utility that powers the CAGC
                    ecosystem.
                  </p>
                  <a href="#" class="card-Link">
                    https://crazyapegoongyeclub.com/
                  </a>
                  <div className="card-buttons mt-2">
                    <button className="btn-stake">Stake</button>
                    <button className="btn-changeName">Change Name</button>
                    <button className="btn-changeBio">Change Bio</button>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
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
              <img className="lightImg " src={light} alt="" />
              <div className="imgArea imageAreaStaking mt-lg-0 mt-md-0 mt-sm-2">
                <img
                  className="presalesTop-image stakingImage"
                  src={containerImage}
                ></img>
                <span className="imgArea-text stakingText">
                  {t("nftcard.transfer")}
                </span>
              </div>
              <div className=" container-presales-outside m-5 m-md-3 m-sm-2 ps-0 m-md-1 m-sm-1">
                <div className="container-presales m-1 p-lg-5 p-md-3">
                  <div className="row ">
                    <div className="connectBtnInPresale d-flex justify-content-end align-items-center ">
                      <button
                        className="btnConnectInPresale  mt-2 mb-2 "
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
                      <div>
                        <div className="col-12 mintCol mt-2">
                          <img
                            className=" pt-4 "
                            width="240px"
                            src={`${indexForTransfer.imageUrl}`}
                          />
                        </div>
                        <div className="col-12 mintCol mt-0">
                          <span className="heading">
                            {t("nftcard.heading")}
                          </span>
                        </div>
                        <div className="col-12 mintcol mt-2">
                          <h6 className="text-white">{t("nftCard.to")}</h6>
                        </div>
                        <div className="col-12 mintcol mt-1">
                          <input type="text" className="inputBox"></input>
                        </div>
                        <div className="col-12 mintCol mt-5 mb-5">
                          <button
                            className="btnStaking mt-2 me-2"
                            onClick={() => setCollectionModalShow(false)}
                          >
                            {t("nftcard.confirm")}
                          </button>
                        </div>
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
