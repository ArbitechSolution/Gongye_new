import React, { useEffect, useState } from "react";
import image1 from "./media/Vector3.png";
import containerImage from "./media/Group 48.png";
import light from "./media/light-from-top-background.png";
import "./MintModal.css";
import { useTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import { connectionAction } from "./Redux/connection/actions";

export default function MyMintCollection(props) {
  console.log("mintarray in modal", props.mintArray);
  const [modalShow, setMintModalShow] = useState(true);
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  let acc = useSelector((state) => state.connect?.connection);
  const onConnectAccount = () => {
    dispatch(connectionAction());
  };
  return (
    <Modal
      show={modalShow}
      onHide={() => setMintModalShow(false)}
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
            <span className="imgArea-text">Mint</span>
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
                      ? "Connect"
                      : acc === "Connect Wallet"
                      ? "Connect"
                      : acc === "Wrong Network"
                      ? acc
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
                    <span className="textCongrts">Congratulations</span>
                  </div>
                  <div className="col-12 mintCol mt-4">
                    <span className="heading">
                      You got a Crazy Goongye card now !
                    </span>
                  </div>
                  {props?.mintArray.length == 1 ? (
                    <div className=" d-flex flex-column justify-content-center mb-3 mt-3">
                      {props?.mintArray.map((item, index) => {
                        return (
                          <div>
                            <div className="col-12 mintCol mt-4" key={index}>
                              <img
                                className=" pt-4 pb-3"
                                width="240px"
                                src={`${item.imageUrl}`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="row d-flex flex-row justify-content-center justify-content-evenly mt-4 mb-3">
                      {props?.mintArray.map((item, index) => {
                        return (
                          <div className="mintImages">
                            <div
                              className="col-lg-4 col-md-4 col-sm-12 mintCol mt-4"
                              key={index}
                            >
                              <img
                                className=" pt-4 pb-3"
                                width="240px"
                                src={`${item.imageUrl}`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className="col-12 mintCol mt-5 mb-5">
                    <button
                      className="btnStaking mt-2 me-2"
                      onClick={() => setMintModalShow(false)}
                    >
                      Staking
                    </button>
                    <button
                      className="btnLater mt-2"
                      onClick={() => setMintModalShow(false)}
                    >
                      Do it Later
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
