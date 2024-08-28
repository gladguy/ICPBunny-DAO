import { Principal } from "@dfinity/principal";
import {
  Button,
  Col,
  Flex,
  Input,
  Modal,
  Popconfirm,
  Row,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cyclesFactory, daoFactory } from "../IDL";
import { agentCreator, daoAgent } from "../components/actorCreators";
import Notify from "../components/notification";
import {
  daoCanisterId,
  foundaryId,
  getProposalStatus,
  liquidifyCanisterId,
  principals,
  sliceAddress,
} from "../utils";
import { useSelector } from "react-redux";
import { liquidifyIdlFactory } from "../liquidify_IDL";

const Cycles = () => {
  const { Text } = Typography;
  const { principalId } = useSelector((state) => state.wallet);
  const token = "ICP54iv!@";
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isSubmitting, setSubmitting] = useState(false);
  const [inputToken, setInputToken] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [tableData, setTableData] = useState(null);
  const [filterCanister, setFilterCanister] = useState(null);
  const [questionTableData, setQuestionTableData] = useState(null);
  const [questions, setQuestions] = useState(null);

  const [data, setData] = useState({
    canisterName: "",
    canisterId: "",
  });

  const [liquidify, setLiquidifyCol] = useState({
    websiteLink: "",
    terms: 0,
    thumbnailURI: "",
    contentType: "",
    twitterLink: "",
    collectionURI: "",
    description: "",
    marketplaceLink: "",
    yield: 0.0,
    canisterID: "",
    collectionName: "",
  });

  const handleOk = () => {
    // eslint-disable-next-line no-unused-expressions
    token === inputToken
      ? (setShowTable(true), setIsModalOpen(false))
      : Notify("warning", "Please Input valid token");
  };

  const handleDeleteCanister = async (data) => {
    try {
      const API = await daoAgent();
      const result = await API.removeControlledCanister(
        foundaryId,
        Number(data.id)
      );

      if (result) {
        Notify("success", "Deleted canister successfully!");
        fetchCanisterCycles();
      } else {
        Notify("error", "Failed to delete!");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const columns = [
    {
      title: (
        <Row justify={"center"} style={{ fontSize: 18 }}>
          Canister Name
        </Row>
      ),
      width: "20%",
      dataIndex: "canisterName",
      key: "name",
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      render: (text) => <a>{text}</a>,
    },
    {
      title: (
        <Row justify={"center"} style={{ fontSize: 18 }}>
          Canister ID
        </Row>
      ),
      width: "20%",
      dataIndex: "canisterId",
      key: "canister",
      render: (obj) => (
        <Row justify={"center"} style={{ fontSize: 18 }}>
          <Link
            target="_blank"
            to={`https://dashboard.internetcomputer.org/canister/${obj}`}
          >
            {obj}
          </Link>
        </Row>
      ),
    },
    {
      title: (
        <Row justify={"center"} style={{ fontSize: 18 }}>
          Cycles
        </Row>
      ),
      sorter: (a, b) => a.tokens - b.tokens,
      defaultSortOrder: "ascend",
      width: "20%",
      key: "tokens",
      dataIndex: "tokens",
      render: (obj) => {
        return (
          <Row justify={"center"}>
            <Tag
              style={{ fontSize: 18 }}
              color={obj < 3 ? "red" : "green-inverse"}
            >
              {obj}
            </Tag>
          </Row>
        );
      },
    },
    {
      title: <Row justify={"center"} style={{ fontSize: 18 }}></Row>,
      width: "20%",
      key: "delete",
      dataIndex: "delete",
      render: (_, obj) => {
        return (
          <Row justify={"center"}>
            <Popconfirm
              title={"Are you sure want to delete this canister?"}
              onConfirm={() => handleDeleteCanister(obj)}
            >
              <Button>Delete</Button>
            </Popconfirm>
          </Row>
        );
      },
    },
  ];

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleLiquidifyCollectionChange = (e) => {
    setLiquidifyCol({ ...liquidify, [e.target.name]: e.target.value });
    if (e.target.name === "canisterID" && e.target.value) {
      setTimeout(() => {
        try {
          Principal?.fromText(e.target.value);
        } catch (error) {
          if (error.message.includes("may not be a valid Principal ID")) {
            Notify("error", "Please enter valid principal ID!");
          }
        }
      }, 1500);
    }
  };

  const handleCanister = (canisterId) => {
    const filterCanister = questions.filter(
      (data) => Principal.from(data.canister).toText() === canisterId
    );
    setFilterCanister(filterCanister);
  };

  const filterQuestionColumns = [
    {
      title: (
        <Row justify={"center"} style={{ fontSize: 18 }}>
          Question ID
        </Row>
      ),
      width: "20%",
      dataIndex: "questionID",
      key: "questionID",
      render: (obj) => (
        <Row justify={"center"} style={{ fontSize: 18 }}>
          {obj}
        </Row>
      ),
    },
    {
      title: (
        <Row justify={"center"} style={{ fontSize: 18 }}>
          Title
        </Row>
      ),
      width: "20%",
      dataIndex: "title",
      key: "name",
    },
    {
      title: (
        <Row justify={"center"} style={{ fontSize: 18 }}>
          Question
        </Row>
      ),
      width: "20%",
      dataIndex: "question",
      key: "question",
    },

    {
      title: (
        <Row justify={"center"} style={{ fontSize: 18 }}>
          Status
        </Row>
      ),
      width: "20%",
      dataIndex: "status",
      key: "status",
      render: (_, obj) => {
        const status = getProposalStatus(
          Number(obj.startTime),
          Number(obj.endTime),
          Date.now()
        );
        return (
          <Row justify={"center"} style={{ fontSize: 18 }}>
            {status}
          </Row>
        );
      },
    },
    {
      title: (
        <Row justify={"center"} style={{ fontSize: 18 }}>
          Creator
        </Row>
      ),
      width: "20%",
      dataIndex: "creator",
      key: "creator",
      render: (obj) => {
        const user = Principal.from(obj).toText();
        return (
          <Row justify={"center"} style={{ fontSize: 18 }}>
            <Tooltip title={user} color="purple">
              {sliceAddress(user)}
            </Tooltip>
          </Row>
        );
      },
    },
    {
      title: (
        <Row justify={"center"} style={{ fontSize: 18 }}>
          Discussion Link
        </Row>
      ),
      width: "20%",
      key: "discussionLink",
      dataIndex: "discussionLink",
      render: (obj) => {
        return (
          <Row justify={"center"} style={{ fontSize: 18 }}>
            {obj}
          </Row>
        );
      },
    },
  ];

  const questionColumns = [
    {
      title: (
        <Row justify={"center"} style={{ fontSize: 18 }}>
          Canister Name
        </Row>
      ),
      width: "20%",
      dataIndex: "",
      key: "name",
      render: (obj) => (
        <Link onClick={() => handleCanister(obj.canisterId)}>
          {obj.canisterName}
        </Link>
      ),
    },
    {
      title: (
        <Row justify={"center"} style={{ fontSize: 18 }}>
          Canister ID
        </Row>
      ),
      width: "20%",
      dataIndex: "canisterId",
      key: "canister",
      render: (obj) => (
        <Row justify={"center"} style={{ fontSize: 18 }}>
          {obj}
        </Row>
      ),
    },
    {
      title: (
        <Row justify={"center"} style={{ fontSize: 18 }}>
          Question count
        </Row>
      ),
      width: "20%",
      key: "count",
      dataIndex: "count",
      render: (obj) => {
        return (
          <Row justify={"center"} style={{ fontSize: 18 }}>
            {Number(obj)}
          </Row>
        );
      },
    },
  ];

  const onChange = (key) => {
    // console.log(key);
  };

  const handleAddCanister = async () => {
    try {
      setSubmitting(true);
      const API = await daoAgent();
      const result = await API.addControlledCanister(foundaryId, {
        canisterName: data.canisterName,
        canister: Principal.fromText(data.canisterId),
      });

      if (result) {
        Notify("success", "Canister added successfully!");
        fetchCanisterCycles();
        setData({
          canisterName: "",
          canisterId: "",
        });
      } else {
        Notify("error", "Failed to store!");
      }
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      console.log("add canister error", error);
    }
  };
  console.log("liquidify", liquidify);

  const handleAddCollection = async () => {
    if (
      !Number(liquidify.terms) ||
      !Number(liquidify.yield) ||
      Number(liquidify.yield) > 0 ||
      Number(liquidify.terms) > 0
    ) {
      Notify("warning", "Terms and Yield values should be valid number!");
      return;
    }
    try {
      setSubmitting(true);
      const API = await agentCreator(liquidifyIdlFactory, liquidifyCanisterId);
      const result = await API.addApprovedCollections({
        websiteLink: liquidify.websiteLink,
        terms: Number(liquidify.terms),
        thumbnailURI: liquidify.thumbnailURI,
        contentType: liquidify.contentType,
        collectionID: 1,
        twitterLink: liquidify.twitterLink,
        collectionURI: liquidify.collectionURI,
        description: liquidify.description,
        marketplaceLink: liquidify.marketplaceLink,
        yield: Number(liquidify.yield),
        canisterID: Principal.fromText(liquidify.canisterID),
        collectionName: liquidify.collectionName,
      });

      if (result) {
        Notify("success", "Collection added successfully!");
        setLiquidifyCol({
          websiteLink: "",
          terms: "",
          thumbnailURI: "",
          contentType: "",
          twitterLink: "",
          collectionURI: "",
          description: "",
          marketplaceLink: "",
          yield: "",
          canisterID: "",
          collectionName: "",
        });
      } else {
        Notify("error", "Failed to add collection!");
      }
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      console.log("add col error", error);
    }
  };
  console.log("tableData", tableData);

  const items = [
    {
      key: "1",
      label: "Canister cycles",
      children: showTable ? (
        <Table
          columns={columns}
          bordered
          dataSource={tableData}
          pagination={false}
        />
      ) : (
        <Row justify={"center"}>
          {" "}
          <Text className="time-sub-text">You entered invalid token</Text>
        </Row>
      ),
    },
    {
      key: "2",
      label: "Questions",
      children: showTable ? (
        <Table
          columns={
            filterCanister?.length ? filterQuestionColumns : questionColumns
          }
          bordered
          dataSource={
            filterCanister?.length ? filterCanister : questionTableData
          }
          pagination={false}
        />
      ) : (
        <Row justify={"center"}>
          {" "}
          <Text className="time-sub-text">You entered invalid token</Text>
        </Row>
      ),
    },
    {
      key: "3",
      label: "Controller canister",
      children: (
        <>
          <Row align={"middle"} justify={"space-between"} className="mt-30">
            <Col xs={7}>
              <div>
                <input
                  value={data.canisterName}
                  className="input col-md-12 col-sm-12"
                  name="canisterName"
                  onChange={handleChange}
                  placeholder="Canister Name"
                />
              </div>
            </Col>
            <Col xs={7}>
              <div className="row flex-col">
                <input
                  value={data.canisterId}
                  className="input col-md-12 col-sm-12"
                  name="canisterId"
                  onChange={(e) => {
                    if (e.target.name === "canisterId" && e.target.value) {
                      setTimeout(() => {
                        try {
                          Principal?.fromText(e.target.value);
                        } catch (error) {
                          if (
                            error.message.includes(
                              "may not be a valid Principal ID"
                            )
                          ) {
                            Notify("error", "Please enter valid principal ID!");
                          }
                        }
                      }, 1500);
                    }
                    handleChange(e);
                  }}
                  placeholder="Canister ID"
                />
              </div>
            </Col>
            <Col xs={7}>
              <Button
                type="primary"
                loading={isSubmitting}
                onClick={handleAddCanister}
              >
                Submit
              </Button>
            </Col>
          </Row>
        </>
      ),
    },
    {
      key: "4",
      label: "Liquidify collection",
      children: (
        <>
          <div className="liq-col">
            <form
              className="form row"
              id="proposal-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleAddCollection();
              }}
            >
              <div className="row justify-content-between mb-3">
                <div className="col-md-5 col-sm-12 mt-4">
                  <div>
                    <span className="form-label">Collection name</span>
                  </div>
                  <input
                    value={liquidify.collectionName}
                    className="input col-md-12 col-sm-12 "
                    type="text"
                    name="collectionName"
                    onChange={handleLiquidifyCollectionChange}
                    placeholder="Enter collection name!"
                    required
                  />
                </div>
                <div className=" col-md-5 col-sm-12 mt-4">
                  <div>
                    <span className="form-label">Canister ID</span>
                  </div>
                  <input
                    value={liquidify.canisterID}
                    className="input col-md-12 col-sm-12 "
                    type="text"
                    name="canisterID"
                    onChange={handleLiquidifyCollectionChange}
                    placeholder="Enter canister ID!"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <div className="form-label">Content Type</div>
                <input
                  value={liquidify.contentType}
                  className="input col-md-12 col-sm-12"
                  type="text"
                  name="contentType"
                  id="start_date"
                  onChange={handleLiquidifyCollectionChange}
                  placeholder="Enter content type of the collection! eg(image/jpg)"
                  required
                />
              </div>

              <div className="mt-4">
                <div className="form-label">Website Link</div>
                <input
                  value={liquidify.websiteLink}
                  className="input col-md-12 col-sm-12"
                  type="text"
                  name="websiteLink"
                  id="start_date"
                  onChange={handleLiquidifyCollectionChange}
                  placeholder="Enter official website link of the canister!"
                  required
                />
              </div>

              <div className="row justify-content-between">
                <div className="col-md-5 col-sm-12 mt-4">
                  <div className="form-label">Terms</div>
                  <input
                    value={liquidify.terms}
                    className="input col-md-12 col-sm-12"
                    type="text"
                    name="terms"
                    onChange={handleLiquidifyCollectionChange}
                    placeholder="Enter loan period in days!"
                    required
                  />
                </div>
                <div className="col-md-5 col-sm-12 mt-4">
                  <div className="form-label ">Yield</div>
                  <input
                    value={liquidify.yield}
                    className="input col-md-12 col-sm-12"
                    type="text"
                    name="yield"
                    id="end_date"
                    onChange={handleLiquidifyCollectionChange}
                    placeholder="End time"
                    required
                  />
                </div>
              </div>

              <div className="row justify-content-between mb-3">
                <div className="col-md-5 col-sm-12 mt-4">
                  <div>
                    <span className="form-label">Thumbnail URI</span>
                  </div>
                  <input
                    value={liquidify.thumbnailURI}
                    className="input col-md-12 col-sm-12 "
                    type="text"
                    name="thumbnailURI"
                    onChange={handleLiquidifyCollectionChange}
                    placeholder="Enter collection thumbnail URI"
                    required
                  />
                </div>
                <div className=" col-md-5 col-sm-12 mt-4">
                  <div>
                    <span className="form-label">Collection URI</span>
                  </div>
                  <input
                    value={liquidify.collectionURI}
                    className="input col-md-12 col-sm-12 "
                    type="text"
                    name="collectionURI"
                    onChange={handleLiquidifyCollectionChange}
                    placeholder="Enter collection URI"
                    required
                  />
                </div>
              </div>

              <textarea
                rows={"4"}
                className="input mt-4"
                value={liquidify.description}
                maxLength="200"
                type="textarea"
                name="description"
                placeholder="Enter description of the collection!"
                onChange={handleLiquidifyCollectionChange}
                required
              />

              <div className="mt-4">
                <div className="form-label">Marketplace Link</div>
                <input
                  value={liquidify.marketplaceLink}
                  className="input col-md-12 col-sm-12"
                  type="text"
                  name="marketplaceLink"
                  id="start_date"
                  onChange={handleLiquidifyCollectionChange}
                  placeholder="Enter entrepot marketplace link of the canister! "
                  required
                />
              </div>

              <div className="mt-4">
                <div className="form-label">Twitter Link</div>
                <input
                  value={liquidify.twitterLink}
                  className="input col-md-12 col-sm-12"
                  type="text"
                  name="twitterLink"
                  id="start_date"
                  onChange={handleLiquidifyCollectionChange}
                  placeholder="Enter official twitter link of the canister!"
                  required
                />
              </div>

              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                className="mt-5"
              >
                Submit
              </Button>
            </form>
          </div>
        </>
      ),
    },
    {
      key: "5",
      label: "Questions",
      children: showTable ? (
        <Table
          columns={
            filterCanister?.length ? filterQuestionColumns : questionColumns
          }
          bordered
          dataSource={
            filterCanister?.length ? filterCanister : questionTableData
          }
          pagination={false}
        />
      ) : (
        <Row justify={"center"}>
          {" "}
          <Text className="time-sub-text">You entered invalid token</Text>
        </Row>
      ),
    },
  ];

  const fetchCanisterCycles = async () => {
    try {
      const daoActor = await daoAgent();
      const canisters = await daoActor.getControlledCanisters();
      const promises = canisters.map(async (canister_) => {
        const [id, canister] = canister_;
        const canisterId = Principal.from(canister.canister).toText();
        const actor = await agentCreator(cyclesFactory, canisterId);

        return new Promise(async (res) => {
          const tokens = await actor.availableCycles();
          res({
            ...canister,
            canisterId,
            tokens,
            id,
          });
        });
      });
      const actors = await Promise.all(promises);

      const data = actors.map((canister) => ({
        ...canister,
        tokens: (Number(canister.tokens) / 1000000000000).toPrecision(2),
      }));

      setTableData(data);
    } catch (error) {
      console.log("avaliable cycles error", error);
    }
  };

  useEffect(() => {
    if (filterCanister !== null && filterCanister?.length === 0) {
      Notify("warning", "No data in canister!");
    }
  }, [filterCanister]);

  useEffect(() => {
    fetchCanisterCycles();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const daoActor = await agentCreator(daoFactory, daoCanisterId);
        const canisters = await daoActor.getCanisters();
        const promises = canisters.map(async (canister) => {
          const canisterData = canister[1].canister;
          const canisterName = canister[1].canisterName;
          const canisterId = Principal.from(canisterData).toText();
          return new Promise(async (res) => {
            const count = await daoActor.getCanisterQuestionCount(
              Principal.fromText(canisterId)
            );
            res({
              canisterName,
              canisterId,
              count,
            });
          });
        });

        const result = await Promise.all(promises);
        setQuestionTableData(result);
      } catch (error) {
        console.log("avaliable cycles error", error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const daoActor = await daoAgent();
        const canisters = await daoActor.getQuestions();
        const questionData = canisters.map((data) => {
          return data[1];
        });
        setQuestions(questionData);
      } catch (error) {
        console.log("error", error);
      }
    })();
  }, []);

  useEffect(() => {
    if (principalId) {
      const isAllowed = principals.includes(principalId);
      if (isAllowed) {
        setShowTable(true);
        setIsModalOpen(false);
      }
    }
  }, [principalId]);

  return (
    <>
      {filterCanister?.length > 0 && (
        <Row justify={"end"}>
          {/* <Col> <Button>Back</Button></Col> */}
          <Col>
            <Button onClick={() => setFilterCanister(null)}>cancel</Button>
          </Col>
        </Row>
      )}
      <Row justify={"center"} align={"middle"} className="login mb-4">
        <Col md={24}>
          <Tabs centered items={items} onChange={onChange} />
          {/* Canister cycles */}
        </Col>
      </Row>

      <Modal className="mt-60" open={isModalOpen} footer={null}>
        <Text className="color-black row justify-content-center font-size-20">
          Authentication Token
        </Text>
        <Input
          type="password"
          className="mt-10"
          placeholder="Enter Token"
          onChange={(e) => setInputToken(e.target.value)}
          size="large"
        />
        <Flex gap={20} justify={"end"} className="mt-10">
          {/* <button class="button-62" role="button">Cancel</button> */}
          <button className="button-88" onClick={handleOk}>
            Ok
          </button>
        </Flex>
      </Modal>
    </>
  );
};
export default Cycles;
