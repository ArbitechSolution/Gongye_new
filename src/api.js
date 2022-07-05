import Caver from "caver-js";
let isItConnected = false;
const caver = new Caver(window.klaytn);
let accounts;
const getAccounts = async () => {
  const { klaytn } = window;
  try {
    // accounts = await klaytn.selectedAddress;
    accounts = await caver.klay.getAccounts();
    return accounts[0];
  } catch (error) {
    console.log("Error while fetching acounts: ", error);
    return null;
  }
};

export const loadWeb3 = async () => {
  try {
    const { klaytn } = window;
    if (klaytn) {
      await klaytn.enable();
      let netId = await klaytn.networkVersion;
      switch (netId.toString()) {
        case "8217": //mainnet 8217 ,testnet 1001
          isItConnected = true;
          break;
        default:
          isItConnected = false;
      }
      if (isItConnected == true) {
        let accounts = await getAccounts();
        return accounts;
      } else {
        let res = "Wrong Network";
        return res;
      }
    } else {
      let res = "No Wallet";
      return res;
    }
  } catch (error) {
    let res = "No Wallet";
    return res;
  }
};
