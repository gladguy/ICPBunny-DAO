import { Principal } from "@dfinity/principal";
import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import { GoPlusCircle } from "react-icons/go";
import { IoArrowBack } from "react-icons/io5";
import { LuMinus } from "react-icons/lu";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { carrotAgent, daoAgent } from "../components/actorCreators";
import Notify from "../components/notification";

const CreateProposal = ({
  userCarrotCount,
  getBurntCarrots,
  getUserCarrots,
}) => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [data, setData] = useState({
    successRatio: "1",
    startTime: "",
    endTime: "",
    startDate: "",
    endDate: "",
  });
  const [dynamicInputs, setDynamicInputs] = useState([Date.now(), Date.now()]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const getMeridian = (value) => {
    var timeSplit = value.split(":"),
      hours,
      minutes,
      meridian;
    hours = timeSplit[0];
    minutes = timeSplit[1];
    if (hours > 12) {
      meridian = "PM";
      hours -= 12;
    } else if (hours < 12) {
      meridian = "AM";
      if (hours == 0) {
        hours = 12;
      }
    } else {
      meridian = "PM";
    }
    return `${hours}:${minutes} ${meridian}`;
  };

  const getUnixTimeStamp = (dates, time) => {
    // Replace "2024-03-20T12:00:00" with your desired date/time
    const date = new Date(dates + "T" + time + ":00");
    const unixTimestampMilliseconds = date.getTime();

    return unixTimestampMilliseconds;
  };

  const getSuccessRatio = (key) => {
    switch (key) {
      case "1":
        return 20;

      case "2":
        return 40;

      case "3":
        return 60;

      case "4":
        return 80;

      case "5":
        return 100;

      default:
        return 20;
    }
  };

  const handleAddQuestion = async () => {
    let {
      discussionLink,
      endDate,
      endTime,
      question,
      startDate,
      startTime,
      successRatio,
      title,
    } = data;

    let options = [];
    Object.entries(data).forEach((data) => {
      let time;
      let unixTimeStamp;

      if (data[0].includes("option")) {
        options.push(data[1]);
      }
      if (data[0].includes("startTime")) {
        time = getMeridian(data[1]);
        unixTimeStamp = getUnixTimeStamp(startDate, startTime);
        startTime = unixTimeStamp;
      }
      if (data[0].includes("endTime")) {
        time = getMeridian(data[1]);
        unixTimeStamp = getUnixTimeStamp(endDate, endTime);
        endTime = unixTimeStamp;
      }
    });

    successRatio = getSuccessRatio(successRatio);
    const args = {
      successRatio,
      title,
      question,
      endTime,
      discussionLink,
      createdTime: Date.now(),
      startTime,
      canister: Principal.fromText(state.principal),
      options,
    };

    try {
      const daoActor = await daoAgent();
      const result = await daoActor.addQuestion(5871, args);
      if (result) {
        return true;
      }
      return false;
    } catch (error) {
      console.log("Add question error", error);
      return false;
    }
  };

  useEffect(() => {
    document.getElementById("start_date").setAttribute("max", data.endDate);
    document.getElementById("end_date").setAttribute("min", data.startDate);
  }, [data]);

  useEffect(() => {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    var hour = today.getHours();
    var minute = today.getMinutes();

    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    if (minute < 10) {
      minute = "0" + minute;
    }
    if (hour < 10) {
      hour = "0" + hour;
    }
    var endDd = dd + 1;
    today = yyyy + "-" + mm + "-" + dd;
    let endDate = yyyy + "-" + mm + "-" + endDd;

    let startTime = hour + ":" + minute;
    document.getElementById("start_date").setAttribute("min", today);
    document.getElementById("end_date").setAttribute("min", endDate);
    setData({
      ...data,
      startTime: startTime,
      endTime: startTime,
      startDate: today,
      endDate: endDate,
    });
  }, []);

  return (
    <>
      <Row justify={"center"} className="mb-5 mt-3">
        <Col sm={23}>
          <Row justify={"start"} align={"middle"} className="login">
            <Col sm={2} className="back-btn">
              <IoArrowBack onClick={() => navigate(-1)} />
            </Col>
            <Col sm={20}>
              <label>Create Proposal for {state?.canisterName}</label>
            </Col>
          </Row>
        </Col>
      </Row>

      <div>
        <div className="register">
          <form
            className="form row mt-5"
            id="proposal-form"
            onSubmit={(e) => {
              e.preventDefault();
              (async () => {
                if (state.principal) {
                  setIsSubmitting(true);
                  if (userCarrotCount > 5000) {
                    const carrortActor = await carrotAgent(true);
                    const transferResult = await carrortActor.walletTransfer(
                      5000 * 100000000,
                      "aaaaa-aa"
                    );
                    await getBurntCarrots();
                    await getUserCarrots();
                    if (transferResult) {
                      const addResult = await handleAddQuestion();
                      if (addResult) {
                        Notify("success", "Proposal submitted!");
                        document.getElementById("proposal-form").reset();
                        setDynamicInputs([Date.now(), Date.now()]);
                        navigate(-1);
                      } else {
                        Notify("error", "Proposal sending failed!");
                      }
                    } else {
                      Notify("error", "Carrots transfer failed!");
                    }
                  } else {
                    Notify("warning", "Not enough carrots to create proposal!");
                  }
                  setIsSubmitting(false);
                } else {
                  alert("error", "You can't cheat!!");
                }
              })();
            }}
          >
            <input
              className="input mb-2"
              type="text"
              maxLength={100}
              name="title"
              placeholder="Title"
              required
              onChange={handleChange}
            />
            <textarea
              rows={"4"}
              className="input mt-4"
              maxLength="200"
              type="textarea"
              name="question"
              placeholder="Question"
              onChange={handleChange}
              required
            />

            {/* <div className="row justify-content-between"> */}
            {/* <span className="form-label col-md-5 ">Start date</span> */}
            {/* <span className="form-label col-md-5">End date</span> */}
            {/* </div> */}
            <div className="row justify-content-between">
              <div className="col-md-5 col-sm-12 mt-4">
                <div className="form-label ">Start date</div>
                <input
                  defaultValue={data.startDate}
                  className="input col-md-12 col-sm-12"
                  type="date"
                  name="startDate"
                  id="start_date"
                  onChange={handleChange}
                  placeholder="Start time"
                  required
                />
              </div>
              <div className="col-md-5 col-sm-12 mt-4">
                <div className="form-label ">End date</div>

                <input
                  defaultValue={data.endDate}
                  className="input col-md-12 col-sm-12"
                  type="date"
                  name="endDate"
                  id="end_date"
                  onChange={handleChange}
                  placeholder="End time"
                  required
                />
              </div>
            </div>

            {/* <div className="row justify-content-between">
              <span className="form-label col-md-5">Start time</span>
              <span className="form-label col-md-5">End time</span>
            </div> */}
            <div className="row justify-content-between mb-3">
              <div className="col-md-5 col-sm-12 mt-4">
                <div>
                  <span className="form-label">Start time</span>
                </div>
                <input
                  defaultValue={data.startTime}
                  className="input col-md-12 col-sm-12 "
                  type="time"
                  name="startTime"
                  onChange={handleChange}
                  placeholder="Start time"
                  required
                />
              </div>
              <div className=" col-md-5 col-sm-12 mt-4">
                <div>
                  <span className="form-label">End time</span>
                </div>
                <input
                  defaultValue={data.endTime}
                  className="input col-md-12 col-sm-12 "
                  type="time"
                  name="endTime"
                  onChange={handleChange}
                  placeholder="End time"
                  required
                />
              </div>
            </div>

            <input
              className="input mt-4"
              type="text"
              name="discussionLink"
              onChange={handleChange}
              placeholder="Discussion link"
              required
            />
            <span className="form-label mt-4">Success ratio</span>
            <input
              type="range"
              name="successRatio"
              required
              onChange={handleChange}
              value={data.successRatio}
              className="form-range"
              step="1"
              min="1"
              max="5"
            />
            <div className="success-ratio" id="success-ratio">
              <span>20%</span>
              <span>40%</span>
              <span>60%</span>
              <span>80%</span>
              <span>100%</span>
            </div>
            <Row justify={"space-between"}>
              <span className="form-label mt-4">Options</span>
              <GoPlusCircle
                size={25}
                className="pointer"
                onClick={() => {
                  if (dynamicInputs.length < 10)
                    setDynamicInputs([...dynamicInputs, Date.now()]);
                }}
              />
            </Row>
            <div id="options-input">
              {dynamicInputs.map((id, index) => {
                const no = index + 1;
                return (
                  <div
                    className="row justify-content-between align-items-center mb-4"
                    key={`${id}`}
                  >
                    <div className="input-group col-lg-12 input">
                      <input
                        className="form-control"
                        type="text"
                        name={`option-${no}`}
                        placeholder={`Option - ${no}`}
                        onChange={handleChange}
                        required
                      />
                      {no > 2 && (
                        <div className="input-group-append">
                          <span className="input-group-text">
                            <LuMinus
                              size={20}
                              className="pointer"
                              onClick={() => {
                                if (no !== 1 && no !== 2) {
                                  const filter = dynamicInputs.filter(
                                    (input) => input !== id
                                  );
                                  setDynamicInputs(filter);
                                }
                              }}
                            />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {userCarrotCount < 5000 ? (
              <span className="time-sub-text bg-dark row justify-content-center mb-5">
                You need 5K carrots 🥕 to create proposal
              </span>
            ) : isSubmitting ? (
              <span className="time-sub-text bg-dark row justify-content-center mb-5">
                Sending proposal...
              </span>
            ) : (
              <button type="submit">{"🔥 5k 🥕 & create proposal"}</button>
            )}
          </form>
        </div>
      </div>

      {/* {proposals === null ? (
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
          <Col md={22}>
            {proposals.map((que, index) => {
              const no = index + 1;
              return (
                <Row className="mb-4" key={`${que.title}-${no}`}>
                  <Col md={24}>
                    <div className="question-card">
                      <div className="row justify-content-between align-items-center">
                        <span className="title col-lg">
                          <span className="que-no me-3">#{no}</span>
                          {sliceSentence(que.title)}{" "}
                          <span className="badge text-bg-secondary">
                            {que.status[0].status}
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
      )} */}
    </>
  );
};

export default CreateProposal;
