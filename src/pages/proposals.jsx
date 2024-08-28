import { Principal } from "@dfinity/principal";
import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { daoAgent } from "../components/actorCreators";
import Notify from "../components/notification";
import { getProposalStatus, sliceSentence } from "../utils";

const Proposals = () => {
  const { principalId } = useSelector((state) => state.wallet);
  const { daoCanisters } = useSelector((state) => state.constant);
  const navigate = useNavigate();
  const { state } = useLocation();

  const [proposals, setProposals] = useState(null);
  const [isAllowedCreate, setIsAllowedCreate] = useState(null);
  const [canister, setCanister] = useState(null);

  const [screenDimensions, setScreenDimensions] = useState({
    width: window.screen.width,
    height: window.screen.height,
  });

  const getScreenDimensions = (e) => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    setScreenDimensions({ width, height });
  };

  useEffect(() => {
    window.addEventListener("resize", getScreenDimensions);
    return () => {
      window.removeEventListener("resize", getScreenDimensions);
    };
  });

  useEffect(() => {
    (async () => {
      // if (principalId) {
      const daoActor = await daoAgent();
      try {
        const canisterQues = await daoActor.getCanisterQuestions(
          Principal.fromText(state.principal)
        );
        setProposals(canisterQues);
      } catch (error) {
        console.log("Get Canister Questions error", error);
      }
      // }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [principalId]);

  useEffect(() => {
    if (daoCanisters?.length) {
      const isUserAllowedToCreate = daoCanisters.find(
        (canister) => canister.principal === state.principal
      );
      if (isUserAllowedToCreate.tokens?.ok) {
        if (isUserAllowedToCreate.tokens?.ok.length) {
          setIsAllowedCreate(true);
          setCanister(isUserAllowedToCreate);
        } else {
          setIsAllowedCreate(false);
        }
      } else {
        setIsAllowedCreate(false);
      }
    }
  }, [daoCanisters, state.principal, principalId]);

  useEffect(() => {
    if (!principalId) {
      setIsAllowedCreate(null);
    }
  }, [principalId]);

  return (
    <>
      <Row justify={"center"} className="mt-3">
        <Col xs={22}>
          <Row
            justify={"space-between"}
            align={"middle"}
            className="login mb-3"
          >
            <Col xl={3} className="back-btn">
              <IoArrowBack onClick={() => navigate("/")} />
            </Col>
            <Col>
              <label>{state.canisterName} Proposals</label>
            </Col>
            {screenDimensions.width >= 1200 && (
              <Col>
                <label
                  onClick={() =>
                    isAllowedCreate
                      ? navigate("/proposal/create", { state: canister })
                      : Notify(
                          "info",
                          !principalId
                            ? "Connect wallet to create proposals!"
                            : isAllowedCreate === null
                            ? "Wait for a second please!"
                            : !isAllowedCreate &&
                              principalId &&
                              "You don't have voting power!"
                        )
                  }
                >
                  Create Proposal
                </label>
              </Col>
            )}
            {screenDimensions.width < 1200 && <Col />}
          </Row>
        </Col>
      </Row>

      {/* {screenDimensions.width < 1200 && screenDimensions.width > 767 && (
        <Row justify={"end"} className="create-proposal">
          <label
            onClick={() =>
              isAllowedCreate
                ? navigate("/proposal/create", { state: canister })
                : Notify(
                    "info",
                    !principalId
                      ? "Connect wallet to create proposals!"
                      : isAllowedCreate === null
                      ? "Wait for a second please!"
                      : !isAllowedCreate &&
                        principalId &&
                        "You don't have voting power!"
                  )
            }
          >
            Create Proposal
          </label>
        </Row>
      )} */}
      {screenDimensions.width < 1200 && screenDimensions.width > 767 && (
        <Row
          className="proposal-padding"
          justify={{ xl: "end", lg: "space-between", md: "space-between" }}
        >
          <Col>
            <label className="label-common mt-3 mb-2">
              🔥Voting power :{" "}
              {isAllowedCreate === null && principalId
                ? "Loading"
                : isAllowedCreate
                ? canister.tokens.ok.length
                : 0}
            </label>
          </Col>
          {screenDimensions.width < 1200 && (
            // <Col>
            //   <button
            //     class="button-71"
            //     onClick={() =>
            //       isAllowedCreate
            //         ? navigate("/proposal/create", { state: canister })
            //         : Notify(
            //             "info",
            //             !principalId
            //               ? "Connect wallet to create proposals!"
            //               : isAllowedCreate === null
            //               ? "Wait for a second please!"
            //               : !isAllowedCreate &&
            //                 principalId &&
            //                 "You don't have voting power!"
            //           )
            //     }
            //     role="button"
            //   >
            //     Create Proposal
            //     {/* {screenDimensions.width>499 ?"Create Proposal":"proposal"} */}
            //   </button>
            // </Col>

            <label
              onClick={() =>
                isAllowedCreate
                  ? navigate("/proposal/create", { state: canister })
                  : Notify(
                      "info",
                      !principalId
                        ? "Connect wallet to create proposals!"
                        : isAllowedCreate === null
                        ? "Wait for a second please!"
                        : !isAllowedCreate &&
                          principalId &&
                          "You don't have voting power!"
                    )
              }
              className={`create-proposal mt-2 mb-4`}
            >
              Create Proposal
            </label>
          )}
        </Row>
      )}
      {screenDimensions.width < 767 && (
        <>
          <Row justify={"center"}>
            <label className="label-common mt-3 mb-2">
              🔥Voting power :{" "}
              {isAllowedCreate === null && principalId
                ? "Loading"
                : isAllowedCreate
                ? canister.tokens.ok.length
                : 0}
            </label>
          </Row>
          <Row justify={"center"}>
            <label
              onClick={() =>
                isAllowedCreate
                  ? navigate("/proposal/create", { state: canister })
                  : Notify(
                      "info",
                      !principalId
                        ? "Connect wallet to create proposals!"
                        : isAllowedCreate === null
                        ? "Wait for a second please!"
                        : !isAllowedCreate &&
                          principalId &&
                          "You don't have voting power!"
                    )
              }
              className={`create-proposal mt-2 mb-4`}
            >
              Create Proposal
            </label>
          </Row>
        </>
      )}

      {proposals === null ? (
        <span
          className="time-sub-text row justify-content-center mb-5"
          style={{ minHeight: "350px" }}
        >
          Loading...
        </span>
      ) : proposals.length === 0 ? (
        <span
          className="time-sub-text row justify-content-center mb-5"
          style={{ minHeight: "350px" }}
        >
          No Proposals found!
        </span>
      ) : (
        <Row className="mb-5" justify={"center"} style={{ minHeight: "350px" }}>
          <Col sm={22} xs={24}>
            {proposals.map((que, index) => {
              const no = index + 1;
              const currentTime = Date.now();
              const startTime = que.startTime;
              const endTime = que.endTime;

              return (
                <Row className="mb-4" key={`${que.title}-${no}`}>
                  <Col xs={24}>
                    <div className="question-card">
                      <div className="row justify-content-between align-items-center">
                        <span className="title col-lg">
                          <span className="que-no me-3">#{no}</span>
                          {sliceSentence(que.title)}{" "}
                          <span className="badge text-bg-secondary">
                            {getProposalStatus(startTime, endTime, currentTime)}
                          </span>
                        </span>
                        <span className="goto-proposal col-lg-2">
                          <Link
                            to={`/proposal/${que.status[0].questionID}`}
                            aria-current="page"
                          >
                            <div className="row justify-content-end me-2">
                              view
                            </div>
                          </Link>
                        </span>
                      </div>
                    </div>
                  </Col>
                </Row>
              );
            })}
          </Col>
        </Row>
      )}
    </>
  );
};

export default Proposals;
