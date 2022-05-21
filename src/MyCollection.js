import React, { useEffect, useState, useRef } from "react";
import "./MyCollection.css";
import { useSelector, useDispatch } from "react-redux";
import Modal from "react-bootstrap/Modal";
import { googyeContractAddress, goongyeContractAbi } from "./Utils/Goongye";
import axios from "axios";
import { toast } from "react-toastify";
import { connectionAction } from "./Redux/connection/actions";
import { IoMdClose } from "react-icons/io";
import { InputGroup, FormControl } from "react-bootstrap";

function MyCollection() {
  let dispatch = useDispatch();
  let [btnTxt, setBtTxt] = useState("Connect");
  let [modalShow, setModalShow] = useState(false);
  let [modalShowone, setModalShowone] = useState(false);
  let [clickedIndexes, setClickedIndexes] = useState();
  let [imageArray, setImageArray] = useState([]);
  let [test, setTest] = useState([]);
  let [initialLimit, setInitialLimit] = useState(0);
  let [finalLimit, setFinalLimit] = useState(12);
  let [mywalletLength, setMyWalletLength] = useState();
  let [dispalyimage, setDispalyImage] = useState([]);
  let [dispalynamedata, setDisplayNameData] = useState([]);
  let [pageNumber, setPageNumber] = useState(1);
  let [totalPages, setTotalPages] = useState(1);
  // let [num, setnum] = useState(0);
  let [popupshowaddress, setPopupshowaddress] = useState();
  let acc = useSelector((state) => state.connect.connection);

  let toAddress = useRef("");

  const loadMore = () => {
    let a = finalLimit + 12;
    if (a >= mywalletLength) {
      setInitialLimit(initialLimit + 12);
      if (pageNumber < totalPages) {
        setPageNumber(pageNumber + 1);
      }
      console.log("Loading More Up");
      setFinalLimit(mywalletLength);
    } else {
      console.log("Loading More");
      if (pageNumber < totalPages) {
        setPageNumber(pageNumber + 1);
      }
      setInitialLimit(initialLimit + 12);
      setFinalLimit(finalLimit + 12);
    }
  };

  const loadLess = () => {
    let b = finalLimit - 12;

    if (b <= 12) {
      setFinalLimit(12);
      setInitialLimit(0);
      if (pageNumber > 1) {
        setPageNumber(pageNumber - 1);
      }
    } else {
      setInitialLimit(initialLimit - 12);
      setPageNumber(pageNumber - 1);
      setFinalLimit(finalLimit - 12);
    }
  };
  const testAllImage = async () => {
    try {
      let res = await axios.get("/config/2.json");
      console.log("responce", res);
    } catch (e) {
      console.log("error testAllImage", e);
    }
  };

  const allImagesNfts = async () => {
    if (acc == "No Wallet") {
      console.log("wallet");
      setBtTxt("Connect Wallet");
    } else if (acc == "Wrong Network") {
      setBtTxt("Wrong Network");
    } else if (acc == "Connect Wallet") {
      console.log("Connect Wallet");
    } else {
      // console.log("Inside")
      const web3 = window.web3;
      let nftContractOf = new web3.eth.Contract(
        goongyeContractAbi,
        googyeContractAddress
      );
      let simplleArray = [];
      let walletOfOwner = await nftContractOf.methods.walletOfOwner(acc).call();
      let walletLength = walletOfOwner.length;
      setMyWalletLength(walletLength);
      console.log("walletOfOwner", walletOfOwner);
      // console.log("finalLimit", finalLimit);
      // console.log("initialLimit", initialLimit);

      let ttlPage = parseInt(walletLength) / 12;
      ttlPage = Math.ceil(ttlPage);
      setTotalPages(ttlPage);
      console.log("Total Pages", ttlPage);
      if (parseInt(walletLength) > 0) {
        // if(initialLimit<parseInt(walletLength))
        {
          let myImgArry = [];
          let myNameDate = [];
          for (let i = 0; i < walletLength; i++) {
            try {
              // console.log("Getting Response");
              let imagesArray = [];
              totalIDs.forEach(async (ids) => {
                let imageUrl = `/config/images/${ids}.jpg`;
                let imageName = `Common #${ids}`;
                console.log("imageUrl", imageUrl);
                console.log("iamgeName", imageName);
                imagesArray = [...imagesArray, { imageName, imageUrl }];
                setMintArray(imagesArray);
              });
            } catch (e) {
              console.log("Error while Fetching Api", e);
            }
          }
        }
      }
    }
  };

  const clickedImage = (index) => {
    console.log("You Clicked", index);
    setClickedIndexes(index);
    setModalShow(true);
  };

  const transferNft = async () => {
    if (acc == "No Wallet") {
      console.log("wallet");
      setBtTxt("Connect Wallet");
    } else if (acc == "Wrong Network") {
      setBtTxt("Wrong Network");
    } else if (acc == "Connect Wallet") {
      console.log("Connect Wallet");
    } else {
      let userEnteredAddress = toAddress.current.value;
      // console.log("userEnteredAddress", userEnteredAddress);
      setPopupshowaddress(userEnteredAddress);
      const web3 = window.web3;
      let stringLength = userEnteredAddress.length;
      if (parseInt(stringLength) > 0) {
        try {
          let contractOf = new caver.klay.Contract(
            goongyeContractAbi,
            googyeContractAddress
          );
          let totalIDs = await contractOf.methods.walletOfOwner(acc).call();
          console.log("idsss ", totalIDs);
          let tokenId = walletOfOwner[clickedIndexes];
          await nftContractOf.methods
            .safeTransferFrom(acc, userEnteredAddress, tokenId)
            .send({
              from: acc,
            });
          toast.success("Transaction confirmed");
          setModalShowone(true);

          setModalShow(false);
          allImagesNfts();
        } catch (e) {
          toast.error("Transaction Failed");
          console.log("Error While Transfering Nft", e);
        }
      } else {
        toast.error("Invalid Address");
      }
    }
  };

  const getWalletAddress = () => {
    dispatch(getWallet());
    // allImagesNfts()
  };
  useEffect(() => {
    allImagesNfts();
    // testAllImage();
  }, [acc]);
  // useEffect(() => {
  //     allImagesNfts();
  // }, [finalLimit])

  return (
    <div className="StakePageImagess pb-5">
      {modalShow ? (
        <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          // {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header className=" StakePageImage">
            <Modal.Title id="contained-modal-title-vcenter">
              <IoMdClose
                onClick={() => setModalShow(false)}
                size={28}
                style={{ color: "white", cursor: "pointer" }}
              />
              {/* <h2 className='collectionsTextLarge m-2'> Confirm</h2> */}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="StakePageImage d-flex justify-content-center align-items-center flex-column">
            <h4 className="collectionsTextLarge m-2  ">NFT card transfer</h4>
            <div className="col-lg-4 col-md-5 mycollections p-3 m-2">
              <img
                src={dispalyimage[clickedIndexes]}
                className="myCollectionsImage "
              />

              <div>
                <p className="collectionsText mt-3">
                  {dispalynamedata[clickedIndexes]}
                </p>
                {/* <p className='collectionsTextSmall'>Common</p> */}
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-md-12">
                <span className="buypoint-span">To</span>
                <InputGroup>
                  <input
                    ref={toAddress}
                    className="pointinput form-control"
                    // type="number"
                    min={1}
                    placeholder="0"
                    aria-label="Recipient's username with two button addons"
                  />
                </InputGroup>
              </div>
            </div>
            <div className="col-8 mt-3">
              <p className="Transfer-address-id text-center">
                Please confirm that your Transfer address supports the BSC
                network.
              </p>
            </div>
            <div className="d-grid gap-2 mt-3">
              <button
                onClick={() => {
                  transferNft();
                  // setModalShowone(true)
                }}
                className="btn btnStakePage"
                size="lg"
              >
                Confirm
              </button>
            </div>
          </Modal.Body>
        </Modal>
      ) : (
        <></>
      )}
      {modalShowone ? (
        <Modal
          show={modalShowone}
          onHide={() => setModalShowone(false)}
          // {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header className=" StakePageImage">
            <Modal.Title id="contained-modal-title-vcenter">
              <IoMdClose
                onClick={() => setModalShowone(false)}
                size={28}
                style={{ color: "white", cursor: "pointer" }}
              />
              {/* <h2 className='collectionsTextLarge m-2'> Confirm</h2> */}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="StakePageImage d-flex justify-content-center align-items-center flex-column">
            <h4 className="collectionsTextLarge m-2  ">NFT card transfer</h4>
            <div className="col-lg-4 col-md-5 mycollections p-4 m-2">
              <img
                src={dispalyimage[clickedIndexes]}
                className="myCollectionsImage "
              />

              <div>
                <p className="collectionsText mt-3">
                  {dispalynamedata[clickedIndexes]}
                </p>
                {/* <p className='collectionsTextSmall'>Common</p> */}
              </div>
            </div>
            <div className="row d-flex justify-content-center mt-2">
              <div className="col-md-12 col-12 buypintoxaddress ">
                <div className="row d-flex justify-content-center mt-4 mb-4">
                  <div className="col-12 mt-4">
                    <p className="buyPointText">To</p>
                    <p className="addressText1">{popupshowaddress}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-12 successfully-tag">
                <img src={tick2} width="50px" /> Card successfully transfered!
              </div>
            </div>
          </Modal.Body>
        </Modal>
      ) : (
        <></>
      )}
      <div className="StakePageImagess">
        <div className="container pt-3">
          <div className="row d-flex justify-content-center align-items-center pb-3">
            <div className="col-md-12 col-11 pt-4 pb-4">
              <div className="col-md-11 d-flex justify-content-end">
                <button
                  onClick={() => getWalletAddress()}
                  className="btn btnstake"
                >
                  {acc === "No Wallet"
                    ? "Connect "
                    : acc === "Connect Wallet"
                    ? "Connect"
                    : acc === "Connect to Rinkebey"
                    ? "Connect"
                    : acc.substring(0, 5) +
                      "..." +
                      acc.substring(acc.length - 5)}
                </button>
              </div>
              <div className="row collections">
                <div className="col-md-4 col-10 offset-md-4 text-center d-flex align-items-center">
                  <p className="stakepageP">My NFT Collection</p>
                </div>
              </div>

              <div className="row d-flex justify-content-center mt-3">
                {imageArray
                  .slice(initialLimit, finalLimit)
                  .map((items, index) => {
                    return (
                      <div className="col-lg-3 col-md-5 mycollections p-2 m-1">
                        <img
                          src={items.imageUrl}
                          className="myCollectionsImage "
                        />
                        {/* <span className='imageText text-white'  >&nbsp;&nbsp;{items.d}</span> */}
                        <div>
                          {/* <span className='imageText text-white'  >&nbsp;&nbsp;ID : {items.num}</span> */}
                          <p className="collectionsText mt-3">
                            ID : {items.num}
                          </p>
                          <div className="d-flex flex-row justify-content-between align-items-center mb-3">
                            <span className="collectionsTextSmall">
                              {items.names}
                            </span>
                            {/* <div className='small-boxxx d-flex justify-content-around align-items-center'>
                                                        <img src={Frame27} width="20px" />
                                                        <sapn style={{ color: "white" }}>1</sapn>
                                                    </div> */}
                          </div>
                        </div>
                        <div className="d-grid gap-2">
                          <button
                            onClick={() => clickedImage(index)}
                            className="btn btnStakePage"
                            size="lg"
                          >
                            Transfer
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="row d-flex flex-row justify-content-center justify-content-evenly">
              <div
                onClick={() => loadLess()}
                className="col-1 d-flex align-items-center justify-content-center"
                style={{ cursor: "pointer" }}
              >
                <img
                  src="https://i.ibb.co/FBMT5Lv/Rectangle-551.png"
                  style={{ position: "absolute" }}
                />
                <img
                  src="https://i.ibb.co/NjDtXXY/Vector12.png"
                  style={{ position: " relative" }}
                />
              </div>
              <div className="col-lg-3 col-md-5 col d-flex flex-row align-items-center justify-content-evenly">
                {/* <span className='MyCollectionspan'>{mywalletLength}</span> */}
                <div className="bosCollection">
                  <span className="mycollectionsP ">
                    {acc == "No Wallet" ||
                    acc == "Wrong Network" ||
                    acc == "Connect Wallet"
                      ? ""
                      : pageNumber}
                    /{totalPages}
                  </span>
                </div>
                {/* <span className='MyCollectionspan'>/{mywalletLength}</span> */}
              </div>
              {/* <button className='btn '> */}
              <div
                onClick={() => loadMore()}
                className="col-1 d-flex align-items-center justify-content-center ms-4"
                style={{ cursor: "pointer" }}
              >
                <img
                  src="https://i.ibb.co/FBMT5Lv/Rectangle-551.png"
                  style={{ position: "absolute" }}
                />
                <img
                  src="https://i.ibb.co/n1ZWTmj/Vector13.png"
                  style={{ position: " relative" }}
                />
              </div>
              {/* </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyCollection;
