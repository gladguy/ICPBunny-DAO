import { Principal } from "@dfinity/principal";
import { Breadcrumb, Col, Layout, Row, theme } from "antd";
import { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { tokensFactory } from "./IDL";
import { bunnyAgent, carrotAgent, daoAgent } from "./components/actorCreators";
import Footers from "./container/footer";
import Headers from "./container/header";
import { setCanisters, setDaoCanisters } from "./redux/slice/constant";
import { routes } from "./routes/routes";
import { sliceAddress } from "./utils";

const App = () => {
  const { Content, Footer } = Layout;
  const { principalId, accountId } = useSelector((state) => state.wallet);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { pathname } = useLocation();

  const [carrotCount, setCarrotCount] = useState(0);
  const [userCarrotCount, setUserCarrotCount] = useState(0);

  const getCanisterData = async () => {
    try {
      const daoActor = await daoAgent();
      const canisters = await daoActor.getCanisters();
      const questions = await daoActor.getQuestions();

      const revealedCanisters = canisters.map((canister) => {
        const [, principal] = canister;
        const canisterId = Principal.from(principal.canister).toText();

        const filterCanister = questions.filter((data) => {
          const questionCanister = Principal.from(data[1].canister).toText();

          if (questionCanister === canisterId) {
            return data;
          }
        });

        return {
          canisterName: principal.canisterName,
          principal: canisterId,
          counts: filterCanister.length,
        };
      });
      return revealedCanisters;
    } catch (error) {
      console.log("DAO getCanister error", error);
    }
  };

  const getBurntCarrots = async () => {
    const carrotActor = await carrotAgent();
    const counts = await carrotActor.balance_of(Principal.fromText("aaaaa-aa"));
    setCarrotCount(Number(counts) / 100000000);
  };

  const getUserCarrots = async () => {
    const carrotActor = await carrotAgent();
    const counts = await carrotActor.balance_of(
      Principal.fromText(principalId)
    );
    setUserCarrotCount(Number(counts) / 100000000);
  };

  useEffect(() => {
    (async () => {
      try {
        await getBurntCarrots();
      } catch (error) {
        console.log("Carrot Counts error", error);
      }
    })();
  }, [principalId]);

  useEffect(() => {
    (async () => {
      if (principalId) {
        await getUserCarrots();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [principalId]);

  useEffect(() => {
    (async () => {
      const canisters = await getCanisterData();
      dispatch(setCanisters(canisters));
      try {
        if (principalId) {
          const promises = canisters.map(async (canister) => {
            const actor = await window?.ic.plug.createActor({
              canisterId: canister.principal,
              interfaceFactory: tokensFactory,
            });
            return new Promise((res) => {
              res({ ...canister, fn: actor.tokens });
            });
          });
          const actors = await Promise.all(promises);
          const bunnyActor = await bunnyAgent();
          const bunnyTokens = await bunnyActor.user_tokens(
            Principal.fromText(principalId)
          );

          if (accountId) {
            const getTokens = actors.map(({ fn, ...canister }) => {
              if (canister.canisterName !== "ICPBunny") {
                return new Promise(async (res) => {
                  const tokens = await fn(accountId);
                  res({
                    ...canister,
                    tokens,
                  });
                });
              } else {
                return {
                  ...canister,
                  tokens: { ok: bunnyTokens },
                };
              }
            });

            const allData = await Promise.all(getTokens);
            dispatch(setDaoCanisters(allData));
          }
        }
      } catch (error) {
        console.log("canister tokens error", error);
      }
    })();
  }, [accountId, dispatch, principalId]);

  return (
    <Layout>
      <Headers />
      <Content
        style={{
          padding: "0 48px",
          minHeight: "79.6vh",
        }}
      >
        <Row justify={"space-between"} align={"middle"}>
          <Col>
            <Breadcrumb
              style={{
                margin: "16px 0",
              }}
            >
              {pathname === "/" ? (
                <Breadcrumb.Item>Governance</Breadcrumb.Item>
              ) : pathname === "/proposals" ? (
                <>
                  <Breadcrumb.Item href="/">Governance</Breadcrumb.Item>
                  <Breadcrumb.Item>Proposals</Breadcrumb.Item>
                  {/* <Breadcrumb.Item>App</Breadcrumb.Item> */}
                </>
              ) : pathname === "/proposal/create" ? (
                <>
                  <Breadcrumb.Item href="/">Governance</Breadcrumb.Item>
                  <Breadcrumb.Item
                    className="decor-underline pointer ant-breadcrumb"
                    onClick={() => navigate(-1)}
                  >
                    Proposals
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>Create Proposal</Breadcrumb.Item>
                </>
              ) : pathname === "/cycles" ? (
                <>
                  <Breadcrumb.Item href="/">Governance</Breadcrumb.Item>
                  <Breadcrumb.Item>cycles</Breadcrumb.Item>
                </>
              ) : (
                <>
                  <Breadcrumb.Item href="/">Governance</Breadcrumb.Item>
                  <Breadcrumb.Item
                    className="decor-underline pointer ant-breadcrumb"
                    onClick={() => navigate(-1)}
                  >
                    Proposals
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>Proposal Details</Breadcrumb.Item>
                </>
              )}
            </Breadcrumb>
          </Col>
          {principalId && (
            <Col>Your $Carrot balance : {parseInt(userCarrotCount)}🥕</Col>
          )}
          {principalId && <Col>Principal : {sliceAddress(principalId)}</Col>}
          <Col>Burnt🔥 : {parseInt(carrotCount)}🥕</Col>
        </Row>
        <div
          style={{
            // background: colorBgContainer,
            padding: 24,
            // borderRadius: borderRadiusLG,
          }}
          className="main"
        >
          <Routes>
            {routes.map((route, index) => {
              let Component = route.component;
              return (
                <Route
                  key={`route-${index}`}
                  path={route.path}
                  element={
                    <Suspense fallback={"Loading"}>
                      <Component
                        userCarrotCount={userCarrotCount}
                        getBurntCarrots={getBurntCarrots}
                        getUserCarrots={getUserCarrots}
                      />
                    </Suspense>
                  }
                />
              );
            })}
          </Routes>
          {/* <Contents /> */}
        </div>

        {pathname === "/" && (
          <Row justify={"end"} className="mb-4">
            <button
              className="button-62"
              role="button"
              onClick={() => navigate("/cycles")}
            >
              Cycles
            </button>
          </Row>
        )}
      </Content>
      <Footer
        style={{
          textAlign: "center",
          background: colorBgContainer,
        }}
      >
        <Footers />
      </Footer>
    </Layout>
  );
};
export default App;
