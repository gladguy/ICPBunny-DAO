import { Principal } from "@dfinity/principal";
import {
  Button,
  Col,
  Flex,
  Input,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { FaHome, FaMapMarkedAlt } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { cyclesFactory, daoFactory } from "../IDL";
import { agentCreator, daoAgent } from "../components/actorCreators";
import Notify from "../components/notification";
import { liquidifyIdlFactory } from "../liquidify_IDL";
import { myordinalsIdlFactory } from "../myordinals_IDL";
import {
  daoCanisterId,
  foundaryId,
  getProposalStatus,
  liquidifyCanisterId,
  liquidifyStagingCanisterId,
  MYORDINALS,
  myordinalsCanisterId,
  principals,
  PRODUCTION,
  ROOTSTOCK,
  rootstockCanisterId,
  sliceAddress,
  STAGING,
} from "../utils";

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
  const [isCanisterModalOpen, setIsCanisterModalOpen] = useState(false);
  const [isLiquidifyUpdationModalOpen, setIsLiquidifyUpdationModalOpen] =
    useState(false);
  const [isOrdinalsUpdationModalOpen, setIsOrdinalsUpdationModalOpen] =
    useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isOrdinalsCollectionModalOpen, setIsOrdinalsCollectionModalOpen] =
    useState(false);
  const [approvedCollection, setApprovedCollection] = useState(null);
  const [domainType, setDomainType] = useState("");
  const [ordinalDomainType, setOrdinalDomainType] = useState("");

  const [
    approvedCollectionLiquidifyStaging,
    setApprovedCollectionLiquidifyStaging,
  ] = useState(null);
  const [approvedOrdinalCollection, setApprovedOrdinalCollection] =
    useState(null);
  const [
    approvedOrdinalCollectionStaging,
    setApprovedOrdinalCollectionStaging,
  ] = useState(null);

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

  const [updationData, setUpdationData] = useState({
    yield: "",
    terms: "",
    collectionId: "",
    domain: "",
  });

  const [ordinalUpdationData, setordinalUpdationData] = useState({
    yield: "",
    terms: "",
    collectionId: "",
    domain: "",
  });

  const [ordinal, setOrdinalCol] = useState({
    websiteLink: "",
    terms: 0,
    thumbnailURI: "",
    contentType: "",
    twitterLink: "",
    collectionURI: "",
    description: "",
    marketplaceLink: "",
    yield: 0.0,
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

  const handleDeleteCollection = async (id, power) => {
    const canisterId =
      power === PRODUCTION ? liquidifyCanisterId : liquidifyStagingCanisterId;
    try {
      const API = await agentCreator(liquidifyIdlFactory, canisterId);
      const result = await API.removeApprovedCollections(id);
      if (result) {
        Notify("success", "Deleted collection successfully!");
        fetchLiquidifyCollection();
      } else {
        Notify("error", "Failed to delete!");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleDeleteOrdinalCollection = async (id, power) => {
    const canisterId =
      power === MYORDINALS ? myordinalsCanisterId : rootstockCanisterId;
    try {
      const API = await agentCreator(myordinalsIdlFactory, canisterId);
      const result = await API.removeApproved_Collections(id);
      if (result) {
        Notify("success", "Deleted collection successfully!");
        fetchOrdinalCollection();
      } else {
        Notify("error", "Failed to delete!");
      }
    } catch (error) {
      console.log("ordinals collection delete error", error);
    }
  };

  const handleUpdateLiquidify = async () => {
    if (!updationData.terms || !updationData.yield || !domainType) {
      Notify("warning", "Input all fields!");
      return;
    }
    try {
      const canisterId =
        domainType === PRODUCTION
          ? liquidifyCanisterId
          : liquidifyStagingCanisterId;
      setSubmitting(true);
      const API = await agentCreator(liquidifyIdlFactory, canisterId);
      const result = await API.removeApproved_Collections(
        updationData.yield,
        updationData.terms,
        updationData.collectionId
      );
      if (result) {
        Notify("success", "Updated collection successfully!");
        fetchLiquidifyCollection();
        handleLiquidifyUpdationModal();
      } else {
        Notify("error", "Failed to update!");
      }
    } catch (error) {
      console.log("Liquidify collection updation error", error);
    }
  };

  const handleCanisterModal = () => {
    setIsCanisterModalOpen(!isCanisterModalOpen);
  };

  const handleLiquidifyUpdationModal = () => {
    if (isLiquidifyUpdationModalOpen) {
      setDomainType("");
    }
    setIsLiquidifyUpdationModalOpen(!isLiquidifyUpdationModalOpen);
  };

  const handleOrinalUpdationModal = () => {
    if (isOrdinalsUpdationModalOpen) {
      setDomainType("");
    }
    setIsOrdinalsUpdationModalOpen(!isOrdinalsUpdationModalOpen);
  };

  const handleCollectionModal = () => {
    if (isCollectionModalOpen) {
      setDomainType("");
    }
    setIsCollectionModalOpen(!isCollectionModalOpen);
  };

  const handleOrdinalsCollectionModal = () => {
    if (isOrdinalsCollectionModalOpen) {
      setOrdinalDomainType("");
    }
    setIsOrdinalsCollectionModalOpen(!isOrdinalsCollectionModalOpen);
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

  const handleUpdationChange = (e) => {
    setUpdationData({ ...updationData, [e.target.name]: e.target.value });
  };

  const handleOrdinalUpdationChange = (e) => {
    setordinalUpdationData({
      ...ordinalUpdationData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOrdinalCollectionChange = (e) => {
    setOrdinalCol({ ...ordinal, [e.target.name]: e.target.value });
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
            <Link to={obj} target="_blank">
              View
            </Link>
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

  const ordinalColumns = [
    {
      key: "CollectionID",
      title: "Collection ID",
      align: "center",
      dataIndex: "collectionID",
      render: (_, obj) => (
        <Flex vertical gap={5} justify="center">
          <Text style={{ fontSize: 18 }}>{Number(obj.collectionID)}</Text>
          <Text>
            <Tag color="green" style={{ fontSize: 18 }}>
              {obj.contentType}
            </Tag>
          </Text>
        </Flex>
      ),
    },
    {
      key: "Collection",
      title: "Collection",
      align: "center",
      dataIndex: "collectionName",
      render: (_, obj) => (
        <Flex align="center" vertical gap={5}>
          <img
            className="border-radius-5"
            alt={`lend_image`}
            src={obj.thumbnailURI}
            height={70}
            width={70}
          />
          <Text style={{ fontSize: 18 }}>{obj.collectionName}</Text>
          <Flex gap={5} justify="center" align="center">
            <Link to={obj.websiteLink} target="_blank">
              <FaHome size={25} />
            </Link>
            <Link to={obj.websiteLink} target="_blank">
              <FaSquareXTwitter size={25} />
            </Link>
            <Link to={obj.websiteLink} target="_blank">
              <FaMapMarkedAlt size={25} />
            </Link>
          </Flex>
        </Flex>
      ),
    },
    {
      title: (
        <Row justify={"center"} style={{ fontSize: 18 }}>
          Yield | Terms
        </Row>
      ),
      width: "20%",
      dataIndex: "yieldAndTerms",
      key: "canister",
      render: (_, obj) => (
        <Row justify={"center"} style={{ fontSize: 16 }}>
          <Flex align="center" gap={10}>
            <Text style={{ fontSize: 18 }}>{obj.yield}</Text> |{" "}
            <Text style={{ fontSize: 18 }}>{Number(obj.terms)}</Text>
          </Flex>
        </Row>
      ),
    },
  ];

  const liquidifyColumns = [
    {
      key: "CollectionID",
      title: "Collection ID",
      align: "center",
      dataIndex: "collectionID",
      render: (_, obj) => (
        <Flex vertical gap={5} justify="center">
          <Text style={{ fontSize: 18 }}>{Number(obj.collectionID)}</Text>
          <Text>
            <Tag color="green" style={{ fontSize: 18 }}>
              {obj.contentType}
            </Tag>
          </Text>
        </Flex>
      ),
    },
    {
      key: "Collection",
      title: "Collection",
      align: "center",
      dataIndex: "collectionName",
      render: (_, obj) => (
        <Flex align="center" vertical gap={5}>
          <img
            className="border-radius-5"
            alt={`lend_image`}
            src={obj.thumbnailURI}
            height={70}
            width={70}
          />
          <Text style={{ fontSize: 18 }}>{obj.collectionName}</Text>
          <Flex gap={5} justify="center" align="center">
            <Link to={obj.websiteLink} target="_blank">
              <FaHome size={25} />
            </Link>
            <Link to={obj.websiteLink} target="_blank">
              <FaSquareXTwitter size={25} />
            </Link>
            <Link to={obj.websiteLink} target="_blank">
              <FaMapMarkedAlt size={25} />
            </Link>
          </Flex>
        </Flex>
      ),
    },
    {
      title: (
        <Row justify={"center"} style={{ fontSize: 18 }}>
          Canister ID
        </Row>
      ),
      dataIndex: "canisterID",
      key: "canister",
      render: (obj) => (
        <Row justify={"center"} style={{ fontSize: 18 }}>
          <Link
            to={`https://dashboard.internetcomputer.org/canister/${Principal?.from(
              obj
            ).toText()}`}
            target="_blank"
          >
            {Principal?.from(obj).toText()}
          </Link>
        </Row>
      ),
    },
    {
      title: (
        <Row justify={"center"} style={{ fontSize: 18 }}>
          Yield | Terms
        </Row>
      ),
      width: "20%",
      dataIndex: "yieldAndTerms",
      key: "canister",
      render: (_, obj) => (
        <Row justify={"center"} style={{ fontSize: 16 }}>
          <Flex align="center" gap={10}>
            <Text style={{ fontSize: 18 }}>{obj.yield}</Text> |{" "}
            <Text style={{ fontSize: 18 }}>{Number(obj.terms)}</Text>
          </Flex>
        </Row>
      ),
    },
  ];

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
        handleCanisterModal();
      } else {
        Notify("error", "Failed to store!");
      }
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      console.log("add canister error", error);
    }
  };

  const handleAddOrdinalCollection = async (data, isCopy, copyDomainType) => {
    let props = {};
    if (!isCopy) {
      if (
        !Number(ordinal.terms) ||
        !Number(ordinal.yield) ||
        Number(ordinal.yield) > 0 ||
        Number(ordinal.terms) > 0
      ) {
        Notify("warning", "Terms and Yield values should be valid number!");
        return;
      }
      props = {
        websiteLink: ordinal.websiteLink,
        terms: Number(ordinal.terms),
        thumbnailURI: ordinal.thumbnailURI,
        contentType: ordinal.contentType,
        collectionID: 1,
        twitterLink: ordinal.twitterLink,
        collectionURI: ordinal.collectionURI,
        description: ordinal.description,
        marketplaceLink: ordinal.marketplaceLink,
        yield: Number(ordinal.yield),
        collectionName: ordinal.collectionName,
      };
    } else {
      props = {
        websiteLink: data.websiteLink,
        terms: Number(data.terms),
        thumbnailURI: data.thumbnailURI,
        contentType: data.contentType,
        collectionID: 1,
        twitterLink: data.twitterLink,
        collectionURI: data.collectionURI,
        description: data.description,
        marketplaceLink: data.marketplaceLink,
        yield: Number(data.yield),
        collectionName: data.collectionName,
      };
    }
    try {
      let canisterId;
      if (isCopy) {
        canisterId =
          copyDomainType === MYORDINALS
            ? myordinalsCanisterId
            : rootstockCanisterId;
      } else {
        canisterId =
          ordinalDomainType === MYORDINALS
            ? myordinalsCanisterId
            : rootstockCanisterId;
      }
      setSubmitting(true);
      const API = await agentCreator(myordinalsIdlFactory, canisterId);
      const result = await API.addApproved_Collections(props);
      if (result) {
        Notify("success", "Collection added successfully!");
        if (!isCopy) {
          setOrdinalCol({
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
          handleCollectionModal();
        } else {
          fetchOrdinalCollection();
        }
      } else {
        Notify("error", "Failed to add collection!");
      }
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      console.log("add col error", error);
    }
  };

  const handleAddCollection = async (data, isCopy, copyDomainType) => {
    let props = {};
    if (!isCopy) {
      if (
        !Number(liquidify.terms) ||
        !Number(liquidify.yield) ||
        Number(liquidify.yield) > 0 ||
        Number(liquidify.terms) > 0
      ) {
        Notify("warning", "Terms and Yield values should be valid number!");
        return;
      }
      if (!domainType) {
        Notify("warning", "Choose the domain type!");
        return;
      }
      props = {
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
      };
    } else {
      props = {
        websiteLink: data.websiteLink,
        terms: Number(data.terms),
        thumbnailURI: data.thumbnailURI,
        contentType: data.contentType,
        collectionID: 1,
        twitterLink: data.twitterLink,
        collectionURI: data.collectionURI,
        description: data.description,
        marketplaceLink: data.marketplaceLink,
        yield: Number(data.yield),
        canisterID: data.canisterID,
        collectionName: data.collectionName,
      };
    }
    try {
      setSubmitting(true);
      let canisterId;
      if (isCopy) {
        canisterId =
          copyDomainType === PRODUCTION
            ? liquidifyCanisterId
            : liquidifyStagingCanisterId;
      } else {
        canisterId =
          domainType === PRODUCTION
            ? liquidifyCanisterId
            : liquidifyStagingCanisterId;
      }
      const API = await agentCreator(liquidifyIdlFactory, canisterId);
      const result = await API.addApprovedCollections(props);

      if (result) {
        Notify("success", "Collection added successfully!");
        if (!isCopy) {
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
          handleCollectionModal();
        } else {
          fetchLiquidifyCollection();
        }
      } else {
        Notify("error", "Failed to add collection!");
      }
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      console.log("add col error", error);
    }
  };
  console.log("updationData", updationData);
  console.log("ordinalUpdationData", ordinalUpdationData);

  const items_liquidify = [
    {
      key: "1",
      label: "Production",
      children: showTable ? (
        <>
          <Row justify={"end"}>
            <Button
              className="mt-2"
              type="primary"
              onClick={() => handleCollectionModal()}
            >
              Add collection
            </Button>
          </Row>
          <Table
            columns={[
              ...liquidifyColumns,
              {
                title: <Row justify={"center"} style={{ fontSize: 18 }}></Row>,
                key: "delete",
                dataIndex: "delete",
                render: (_, obj) => {
                  return (
                    <Row justify={"space-evenly"}>
                      <Button
                        onClick={() => {
                          handleLiquidifyUpdationModal();
                          setUpdationData({
                            ...updationData,
                            collectionId: Number(obj.collectionID),
                            domain: "production",
                          });
                        }}
                      >
                        Update
                      </Button>
                      <Popconfirm
                        title={
                          "Are you sure want to copy this collection to staging?"
                        }
                        onConfirm={() =>
                          handleAddCollection(obj, true, STAGING)
                        }
                      >
                        <Button>Copy</Button>
                      </Popconfirm>
                      <Popconfirm
                        title={"Are you sure want to delete this collection?"}
                        onConfirm={() =>
                          handleDeleteCollection(
                            Number(obj.collectionID),
                            STAGING
                          )
                        }
                      >
                        <Button>Delete</Button>
                      </Popconfirm>
                    </Row>
                  );
                },
              },
            ]}
            className="mt-4"
            loading={approvedCollection === null}
            dataSource={approvedCollection === null ? [] : approvedCollection}
            pagination={false}
            rowKey={(e) => `${e.collectionName}-${e.contentType}`}
          />
        </>
      ) : (
        <Row justify={"center"}>
          {" "}
          <Text className="time-sub-text">You entered invalid token</Text>
        </Row>
      ),
    },
    {
      key: "2",
      label: "Staging",
      children: showTable ? (
        <>
          <Row justify={"end"}>
            <Button
              className="mt-2"
              type="primary"
              onClick={() => handleCollectionModal()}
            >
              Add collection
            </Button>
          </Row>
          <Table
            columns={[
              ...liquidifyColumns,
              {
                title: <Row justify={"center"} style={{ fontSize: 18 }}></Row>,
                key: "delete",
                dataIndex: "delete",
                render: (_, obj) => {
                  return (
                    <Row justify={"space-evenly"}>
                      <Button
                        onClick={() => {
                          handleLiquidifyUpdationModal();
                          setUpdationData({
                            ...updationData,
                            collectionId: Number(obj.collectionID),
                            domain: "staging",
                          });
                        }}
                      >
                        Update
                      </Button>
                      <Popconfirm
                        title={
                          "Are you sure want to copy this collection to production?"
                        }
                        onConfirm={() =>
                          handleAddCollection(obj, true, PRODUCTION)
                        }
                      >
                        <Button>Copy</Button>
                      </Popconfirm>
                      <Popconfirm
                        title={"Are you sure want to delete this collection?"}
                        onConfirm={() =>
                          handleDeleteCollection(
                            Number(obj.collectionID),
                            STAGING
                          )
                        }
                      >
                        <Button>Delete</Button>
                      </Popconfirm>
                    </Row>
                  );
                },
              },
            ]}
            className="mt-4"
            loading={approvedCollectionLiquidifyStaging === null}
            dataSource={
              approvedCollectionLiquidifyStaging === null
                ? []
                : approvedCollectionLiquidifyStaging
            }
            pagination={false}
            rowKey={(e) => `${e.collectionName}-${e.contentType}`}
          />
        </>
      ) : (
        <Row justify={"center"}>
          {" "}
          <Text className="time-sub-text">You entered invalid token</Text>
        </Row>
      ),
    },
  ];

  const items_ordinals = [
    {
      key: "1_ordinals",
      label: "My Ordinals",
      children: showTable ? (
        <>
          <Row justify={"end"}>
            <Button
              className="mt-2"
              type="primary"
              onClick={() => handleOrdinalsCollectionModal()}
            >
              Add collection
            </Button>
          </Row>
          <Table
            columns={[
              ...ordinalColumns,
              {
                title: <Row justify={"center"} style={{ fontSize: 18 }}></Row>,
                key: "delete",
                dataIndex: "delete",
                render: (_, obj) => {
                  return (
                    <Row justify={"space-evenly"}>
                      <Button
                        onClick={() => {
                          handleOrinalUpdationModal();
                          setordinalUpdationData({
                            ...updationData,
                            collectionId: Number(obj.collectionID),
                            domain: "myordinals",
                          });
                        }}
                      >
                        Update
                      </Button>
                      <Popconfirm
                        title={
                          "Are you sure want to copy this collection to rootstock?"
                        }
                        onConfirm={() =>
                          handleAddOrdinalCollection(obj, true, ROOTSTOCK)
                        }
                      >
                        <Button>Copy</Button>
                      </Popconfirm>
                      <Popconfirm
                        title={"Are you sure want to delete this collection?"}
                        onConfirm={() =>
                          handleDeleteOrdinalCollection(
                            Number(obj.collectionID),
                            MYORDINALS
                          )
                        }
                      >
                        <Button>Delete</Button>
                      </Popconfirm>
                    </Row>
                  );
                },
              },
            ]}
            className="mt-4"
            loading={approvedOrdinalCollection === null}
            dataSource={
              approvedOrdinalCollection === null
                ? []
                : approvedOrdinalCollection
            }
            pagination={false}
            rowKey={(e) => `${e.collectionName}-myordinal-${e.contentType}`}
          />
        </>
      ) : (
        <Row justify={"center"}>
          {" "}
          <Text className="time-sub-text">You entered invalid token</Text>
        </Row>
      ),
    },
    {
      key: "2_ordinals",
      label: "Rootstock",
      children: showTable ? (
        <>
          <Row justify={"end"}>
            <Button
              className="mt-2"
              type="primary"
              onClick={() => handleOrdinalsCollectionModal()}
            >
              Add collection
            </Button>
          </Row>
          <Table
            columns={[
              ...ordinalColumns,
              {
                title: <Row justify={"center"} style={{ fontSize: 18 }}></Row>,
                key: "delete",
                dataIndex: "delete",
                render: (_, obj) => {
                  return (
                    <Row justify={"space-evenly"}>
                      <Button
                        onClick={() => {
                          handleOrinalUpdationModal();
                          setordinalUpdationData({
                            ...updationData,
                            collectionId: Number(obj.collectionID),
                            domain: "rootstock",
                          });
                        }}
                      >
                        Update
                      </Button>
                      <Popconfirm
                        title={
                          "Are you sure want to copy this collection to myordinals?"
                        }
                        onConfirm={() =>
                          handleAddOrdinalCollection(obj, true, MYORDINALS)
                        }
                      >
                        <Button>Copy</Button>
                      </Popconfirm>
                      <Popconfirm
                        title={"Are you sure want to delete this collection?"}
                        onConfirm={() =>
                          handleDeleteOrdinalCollection(
                            Number(obj.collectionID),
                            ROOTSTOCK
                          )
                        }
                      >
                        <Button>Delete</Button>
                      </Popconfirm>
                    </Row>
                  );
                },
              },
            ]}
            className="mt-4"
            loading={approvedOrdinalCollectionStaging === null}
            dataSource={
              approvedOrdinalCollectionStaging === null
                ? []
                : approvedOrdinalCollectionStaging
            }
            pagination={false}
            rowKey={(e) => `${e.collectionName}-rootstock-${e.contentType}`}
          />
        </>
      ) : (
        <Row justify={"center"}>
          {" "}
          <Text className="time-sub-text">You entered invalid token</Text>
        </Row>
      ),
    },
  ];

  const items = [
    {
      key: "1_liquidify",
      label: "Canister cycles",
      children: showTable ? (
        <>
          <Row justify={"end"}>
            <Button
              className="mt-2"
              type="primary"
              onClick={() => handleCanisterModal()}
            >
              Add canister
            </Button>
          </Row>
          <Table
            className="mt-4"
            columns={columns}
            bordered
            dataSource={tableData}
            pagination={false}
            rowKey={(e) => `${e.canisterId}-${e.canisterName}`}
          />
        </>
      ) : (
        <Row justify={"center"}>
          {" "}
          <Text className="time-sub-text">You entered invalid token</Text>
        </Row>
      ),
    },
    {
      key: "2_liquidify",
      label: "Liquidify collections",
      children: showTable ? (
        <>
          <Tabs centered items={items_liquidify} />
        </>
      ) : (
        <Row justify={"center"}>
          {" "}
          <Text className="time-sub-text">You entered invalid token</Text>
        </Row>
      ),
    },
    {
      key: "3",
      label: "Ordinals collections",
      children: showTable ? (
        <Tabs centered items={items_ordinals} />
      ) : (
        <Row justify={"center"}>
          {" "}
          <Text className="time-sub-text">You entered invalid token</Text>
        </Row>
      ),
    },
    {
      key: "4",
      label: "Questions",
      children: showTable ? (
        <>
          {filterCanister?.length > 0 && (
            <Row justify={"end"}>
              <Col>
                <Button onClick={() => setFilterCanister(null)}>cancel</Button>
              </Col>
            </Row>
          )}
          <Table
            columns={
              filterCanister?.length ? filterQuestionColumns : questionColumns
            }
            bordered
            className="mt-4"
            dataSource={
              filterCanister?.length ? filterCanister : questionTableData
            }
            pagination={false}
          />
        </>
      ) : (
        <Row justify={"center"}>
          {" "}
          <Text className="time-sub-text">You entered invalid token</Text>
        </Row>
      ),
    },
  ];

  const optionsRadio = [
    {
      label: "Production",
      value: "production",
    },
    {
      label: "Staging",
      value: "staging",
    },
  ];

  const ordinalOptionsRadio = [
    {
      label: "Myordinals",
      value: "myordinals",
    },
    {
      label: "Rootstock",
      value: "rootstock",
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

  const fetchLiquidifyCollection = async () => {
    try {
      const API = await agentCreator(liquidifyIdlFactory, liquidifyCanisterId);
      const API_staging = await agentCreator(
        liquidifyIdlFactory,
        liquidifyStagingCanisterId
      );
      const approvedCollections = await API.getApprovedCollections();
      const approvedCollections_staging =
        await API_staging.getApprovedCollections();
      const collections = approvedCollections.map((data) => data[1]);
      const collections_staging = approvedCollections_staging.map(
        (data) => data[1]
      );
      setApprovedCollection(collections);
      setApprovedCollectionLiquidifyStaging(collections_staging);
    } catch (error) {
      console.log("error Fetch User Assets", error);
    }
  };

  const fetchOrdinalCollection = async () => {
    try {
      const API = await agentCreator(
        myordinalsIdlFactory,
        myordinalsCanisterId
      );
      const API_staging = await agentCreator(
        myordinalsIdlFactory,
        rootstockCanisterId
      );
      const approvedCollections = await API.getApproved_Collections();
      const approvedCollections_staging =
        await API_staging.getApproved_Collections();
      const collections = approvedCollections.map((data) => data[1]);
      const collections_staging = approvedCollections_staging.map(
        (data) => data[1]
      );
      setApprovedOrdinalCollection(collections);
      setApprovedOrdinalCollectionStaging(collections_staging);
    } catch (error) {
      console.log("error Fetch User Assets", error);
    }
  };

  useEffect(() => {
    fetchLiquidifyCollection();
    fetchOrdinalCollection();
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
      <Row justify={"center"} align={"middle"} className="login mb-4">
        <Col md={24}>
          <Tabs centered items={items} />
          {/* Canister cycles */}
        </Col>
      </Row>

      {/* Authentication */}
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

      {/* Canister adding in cycles */}
      <Modal
        className="mt-60"
        title="Add Canister"
        open={isCanisterModalOpen}
        onCancel={() => handleCanisterModal()}
        footer={null}
      >
        <>
          <Row align={"middle"} justify={"space-between"} className="mt-30">
            <Col xs={24}>
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
          </Row>
          <Row className="mt-30">
            <Col xs={24}>
              <div>
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
          </Row>
          <Row className="mt-30">
            <Col xs={24}>
              <Button
                block
                type="primary"
                loading={isSubmitting}
                onClick={handleAddCanister}
              >
                Submit
              </Button>
            </Col>
          </Row>
        </>
      </Modal>

      {/* Liquidify add collection */}
      <Modal
        width={"80%"}
        title="Add Liquidify Collection"
        open={isCollectionModalOpen}
        onCancel={() => handleCollectionModal()}
        footer={null}
      >
        <Row>
          <Col xs={24}>
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

                <div className="mt-4">
                  <div className="form-label">Choose domain type</div>
                  <Radio.Group
                    size="large"
                    options={optionsRadio}
                    value={domainType}
                    onChange={({ target: { value } }) => setDomainType(value)}
                    optionType="button"
                    buttonStyle="solid"
                  />
                </div>

                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                  className="mt-4"
                >
                  Submit
                </Button>
              </form>
            </div>
          </Col>
        </Row>
      </Modal>

      {/* Liquidify yield and terms updation */}
      <Modal
        className="mt-60"
        title="Update liquidify"
        open={isLiquidifyUpdationModalOpen}
        onCancel={() => handleLiquidifyUpdationModal()}
        footer={null}
      >
        <>
          <Row align={"middle"} justify={"space-between"} className="mt-30">
            <Col xs={24}>
              <div>
                <input
                  value={updationData.yield}
                  className="input col-md-12 col-sm-12"
                  name="yield"
                  onChange={handleUpdationChange}
                  placeholder="Enter yield"
                />
              </div>
            </Col>
          </Row>
          <Row className="mt-30">
            <Col xs={24}>
              <div>
                <input
                  value={updationData.terms}
                  className="input col-md-12 col-sm-12"
                  name="terms"
                  onChange={(e) => {
                    handleUpdationChange(e);
                  }}
                  placeholder="Enter terms"
                />
              </div>
            </Col>
          </Row>
          <Row className="mt-4">
            <div>
              <div className="form-label">Choose domain type</div>
              <Radio.Group
                size="large"
                options={optionsRadio}
                value={updationData.domain}
                optionType="button"
                buttonStyle="solid"
              />
            </div>
          </Row>
          <Row className="mt-30">
            <Col xs={24}>
              <Button
                block
                type="primary"
                loading={isSubmitting}
                onClick={handleUpdateLiquidify}
              >
                Update
              </Button>
            </Col>
          </Row>
        </>
      </Modal>

      {/* Ordinals yield and terms updation */}
      <Modal
        className="mt-60"
        title="Update ordinals"
        open={isOrdinalsUpdationModalOpen}
        onCancel={() => handleOrinalUpdationModal()}
        footer={null}
      >
        <>
          <Row align={"middle"} justify={"space-between"} className="mt-30">
            <Col xs={24}>
              <div>
                <input
                  value={ordinalUpdationData.yield}
                  className="input col-md-12 col-sm-12"
                  name="yield"
                  onChange={handleOrdinalUpdationChange}
                  placeholder="Enter yield"
                />
              </div>
            </Col>
          </Row>
          <Row className="mt-30">
            <Col xs={24}>
              <div>
                <input
                  value={ordinalUpdationData.terms}
                  className="input col-md-12 col-sm-12"
                  name="terms"
                  onChange={(e) => {
                    handleOrdinalUpdationChange(e);
                  }}
                  placeholder="Enter terms"
                />
              </div>
            </Col>
          </Row>
          <Row className="mt-4">
            <div>
              <div className="form-label">Choose domain type</div>
              <Radio.Group
                size="large"
                options={ordinalOptionsRadio}
                value={ordinalUpdationData.domain}
                optionType="button"
                buttonStyle="solid"
              />
            </div>
          </Row>
          <Row className="mt-30">
            <Col xs={24}>
              <Button
                block
                type="primary"
                loading={isSubmitting}
                onClick={handleUpdateLiquidify}
              >
                Update
              </Button>
            </Col>
          </Row>
        </>
      </Modal>

      {/* Ordinals collection */}
      <Modal
        width={"80%"}
        title="Add Ordinal Collection"
        open={isOrdinalsCollectionModalOpen}
        onCancel={() => handleOrdinalsCollectionModal()}
        footer={null}
      >
        <Row>
          <Col xs={24}>
            <div className="liq-col">
              <form
                className="form row"
                id="proposal-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddOrdinalCollection();
                }}
              >
                <div className="row justify-content-between mb-3">
                  <div className="col-md-12 col-sm-12 mt-4">
                    <div>
                      <span className="form-label">Collection name</span>
                    </div>
                    <input
                      value={ordinal.collectionName}
                      className="input col-md-12 col-sm-12 "
                      type="text"
                      name="collectionName"
                      onChange={handleOrdinalCollectionChange}
                      placeholder="Enter collection name!"
                      required
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="form-label">Content Type</div>
                  <input
                    value={ordinal.contentType}
                    className="input col-md-12 col-sm-12"
                    type="text"
                    name="contentType"
                    id="start_date"
                    onChange={handleOrdinalCollectionChange}
                    placeholder="Enter content type of the collection! eg(image/jpg)"
                    required
                  />
                </div>

                <div className="mt-4">
                  <div className="form-label">Website Link</div>
                  <input
                    value={ordinal.websiteLink}
                    className="input col-md-12 col-sm-12"
                    type="text"
                    name="websiteLink"
                    id="start_date"
                    onChange={handleOrdinalCollectionChange}
                    placeholder="Enter official website link of the canister!"
                    required
                  />
                </div>

                <div className="row justify-content-between">
                  <div className="col-md-5 col-sm-12 mt-4">
                    <div className="form-label">Terms</div>
                    <input
                      value={ordinal.terms}
                      className="input col-md-12 col-sm-12"
                      type="text"
                      name="terms"
                      onChange={handleOrdinalCollectionChange}
                      placeholder="Enter loan period in days!"
                      required
                    />
                  </div>
                  <div className="col-md-5 col-sm-12 mt-4">
                    <div className="form-label ">Yield</div>
                    <input
                      value={ordinal.yield}
                      className="input col-md-12 col-sm-12"
                      type="text"
                      name="yield"
                      id="end_date"
                      onChange={handleOrdinalCollectionChange}
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
                      value={ordinal.thumbnailURI}
                      className="input col-md-12 col-sm-12 "
                      type="text"
                      name="thumbnailURI"
                      onChange={handleOrdinalCollectionChange}
                      placeholder="Enter collection thumbnail URI"
                      required
                    />
                  </div>
                  <div className=" col-md-5 col-sm-12 mt-4">
                    <div>
                      <span className="form-label">Collection URI</span>
                    </div>
                    <input
                      value={ordinal.collectionURI}
                      className="input col-md-12 col-sm-12 "
                      type="text"
                      name="collectionURI"
                      onChange={handleOrdinalCollectionChange}
                      placeholder="Enter collection URI"
                      required
                    />
                  </div>
                </div>

                <textarea
                  rows={"4"}
                  className="input mt-4"
                  value={ordinal.description}
                  maxLength="200"
                  type="textarea"
                  name="description"
                  placeholder="Enter description of the collection!"
                  onChange={handleOrdinalCollectionChange}
                  required
                />

                <div className="mt-4">
                  <div className="form-label">Marketplace Link</div>
                  <input
                    value={ordinal.marketplaceLink}
                    className="input col-md-12 col-sm-12"
                    type="text"
                    name="marketplaceLink"
                    id="start_date"
                    onChange={handleOrdinalCollectionChange}
                    placeholder="Enter entrepot marketplace link of the canister! "
                    required
                  />
                </div>

                <div className="mt-4">
                  <div className="form-label">Twitter Link</div>
                  <input
                    value={ordinal.twitterLink}
                    className="input col-md-12 col-sm-12"
                    type="text"
                    name="twitterLink"
                    id="start_date"
                    onChange={handleOrdinalCollectionChange}
                    placeholder="Enter official twitter link of the canister!"
                    required
                  />
                </div>

                <div className="mt-4">
                  <div className="form-label">Choose site</div>
                  <Radio.Group
                    size="large"
                    options={ordinalOptionsRadio}
                    value={ordinalDomainType}
                    onChange={({ target: { value } }) =>
                      setOrdinalDomainType(value)
                    }
                    optionType="button"
                    buttonStyle="solid"
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
          </Col>
        </Row>
      </Modal>
    </>
  );
};
export default Cycles;
