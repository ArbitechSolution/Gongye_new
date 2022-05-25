import React, { useEffect, useState } from "react";
import containerImage from "../media/Group 48.png";

import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { googyeContractAddress, goongyeContractAbi } from "../Utils/Goongye";
import { stakingContractAddress, stakingContractAbi } from "../Utils/Staking";
import { tokenContractAbi, tokenContractAddress } from "../Utils/Token";
import { toast } from "react-toastify";
import "./Staking.css";
import "../MintModal.css";
import Caver from "caver-js";
import { connectionAction } from "../Redux/connection/actions";
import light from "../media/light-from-top-background.png";
import Modal from "react-bootstrap/Modal";

export default function Staking({ changeMain, changeStake, changePresale }) {
  let acc = useSelector((state) => state.connect?.connection);
  const caver = new Caver(window.klaytn);
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [collectionModalShow, setCollectionModalShow] = useState(false);
  const [stakedCollectionShow, setStakedCollectionShow] = useState(false);
  let [mintArray, setMintArray] = useState([]);
  let [kingMintArray, setKingMintArray] = useState([]);
  let [stakedNFTArray, setStakedNFT] = useState([]);
  const [indexForTransfer, setIndexForTransfer] = useState(null);
  const [inputValue, setInputValue] = useState(null);
  const [rewardBalance, setRewardBalance] = useState(0.0);
  const [maguniBalance, setmaguniBalance] = useState(0.0);
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
  const handleOnChnage = (e) => {
    const value = e.target.value;
    setInputValue(value);
    console.log("value", value);
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
        let KingImagesArray = [];
        totalIDs.forEach(async (ids) => {
          if (ids <= 40) {
            let imageUrl = `/config/images/${ids}.jpg`;
            let imageName = `Common #${ids}`;
            let nftID = ids;
            // console.log("imageUrl", imageUrl);
            // console.log("iamgeName", imageName);
            imagesArray = [...imagesArray, { imageName, imageUrl, nftID }];
            setMintArray(imagesArray);
          } else {
            let imageUrl = `/config/images/${ids}.jpg`;
            let imageName = `King #${ids}`;
            let nftID = ids;
            // console.log("imageUrl", imageUrl);
            // console.log("iamgeName", imageName);
            KingImagesArray = [
              ...KingImagesArray,
              { imageName, imageUrl, nftID },
            ];
            setKingMintArray(KingImagesArray);
          }
        });
      }
    } catch (e) {
      console.log(" Error while displaying images", e);
    }
    // }
  };

  const getBalanceToken = async () => {
    if (acc == "No Wallet") {
      console.log("No wallet");
      console.log(acc);
    } else if (acc == "Wrong Network") {
      console.log("Wrong Network");
      console.log(acc);
    } else if (acc == "Connect Wallet") {
      console.log(acc);
    } else {
      let contractOfToken = new caver.klay.Contract(
        tokenContractAbi,
        tokenContractAddress
      );
      let balance = await contractOfToken.methods.balanceOf(acc).call();
      balance = caver.utils.fromPeb(balance);
      setmaguniBalance(balance);
      console.log("balance", balance);
    }
  };
  const transferNFT = async () => {
    try {
      if (inputValue != null) {
        let contractOf = new caver.klay.Contract(
          goongyeContractAbi,
          googyeContractAddress
        );

        await contractOf.methods
          .transferFrom(acc, inputValue, indexForTransfer.nftID)
          .send({
            from: acc,
            gas: "5000000",
          });
        setCollectionModalShow(false);
        dispalyImage();
        toast.success("NFT Transfered Successfully");
        setInputValue(null);
      } else {
        toast.info("Seems Like You Forgot To Enter Account");
      }
    } catch (e) {
      toast.error("Transcation Failed");
    }
  };
  const handleGetBalance = async () => {
    if (acc == "No Wallet") {
      console.log("No wallet");
      console.log(acc);
    } else if (acc == "Wrong Network") {
      console.log("Wrong Network");
      console.log(acc);
    } else if (acc == "Connect Wallet") {
      console.log(acc);
    } else {
      let contractOfStaking = new caver.klay.Contract(
        stakingContractAbi,
        stakingContractAddress
      );
      let res = await contractOfStaking.methods.rewardOfUser(acc).call();
      let totalPrice = caver.utils.fromPeb(res);
      setRewardBalance(totalPrice);
      console.log("balacne", totalPrice);
    }
  };
  const NFTstaking = async (item) => {
    try {
      let contractOfNft = new caver.klay.Contract(
        goongyeContractAbi,
        googyeContractAddress
      );
      let appr = true;
      let isApproved = await contractOfNft.methods
        .isApprovedForAll(acc, stakingContractAddress)
        .call();

      if (!isApproved) {
        await contractOfNft.methods
          .setApprovalForAll(stakingContractAddress, appr)
          .send({
            from: acc,
            gas: "5000000",
          });
      }

      let contractOfStaking = new caver.klay.Contract(
        stakingContractAbi,
        stakingContractAddress
      );
      console.log("item.nftID", item.nftID);
      await contractOfStaking.methods.Stake([item.nftID]).send({
        from: acc,
        gas: "5000000",
      });
      dispalyImage();
      stakedNFT();
      toast.success("Transaction Successful");
    } catch (e) {
      toast.error("Error while Staking", e);
      console.log("error", e);
    }
  };
  const stakedNFT = async () => {
    if (acc == "No Wallet") {
      console.log("No wallet");
      console.log(acc);
    } else if (acc == "Wrong Network") {
      console.log("Wrong Network");
      console.log(acc);
    } else if (acc == "Connect Wallet") {
      console.log(acc);
    } else {
      try {
        let contractOfStaking = new caver.klay.Contract(
          stakingContractAbi,
          stakingContractAddress
        );
        let NFtIds = await contractOfStaking.methods.userStakedNFT(acc).call();
        console.log("res", NFtIds);
        let imagesArray = [];
        NFtIds.forEach(async (ids) => {
          let imageUrl = `/config/images/${ids}.jpg`;
          let imageName = `Common #${ids}`;
          let nftID = ids;
          imagesArray = [...imagesArray, { imageName, imageUrl, nftID }];
          setStakedNFT(imagesArray);
        });
      } catch (e) {
        toast.error("Error while Fetching Staked NFTs");
      }
    }
  };

  const unStakedNFT = async (item) => {
    if (acc == "No Wallet") {
      console.log("No wallet");
      console.log(acc);
    } else if (acc == "Wrong Network") {
      console.log("Wrong Network");
      console.log(acc);
    } else if (acc == "Connect Wallet") {
      console.log(acc);
    } else {
      try {
        let contractOfStaking = new caver.klay.Contract(
          stakingContractAbi,
          stakingContractAddress
        );
        console.log("res", item);

        let NFtIds = await contractOfStaking.methods
          .unstake([item.nftID])
          .send({
            from: acc,
            gas: "500000",
          });
        console.log("res", NFtIds);
        // let imagesArray = [];
        // NFtIds.forEach(async (ids) => {
        //   let imageUrl = `/config/images/${ids}.jpg`;
        //   let imageName = `Common #${ids}`;
        //   let nftID = ids;
        //   imagesArray = [...imagesArray, { imageName, imageUrl, nftID }];
        //   setStakedNFT(imagesArray);
        // });
        dispalyImage();
        toast.success("Unstake Successful");
      } catch (e) {
        toast.error("Error while Fetching Staked NFTs");
      }
    }
  };

  const withdrawReward = async () => {
    if (acc == "No Wallet") {
      console.log("No wallet");
      console.log(acc);
    } else if (acc == "Wrong Network") {
      console.log("Wrong Network");
      console.log(acc);
    } else if (acc == "Connect Wallet") {
      console.log(acc);
    } else {
      try {
        let contractOfStaking = new caver.klay.Contract(
          stakingContractAbi,
          stakingContractAddress
        );
        let res = await contractOfStaking.methods.WithdrawReward().send({
          from: acc,
          gas: "5000000",
        });
        console.log(res, "witjdraw");
      } catch (e) {
        toast.error("Error while getting Reward");
        console.log("errr", e);
      }
    }
  };
  const updgradToKing = async (item) => {
    if (acc == "No Wallet") {
      console.log("No wallet");
      console.log(acc);
    } else if (acc == "Wrong Network") {
      console.log("Wrong Network");
      console.log(acc);
    } else if (acc == "Connect Wallet") {
      console.log(acc);
    } else {
      try {
        let contractOf = new caver.klay.Contract(
          goongyeContractAbi,
          googyeContractAddress
        );
        let val = 0.01;
        let totalPrice = caver.utils.toPeb(val.toString());
        let id = item.nftID;
        await contractOf.methods.UpgradeKing(id).send({
          from: acc,
          value: totalPrice,
          gas: "500000",
        });
        dispalyImage();
      } catch (e) {
        toast.error("Breeding Failed");
        console.log("e", e);
      }
    }
  };
  useEffect(() => {
    dispalyImage();
    stakedNFT();
  }, [acc]);
  useEffect(() => {
    handleGetBalance();
    getBalanceToken();
  }, [acc]);
  useEffect(() => {
    setInterval(() => {
      handleGetBalance();
      // getBalanceToken();
    }, 2000);
  }, [rewardBalance]);
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
              <button
                className="btnAllReward ms-2"
                onClick={() => withdrawReward()}
              >
                {t("staking.para3")}
              </button>
            </div>
          </div>

          <div className="mt-2">
            <span className="balanceMag">
              {t("staking.para4")} :{maguniBalance}
            </span>
          </div>
          <div className="mt-2">
            <h6 className="card-sub-title">
              {t("staking.para7")}
              &nbsp;: &nbsp;{rewardBalance}
            </h6>
          </div>

          {mintArray.length > 0 && (
            <div className="mt-2">
              <span className="textMyCrazy">{t("staking.para5")}</span>
            </div>
          )}
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
                      <p className="card-text">{t("staking.para8")}</p>
                      <a href="#" className="card-Link">
                        https://crazyapegoongyeclub.com/
                      </a>
                      <div className="card_btn">
                        <button
                          className="btn-stake me-2"
                          onClick={() => NFTstaking(item)}
                        >
                          {t("staking.para9")}
                        </button>
                        <button
                          className="btn-breed"
                          onClick={() => updgradToKing(item)}
                        >
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
          </div>

          {stakedNFTArray.length > 0 && (
            <div className="mt-5">
              <span className="textMyCrazy">Staked Crazy Ape Goongye</span>
            </div>
          )}
          <div className="row ">
            {stakedNFTArray.map((item, index) => {
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
                      <p className="card-text">{t("staking.para8")}</p>
                      <a href="#" className="card-Link">
                        https://crazyapegoongyeclub.com/
                      </a>
                      <div className="card_btn">
                        <button
                          className="btn-stake me-2"
                          // onClick={() => NFTstaking(item)}
                          onClick={() => {
                            unStakedNFT(item);
                          }}
                        >
                          {t("staking.unstake")}
                        </button>
                        <button className="btn-reward">
                          {t("staking.claimReward")}
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
          </div>
          {kingMintArray.length > 0 && (
            <div className="mt-5">
              <span className="textMyCrazy">Staked King Ape Goongye</span>
            </div>
          )}
          <div className="row mb-3">
            {kingMintArray.map((item, index) => {
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
                      <p className="card-text">{t("staking.para8")}</p>
                      <a href="#" className="card-Link">
                        https://crazyapegoongyeclub.com/
                      </a>
                      <div className="card_btn">
                        <button
                          className="btn-stake me-2"
                          onClick={() => NFTstaking(item)}
                        >
                          {t("staking.para9")}
                        </button>
                        <button
                          className="btn-breed"
                          onClick={() => updgradToKing(item)}
                        >
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
                        <div className="col-12 mintcol mt-2 ms-5">
                          <h6 className="text-white">{t("nftCard.to")}</h6>
                        </div>
                        <div className="col-12 mintcol mt-1 d-flex justify-content-center">
                          <input
                            type="text"
                            className="inputBox"
                            onChange={handleOnChnage}
                          ></input>
                        </div>
                        <div className="col-12 mintCol mt-5 mb-5">
                          <button
                            className="btnStaking mt-2 me-2"
                            onClick={() => transferNFT()}
                          >
                            {t("nftcard.confirm")}
                          </button>
                          <button
                            className="btnLater mt-2"
                            onClick={() => setCollectionModalShow(false)}
                          >
                            {t("modal.later")}
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
