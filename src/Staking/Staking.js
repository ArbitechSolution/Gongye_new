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

export default function Staking() {
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
  const [rewardBalance, setRewardBalance] = useState([]);
  const [maguniBalance, setmaguniBalance] = useState(0.0);

  const onConnectAccount = () => {
    dispatch(connectionAction());
    // setCollectionModalShow(true);
  };

  const handleTransfer = (index, item) => {
    setCollectionModalShow(true);
    setIndexForTransfer(item);
  };
  const handleOnChnage = (e) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const dispalyImage = async () => {
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
        let cc2 = totalIDs.map((a) => a);
        let sortedArray = cc2.sort((a, b) => a - b);
        // totalIDs = totalIDs.sort();
        // NFtIds = NFtIds.sort();
        console.log("totalIDs", totalIDs);
        let imagesArray = [];
        let KingImagesArray = [];
        if (totalIDs.length == 0) {
          setMintArray(null);
        } else {
          sortedArray.forEach(async (ids) => {
            if (ids <= 500) {
              let imageUrl = `/config/images/${ids}.jpg`;
              let imageName = `Common #${ids}`;
              let nftID = ids;
              console.log("imageUrl", imageUrl);
              console.log("iamgeName", imageName);
              imagesArray = [...imagesArray, { imageName, imageUrl, nftID }];
              setMintArray(imagesArray);
            } else {
              let imageUrl = `/config/king/${ids - 500}.jpg`;
              let imageName = `King #${ids}`;
              let nftID = ids;
              // console.log("imageUrl", imageUrl);
              // console.log("iamgeName", imageName);
              // KingImagesArray = [
              //   ...KingImagesArray,
              //   { imageName, imageUrl, nftID },
              // ];
              // setKingMintArray(KingImagesArray);
              imagesArray = [...imagesArray, { imageName, imageUrl, nftID }];
              setMintArray(imagesArray);
            }
          });
        }
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
    }
  };
  const handleTransferInCollection = async () => {
    toast.info("Please Unstaked First");
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
  const handleGetBalance = async (item) => {
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
      console.log(res, "reward of single item");
      let totalPrice = caver.utils.fromPeb(res);
      console.log("totalPrice ", totalPrice.toLocaleString());
      setRewardBalance(totalPrice);
    }
  };
  const stakeAllNFT = async () => {
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
        let ownerList = await contractOfNft.methods.walletOfOwner(acc).call();
        const length = ownerList?.length;
        await contractOfStaking.methods.Stake(ownerList).send({
          from: acc,
          gas: "5000000",
        });
        setMintArray(null);
        setKingMintArray(null);
        dispalyImage();
        stakedNFT();
        toast.success("Transaction Successful");
      } catch (e) {
        toast.error("Transaction Failed");
        console.log("error", e);
      }
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
      console.log("item.nftID", item?.nftID);
      await contractOfStaking.methods.Stake([item.nftID]).send({
        from: acc,
        gas: "5000000",
      });
      dispalyImage();
      stakedNFT();
      toast.success("Transaction Successful");
    } catch (e) {
      toast.error("Transaction Failed");
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
        let cc2 = NFtIds.map((a) => a);
        let sortedArray = cc2.sort((a, b) => a - b);
        console.log("sorted staked", sortedArray);
        // NFtIds = NFtIds.sort();
        // console.log("nft ids", NFtIds);
        // let imagesArray = [];
        // let KingImagesArray = [];
        // totalIDs.forEach(async (ids) => {
        //   if (ids <= 40) {
        //     let imageUrl = `/config/images/${ids}.jpg`;
        //     let imageName = `Common #${ids}`;
        //     let nftID = ids;
        //     // console.log("imageUrl", imageUrl);
        //     // console.log("iamgeName", imageName);
        //     imagesArray = [...imagesArray, { imageName, imageUrl, nftID }];
        //     setMintArray(imagesArray);
        //   } else {
        //     let imageUrl = `/config/images/${ids}.jpg`;
        //     let imageName = `King #${ids}`;
        //     let nftID = ids;
        //     // console.log("imageUrl", imageUrl);
        //     // console.log("iamgeName", imageName);
        //     // KingImagesArray = [
        //     //   ...KingImagesArray,
        //     //   { imageName, imageUrl, nftID },
        //     // ];
        //     // setKingMintArray(KingImagesArray);
        //     imagesArray = [...imagesArray, { imageName, imageUrl, nftID }];
        //     setMintArray(imagesArray);
        //   }

        let imagesArray = [];
        let KingImagesArray = [];
        let rewardsArray = [];
        sortedArray.forEach(async (ids) => {
          if (ids <= 500) {
            let imageUrl = `/config/images/${ids}.jpg`;
            let imageName = `Common #${ids}`;
            let nftID = ids;
            let nftBalance;
            let res = await contractOfStaking.methods
              .rewardOfUser(acc, ids)
              .call();
            nftBalance = caver.utils.fromPeb(res);
            rewardsArray = [...rewardsArray, { nftID, nftBalance }];
            setRewardBalance(rewardsArray);

            imagesArray = [
              ...imagesArray,
              { imageName, imageUrl, nftID, nftBalance },
            ];
            setStakedNFT(imagesArray);
          } else {
            let imageUrl = `/config/king/${ids - 500}.jpg`;
            let imageName = `King #${ids}`;
            let nftID = ids;
            let nftBalance;
            let res = await contractOfStaking.methods
              .rewardOfUser(acc, ids)
              .call();

            nftBalance = caver.utils.fromPeb(res);
            rewardsArray = [...rewardsArray, { nftID, nftBalance }];
            setRewardBalance(rewardsArray);

            KingImagesArray = [
              ...KingImagesArray,
              { imageName, imageUrl, nftID, nftBalance },
            ];
            setKingMintArray(KingImagesArray);
          }
        });
      } catch (e) {
        console.log("Error while showing stakedNFT", e);
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
        console.log("item in unststake", item.nftID);

        await contractOfStaking.methods.UnStake(item.nftID).send({
          from: acc,
          gas: "500000",
        });

        let imagesArray = [];
        console.log("stakedArray before", stakedNFTArray?.length);
        if (item.nftID <= 500) {
          stakedNFTArray = stakedNFTArray.filter(function (items) {
            return items.nftID !== item.nftID;
          });
          setStakedNFT(stakedNFTArray);
          getBalanceToken();
          console.log("stakedArray", stakedNFTArray?.length);
          dispalyImage();
          toast.success("Unstake Successful");
          setStakedNFT(stakedNFTArray);
        } else {
          kingMintArray = kingMintArray.filter(function (items) {
            return items.nftID !== item.nftID;
          });
          setKingMintArray(kingMintArray);
          getBalanceToken();
          console.log("stakedArray", kingMintArray?.length);
          dispalyImage();
          toast.success("Unstake Successful");
          setKingMintArray(kingMintArray);
        }
      } catch (e) {
        toast.error("Transaction Failed");
        console.log("error", e);
      }
    }
  };

  const withdrawReward = async (item) => {
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
        let nftBalance;
        let contractOfStaking = new caver.klay.Contract(
          stakingContractAbi,
          stakingContractAddress
        );
        // let res = await contractOfStaking.methods
        //   .rewardOfUser(acc, item.nftID)
        //   .call();
        // nftBalance = caver.utils.fromPeb(res);
        // console.log("nftBalance", nftBalance);
        let result = await contractOfStaking.methods
          .WithdrawReward(item.nftID)
          .send({
            from: acc,
            gas: "500000",
          });
        console.log("result of withdraw reward", result);
        // rewardsArray = [...rewardsArray, { nftID, nftBalance }];
        // setRewardBalance(rewardsArray);
        toast.success("Transaction Successful");
        getBalanceToken();
      } catch (e) {
        toast.error("Transaction Failed");
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
  const balanceForAllItems = async () => {
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
        let cc2 = NFtIds.map((a) => a);
        let sortedArray = cc2.sort((a, b) => a - b);
        // console.log("sorted staked", sortedArray);

        sortedArray.forEach(async (ids) => {
          if (ids <= 500) {
            let res = await contractOfStaking.methods
              .rewardOfUser(acc, ids)
              .call();
            let eachItemBalance = caver.utils.fromPeb(res);
            console.log("totalPrice ", eachItemBalance.toLocaleString());
            {
              rewardBalance &&
                rewardBalance.map((item, index) => {
                  if (item.nftID == ids) {
                    item.nftBalance = eachItemBalance;
                    // console.log(item.nftBalance, "reward of single item");
                  }
                });
            }
            console.log("rewardBalance in <40", rewardBalance);
            setRewardBalance([...rewardBalance]);
          } else {
            let res = await contractOfStaking.methods
              .rewardOfUser(acc, ids)
              .call();
            let eachItemBalance = caver.utils.fromPeb(res);
            {
              rewardBalance &&
                rewardBalance.map((item, index) => {
                  if (item.nftID == ids) {
                    item.nftBalance = eachItemBalance;
                    // console.log(item.nftBalance, "reward of single item");
                  }
                });
            }
            console.log("rewardBalance", rewardBalance);

            setRewardBalance([...rewardBalance]);
          }
        });
      } catch (e) {
        console.log("Error while showing stakedNFT", e);
      }
    }
  };
  useEffect(() => {
    dispalyImage();
    // stakedNFT();
    // unStakedNFT();
  }, [stakedNFTArray]);
  useEffect(() => {
    dispalyImage();
    stakedNFT();
    getBalanceToken();

    // unStakedNFT();
  }, [acc]);
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);
  useEffect(() => {
    // handleGetBalance();
  }, [acc]);
  let interv = null;
  useEffect(() => {
    interv = setInterval(() => {
      // handleGetBalance();
      // getBalanceToken();
      balanceForAllItems();
    }, 3000);

    return () => clearInterval(interv);
  }, [rewardBalance]);

  // useEffect(() => {
  //   balanceForAllItems();
  //   // stakedNFT();
  // }, [rewardBalance]);
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
              <button className="btnStake  mt-2" onClick={() => stakeAllNFT()}>
                {t("staking.para2")}
              </button>
            </div>
            {/* <div className="col-lg-6 col-md-12 mt-2">
              <button className="btnAllReward" onClick={() => withdrawReward()}>
                {t("staking.para3")}
              </button>
            </div> */}
          </div>

          <div className="mt-2">
            <span className="balanceMag">
              {t("staking.para4")}&nbsp; : &nbsp;
              {maguniBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </span>
          </div>
          {/* <div className="mt-2">
            <h6 className="card-sub-title">
              {t("staking.para7")}
              &nbsp;: &nbsp;
              {rewardBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </h6>
          </div> */}

          {mintArray && mintArray?.length > 0 && (
            <div className="mt-2">
              <span className="textMyCrazy">{t("staking.para5")}</span>
            </div>
          )}
          <div className="row ">
            {mintArray &&
              mintArray.map((item, index) => {
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
                        {/* <div className="mt-2 rewardDiv">
                          <h6 className="card-sub-title rewardTitle">
                            {t("staking.claimable")}
                            &nbsp;: &nbsp;
                          </h6>
                          <span className="cardRewardBalance">
                            {rewardBalance}
                          </span>
                        </div> */}

                        <p className="card-text">{t("staking.para8")}</p>
                        <a href="#" className="card-Link">
                          https://crazyapegoongyeclub.com/
                        </a>
                        {item.nftID <= 500 ? (
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
                        ) : (
                          <div className="card-buttons">
                            <button
                              className="btn-stake me-2"
                              onClick={() => NFTstaking(item)}
                            >
                              {t("staking.para9")}
                            </button>
                          </div>
                        )}

                        <div className="card-buttons mt-2">
                          {/* <button className="btn-changeName">
                          {t("staking.para10")}
                        </button>
                        <button className="btn-changeBio">
                          {t("staking.para11")}
                        </button> */}
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

          {stakedNFTArray && stakedNFTArray?.length > 0 && (
            <div className="mt-5">
              <span className="textMyCrazy">{t("staking.crazyHeading")}</span>
            </div>
          )}
          <div className="row ">
            {stakedNFTArray &&
              stakedNFTArray.map((item, index) => {
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

                        {/* <div className="mt-2 rewardDiv">
                        <div className="rewardInner">
                          <h6 className=" rewardTitle">
                            {t("staking.daily")}
                            &nbsp;&nbsp;
                          </h6>
                          <h6 className=" rewardTitle">
                            {t("staking.reward")}
                            &nbsp;: &nbsp;
                          </h6>
                        </div>
                        <div className="claimableDiv">
                          <span className="rewardTitle ">
                            {t("staking.claimable")}
                          </span>
                          <span className="cardRewardBalance ">
                            {rewardBalance}
                          </span>
                        </div>
                      </div> */}
                        {/* <div className="mt-2 rewardDiv">
                        <h6 className="card-sub-title rewardTitle">
                          {t("staking.para7")}
                          &nbsp;: &nbsp;
                        </h6>
                        <span className="cardRewardBalance ">
                          {rewardBalance}
                        </span>
                      </div> */}
                        <div className="mt-2 rewardDiv">
                          <h6 className="card-sub-title rewardTitle">
                            {t("staking.claimable")}
                            &nbsp;: &nbsp;
                          </h6>
                          {rewardBalance &&
                            rewardBalance.map((items) => {
                              if (items.nftID == item.nftID) {
                                return (
                                  <span className="cardRewardBalance">
                                    {items.nftBalance}
                                  </span>
                                );
                              }
                            })}
                        </div>
                        <p className="card-text">{t("staking.para8")}</p>
                        <a href="#" className="card-Link">
                          https://crazyapegoongyeclub.com/
                        </a>
                        <div className="card_btn">
                          {/* <div className="card-buttons"> */}
                          <button
                            className="btn-stake me-2"
                            // onClick={() => NFTstaking(item)}
                            onClick={() => {
                              unStakedNFT(item);
                            }}
                          >
                            {t("staking.unstake")}
                          </button>
                          <button
                            className="btn-reward"
                            onClick={() => {
                              withdrawReward(item);
                            }}
                          >
                            {t("staking.claimReward")}
                          </button>
                        </div>
                        <div className="card-buttons mt-2">
                          {/* <button className="btn-changeName">
                          {t("staking.para10")}
                        </button>
                        <button className="btn-changeBio">
                          {t("staking.para11")}
                        </button> */}
                          <button
                            className="btn-transfer"
                            onClick={() => handleTransferInCollection()}
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
          {kingMintArray && kingMintArray?.length > 0 && (
            <div className="mt-5">
              <span className="textMyCrazy">{t("staking.kingHeading")}</span>
            </div>
          )}
          <div className="row mb-3">
            {kingMintArray &&
              kingMintArray.map((item, index) => {
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
                        {/* <div className="mt-2 rewardDiv">
                        <div className="rewardInner">
                          <h6 className=" rewardTitle">
                            {t("staking.daily")}
                            &nbsp;&nbsp;
                          </h6>
                          <h6 className=" rewardTitle">
                            {t("staking.reward")}
                            &nbsp;: &nbsp;
                          </h6>
                        </div>
                        <div className="claimableDiv">
                          <span className="rewardTitle ">
                            {t("staking.claimable")}
                          </span>
                          <span className="cardRewardBalance ">
                            {rewardBalance}
                          </span>
                        </div>
                      </div> */}
                        <div className="mt-2 rewardDiv">
                          <h6 className="card-sub-title rewardTitle">
                            {t("staking.claimable")}
                            &nbsp;: &nbsp;
                          </h6>
                          {rewardBalance &&
                            rewardBalance.map((items) => {
                              if (items.nftID == item.nftID) {
                                return (
                                  <span className="cardRewardBalance">
                                    {items.nftBalance}
                                  </span>
                                );
                              }
                            })}
                        </div>
                        <p className="card-text">{t("staking.para8")}</p>
                        <a href="#" className="card-Link">
                          https://crazyapegoongyeclub.com/
                        </a>
                        <div className="card_btn">
                          {/* <div className="card-buttons"> */}
                          <button
                            className="btn-stake me-2"
                            // onClick={() => NFTstaking(item)}
                            onClick={() => {
                              unStakedNFT(item);
                            }}
                          >
                            {t("staking.unstake")}
                          </button>
                          <button
                            className="btn-reward"
                            onClick={() => {
                              withdrawReward(item);
                            }}
                          >
                            {t("staking.claimReward")}
                          </button>
                        </div>
                        {/* <div className="card_btn">
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
                      </div> */}
                        <div className="card-buttons mt-2">
                          {/* <button className="btn-changeName">
                          {t("staking.para10")}
                        </button>
                        <button className="btn-changeBio">
                          {t("staking.para11")}
                        </button> */}
                          <button
                            className="btn-transfer"
                            onClick={() => handleTransferInCollection()}
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
              <div className="container-fluid container-presales-outside m-5 m-md-3 m-sm-2 ps-0 m-md-1 m-sm-1">
                <div className="container-presales m-1 p-lg-5 p-md-3">
                  <div className="row ">
                    <div className="col-12 connectBtnInPresale  ">
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
                            src={indexForTransfer.imageUrl}
                          />
                        </div>
                        <div className="col-12 mintCol mt-0">
                          <span className="heading">
                            {indexForTransfer.imageName}
                          </span>
                        </div>
                        <div className="col-12 mintcol mt-2 ">
                          <h6 className="text-white toText">
                            {t("nftCard.to")}
                          </h6>
                        </div>
                        <div className="col-12 mintcol mt-1 d-flex justify-content-center">
                          <input
                            type="text"
                            className="inputBox"
                            onChange={handleOnChnage}
                          ></input>
                        </div>
                        <div className="col-12 mintCol confirmAndLaterdiv mt-5 mb-5">
                          <button
                            className="btnStaking mt-2 me-1"
                            onClick={() => transferNFT()}
                          >
                            {t("nftcard.confirm")}
                          </button>
                          <button
                            className="btnLater  mt-2"
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
