import { Col, Flex, Row } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sliceAddress } from "../utils";

const Governance = () => {
  const { canisters } = useSelector((state) => state.constant);
  const navigate = useNavigate();

  return (
    <div className="container-fluid ">
      <div>
        <Row>
          <div className="login">
            <Row justify={"center"} align={"middle"} className="login mb-4">
              <Col>
                <label>Governance</label>
              </Col>
            </Row>

            <Flex
              className="goverenceGap"
              wrap={"wrap"}
              justify={canisters === null ? "center" : "start"}
            >
              {canisters === null ? (
                <Row>
                  <span className="time-sub-text mb-3">Loading...</span>
                </Row>
              ) : (
                canisters?.map((canister, index) => {
                  return (
                    <Col
                      className="card-ori mb-4"
                      key={`${canister.canisterName}-${index}`}
                      onClick={() => {
                        navigate(`/proposals`, {
                          state: canister,
                        });
                      }}
                    >
                      <p className="time-text">
                        <span>{sliceAddress(canister.principal)}</span>
                      </p>
                      <Row justify={"space-between"}>
                        <Col md={14}>
                          <label className={`day-text active-color`}>
                            {canister.canisterName}
                          </label>
                        </Col>
                        <Col md={6}>
                          <label className={`day-text active-color`}>
                            {canister.counts}
                          </label>
                        </Col>
                      </Row>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill={canister.counts ? "green" : "grey"}
                        className="bi bi-patch-check-fill moon"
                        viewBox="0 0 16 16"
                      >
                        <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708" />
                      </svg>
                    </Col>
                  );
                })
              )}
            </Flex>
          </div>
        </Row>
      </div>
    </div>
  );
};

export default Governance;
