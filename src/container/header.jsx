import { Button, Col, Layout, Row, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  clearWalletState,
  setAccountId,
  setPrincipalId,
} from "../redux/slice/wallet";
import logo from "../assets/icp.png";
import { useNavigate } from "react-router-dom";
import Notify from "../components/notification";
import { daoAgent } from "../components/actorCreators";
import { Principal } from "@dfinity/principal";

const Headers = () => {
  const { Header } = Layout;
  const { Text } = Typography;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduxState = useSelector((state) => state.wallet);

  const onClearState = () => {
    dispatch(clearWalletState());
  };

  const connectWallet = async () => {
    if (window?.ic.plug) {
      const daoActor = await daoAgent();
      const canisters = await daoActor.getControlledCanisters();
      const whitelist = canisters.map((canister_) => {
        const [, { canister }] = canister_;
        return Principal.from(canister).toText();
      });

      const host = "https://icp-api.io";
      const onConnectionUpdate = () => {
        const { accountId, principalId } =
          window.ic.plug.sessionManager.sessionData;
        dispatch(setAccountId(accountId));
        dispatch(setPrincipalId(principalId));
      };
      try {
        await window.ic.plug.requestConnect({
          whitelist,
          host,
          onConnectionUpdate,
          timeout: 50000,
        });

        dispatch(setAccountId(window.ic.plug.accountId));
        dispatch(setPrincipalId(window.ic.plug.principalId));
      } catch (error) {
        console.log("error", error);
      }
    } else {
      Notify("error", "Install plug wallet!");
    }
  };

  return (
    <Header>
      <Row align={"middle"} justify={"space-between"}>
        <Col>
          <img
            className="pointer logo"
            src={logo}
            alt="noimg"
            onClick={() => navigate("/")}
            width={150}
          />
        </Col>
        <Col>
          <Text className="header-title text-shadow">ICPBunny DAO</Text>
        </Col>
        <Col>
          <Button
            onClick={reduxState.principalId ? onClearState : connectWallet}
          >
            {reduxState.principalId ? "Sign out" : "Connect"}
          </Button>
        </Col>
      </Row>
    </Header>
  );
};

export default Headers;
