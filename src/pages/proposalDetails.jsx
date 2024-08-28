import { Principal } from "@dfinity/principal";
import { Col, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import { GrSend } from "react-icons/gr";
import { IoArrowBack } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { daoAgent } from "../components/actorCreators";
import { getProposalStatus, sliceAddress } from "../utils";

const ProposalDetails = () => {
  const { Text } = Typography;
  const { principalId } = useSelector((state) => state.wallet);
  const { daoCanisters } = useSelector((state) => state.constant);
  const navigate = useNavigate();
  const { queId } = useParams();

  const [proposal, setProposal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [radio, setRadio] = useState(null);
  const [votes, setVotes] = useState(null);
  const [proposalStatus, setProposalStatus] = useState(null);
  const [voteCounts, setVoteCounts] = useState(null);
  const [totalVoteCounts, setTotalVoteCounts] = useState(null);
  const [isUserVoted, setIsUserVoted] = useState(null);
  const [userTokens, setUserTokens] = useState(null);

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

  const barColors = [
    "bg-primary",
    "bg-secondary",
    "bg-success",
    "bg-danger",
    "bg-warning",
    "bg-info",
    "bg-light",
    "bg-dark",
    "bg-white",
    "bg-paleGreen",
  ];

  const getVotes = async (queId) => {
    const daoActor = await daoAgent();
    const votes = await daoActor.getVotes(queId);
    setVotes(votes);
  };

  const getVotedDetails = async (queId) => {
    const daoActor = await daoAgent();
    const details = await daoActor.isUserVoted(queId);
    setIsUserVoted(details);
  };

  const handleAddVote = async () => {
    setIsLoading(true);
    try {
      const args_ = {
        voter: Principal.fromText(principalId),
        storageCanister: Principal.fromText("putek-zaaaa-aaaam-acfma-cai"),
        canister: proposal.canister,
        questionID: proposal.questionID,
      };
      const daoActor = await daoAgent();

      await daoActor.addVotes(5871, args_, radio, userTokens.length);

      await getVotes(proposal.questionID);
      await getVotedDetails(args_);
    } catch (error) {
      console.log("Add vote error", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (votes !== null && votes.length > 0) {
      let total = 0;
      const votesCount = proposal.options.map((option) => {
        let counter = 0;
        votes.forEach((vote) => {
          if (option === vote.option) {
            counter = Number(vote.votes);
          }
        });
        total += counter;
        return { [option]: counter };
      });
      setTotalVoteCounts(total);
      setVoteCounts(votesCount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [votes, principalId]);

  useEffect(() => {
    if (daoCanisters !== null && proposal?.canister) {
      const principal = Principal.from(proposal.canister).toText();
      const details = daoCanisters.find(
        (canister) => canister.principal === principal
      );

      if (details.tokens.ok) {
        setUserTokens(details.tokens.ok);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daoCanisters, proposal, principalId]);

  useEffect(() => {
    (async () => {
      // if (principalId) {
      const daoActor = await daoAgent();
      try {
        const proposal = await daoActor.getQuestion(Number(queId));
        setProposal(proposal);

        await getVotes(proposal.questionID);
        await getVotedDetails({
          voter: Principal.fromText(principalId),
          storageCanister: Principal.fromText("putek-zaaaa-aaaam-acfma-cai"),
          canister: proposal.canister,
          questionID: proposal.questionID,
        });
      } catch (error) {
        console.log("Get Canister Questions error", error);
      }
      // }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [principalId]);

  useEffect(() => {
    if (proposal?.startTime) {
      const status = getProposalStatus(
        proposal.startTime,
        proposal.endTime,
        Date.now()
      );
      setProposalStatus(status);
    }
  }, [proposal]);

  return (
    <>
      <Row justify={"center"}>
        <Col xs={22}>
          <Row
            justify={principalId ? "space-between" : "start"}
            align={"middle"}
            className="login mb-4"
          >
            <Col
              xl={5}
              // xs={5}
            >
              <IoArrowBack className="back-btn" onClick={() => navigate(-1)} />
            </Col>
            <Col
            //  xs={principalId ? 8 : 14}
            >
              <label>Proposal Details</label>
            </Col>
            {screenDimensions.width > 1199 ? (
              principalId && (
                <Col>
                  <label>
                    🔥Voting power :{" "}
                    {userTokens === null ? "Loading" : userTokens.length}
                  </label>
                </Col>
              )
            ) : (
              <Col />
            )}
          </Row>
        </Col>
      </Row>
      {screenDimensions.width < 1200 && (
        <Row justify={"center"} className="mb-3">
          {principalId && (
            <Col>
              <label className="proposal-detail-text">
                🔥Voting power :{" "}
                {userTokens === null ? "Loading" : userTokens.length}
              </label>
            </Col>
          )}
        </Row>
      )}

      {proposal === null ? (
        <span className="time-sub-text row justify-content-center mb-5">
          Loading...
        </span>
      ) : proposal.length === 0 ? (
        <span className="time-sub-text row justify-content-center mb-5">
          No Proposals found!
        </span>
      ) : (
        <Row className="mb-5" justify={"center"}>
          <Col md={22}>
            <div className="main-wrap">
              <div className="wrapper mb-3">
                <span className="title ">{proposal.title}</span>
                <div className="mt-15">
                  <span className="success">{proposalStatus}</span>
                  <span className="grey font-size-17 ms-2">
                    {new Date(
                      Number(proposal.status[0].timestamp) / 1000000
                    ).toString()}
                  </span>
                </div>
                <div className="mt-30 white font-size-17">
                  {proposal.question}
                </div>
                {principalId ? (
                  userTokens === null ||
                  isUserVoted === null ||
                  proposalStatus === null ? (
                    <span className="time-sub-text row justify-content-center mt-4">
                      Loading...
                    </span>
                  ) : userTokens.length > 0 &&
                    !isUserVoted &&
                    proposalStatus === "VOTING" ? (
                    <div className="mt-15 radio-wrapper">
                      <div className="white font-size-20">Options</div>
                      <form
                        className="row radio-container"
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (radio) {
                            handleAddVote();
                          } else {
                            alert("Options can't empty!");
                          }
                        }}
                        style={{ width: "auto" }}
                      >
                        {proposal.options.map((opt) => {
                          return (
                            <>
                              <label
                                className="mt-2 row-cols-2"
                                style={{ width: "auto" }}
                              >
                                <input
                                  type="radio"
                                  onChange={() => setRadio(opt)}
                                  name="option"
                                />
                                <span>
                                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                </span>
                              </label>
                            </>
                          );
                        })}

                        {isLoading ? (
                          <span className="time-sub-text row justify-content-center mt-2">
                            Processing your vote...
                          </span>
                        ) : (
                          <button
                            className="btn-submit mt-2"
                            style={{
                              marginBottom: "0px",
                            }}
                            type="submit"
                          >
                            Cast your vote
                          </button>
                        )}
                      </form>
                    </div>
                  ) : proposalStatus === "SUCCESS" ? (
                    <span className="time-sub-text row justify-content-center mt-4">
                      Proposal has ended!
                    </span>
                  ) : proposalStatus === "CREATED" ? (
                    <span className="time-sub-text row justify-content-center mt-4">
                      Wait until voting starts!
                    </span>
                  ) : isUserVoted && userTokens.length ? (
                    <span className="time-sub-text row justify-content-center mt-4">
                      Your vote is successfully registered!
                    </span>
                  ) : (
                    <span className="time-sub-text row justify-content-center mt-4">
                      You are not allowed to poll!
                    </span>
                  )
                ) : (
                  <Text className="time-sub-text row justify-content-center mt-4">
                    Please connect your wallet to vote!
                  </Text>
                )}

                <div className="mt-15 row font-size-17">
                  <span
                  // className="col-lg-2"
                  >
                    <a
                      href={proposal.discussionLink}
                      className="redirect-link"
                      target="_blank"
                      aria-current="page"
                      rel="noreferrer"
                    >
                      View discussion <GrSend size={20} />
                    </a>
                  </span>
                </div>
              </div>

              <div className="col-lg-12 row justify-content-between">
                <div className="details-container col-lg-4">
                  <div className="white font-size-20">Details</div>
                  <div className="row justify-content-between mt-15">
                    <div className="col-lg-4">
                      <div className="white">Created by</div>
                    </div>
                    <div className="col-lg-8">
                      <div className="grey">
                        :{" "}
                        {sliceAddress(
                          Principal.from(proposal.creator).toText()
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row justify-content-between mt-15">
                    <div className="col-lg-4">
                      <div className="white">Success ratio</div>
                    </div>
                    <div className="col-lg-8">
                      <div className="grey">
                        : {Number(proposal.successRatio)} %
                      </div>
                    </div>
                  </div>
                  <div className="row justify-content-between mt-15">
                    <div className="col-lg-4">
                      <div className="white">Start</div>
                    </div>
                    <div className="col-lg-8">
                      <div className="grey">
                        : {new Date(Number(proposal.startTime)).toUTCString()}
                      </div>
                    </div>
                  </div>
                  <div className="row justify-content-between mt-15">
                    <div className="col-lg-4">
                      <div className="white">End</div>
                    </div>
                    <div className="col-lg-8">
                      <div className="grey">
                        : {new Date(Number(proposal.endTime)).toUTCString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="details-container col-lg-5">
                  {principalId ? (
                    voteCounts === null || userTokens === null ? (
                      <span className="time-sub-text row justify-content-center mb-5">
                        Loading...
                      </span>
                    ) : userTokens.length === 0 ? (
                      <span className="time-sub-text row justify-content-center mb-5">
                        Sorry!, You are not allowed to poll.
                      </span>
                    ) : proposalStatus !== "CREATED" ? (
                      <>
                        <div className="white font-size-20">
                          Current results
                        </div>
                        <div className="mt-15">
                          <div className="progress">
                            {voteCounts.map((opt, index) => {
                              const [, count] = Object.entries(opt)[0];
                              const percentage =
                                (count / totalVoteCounts) * 100;
                              return (
                                <div
                                  key={`vote-counts-${percentage}-${count}`}
                                  className={`progress-bar ${barColors[index]}`}
                                  role="progressbar"
                                  style={{ width: `${percentage}%` }}
                                  aria-valuenow={percentage}
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                ></div>
                              );
                            })}
                          </div>
                        </div>
                        <div className="row justify-content-between mt-15">
                          <div className="col-lg-6">
                            <div className="white">Total votes</div>
                            <div className="grey">
                              {totalVoteCounts !== null ? totalVoteCounts : 0}
                            </div>
                          </div>
                        </div>

                        <div className="row justify-content-between mt-15">
                          {voteCounts.map((opt, index) => {
                            const [option, count] = Object.entries(opt)[0];
                            const percentage = (count / totalVoteCounts) * 100;
                            return (
                              <>
                                <div className="white font-size-17 col-lg-6 row align-items-center justify-content-between">
                                  <div
                                    className={`dotted col-lg-1 ${
                                      percentage ? barColors[index] : ""
                                    }`}
                                  ></div>{" "}
                                  <span className="col-lg-10"> {option}</span>{" "}
                                </div>
                                <div className="grey font-size-17 col-lg-5">
                                  {percentage ? percentage.toFixed(2) : 0} %{" "}
                                  {`(${count})`}
                                </div>
                              </>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <span className="time-sub-text row justify-content-center mb-5">
                        Wait until voting starts!
                      </span>
                    )
                  ) : (
                    <Text className="time-sub-text row justify-content-center">
                      Please connect your wallet to vote!
                    </Text>
                  )}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ProposalDetails;
