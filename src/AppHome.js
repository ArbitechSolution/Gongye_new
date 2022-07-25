import react, { useState } from "react";
import Appstake from "./Appstake";
import Home from "./Home";
import AppPresale from "./Presales/Presales";
import Footer from "./Staking/footer";
import NavbarStaking from "./Staking/navbar";

const AppHome = () => {
  let [changeRouteis, setChangeRouteIs] = useState("main");
  const changeMain = () => {
    setChangeRouteIs("main");
  };
  const changeStake = () => {
    setChangeRouteIs("Stake");
  };
  const changePresale = () => {
    setChangeRouteIs("Presale");
  };

  const Main = () => {
    return (
      <div>
        <Home
          changeMain={changeMain}
          changeStake={changeStake}
          changePresale={changePresale}
        />
      </div>
    );
  };

  const Stakeing = () => {
    return (
      <div>
        <NavbarStaking
          changeMain={changeMain}
          changeStake={changeStake}
          changePresale={changePresale}
        ></NavbarStaking>
        <Appstake />
        <Footer />
      </div>
    );
  };
  const Presale = () => {
    return (
      <div>
        <NavbarStaking
          changeMain={changeMain}
          changeStake={changeStake}
          changePresale={changePresale}
        ></NavbarStaking>
        <AppPresale changeStake={changeStake} />
        <Footer />
      </div>
    );
  };
  if (changeRouteis == "main") {
    return (
      <div className="App">
        <Main />
      </div>
    );
  } else if (changeRouteis == "Stake") {
    return (
      <div className="App">
        <Stakeing />
      </div>
    );
  } else if (changeRouteis == "Presale") {
    return (
      <div className="App">
        <Presale />
      </div>
    );
  }
  else {
    return <></>;
  }
};
export default AppHome;
