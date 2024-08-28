import { Actor, HttpAgent } from "@dfinity/agent";
import { bunnyFactory, carrotFactory, daoFactory } from "../../IDL";
import { bunnyCanisterId, carrotCanisterId, daoCanisterId } from "../../utils";

const host = "https://icp-api.io";
export const bunnyAgent = async (isPlugActor) => {
  let bunnyActor;
  if (isPlugActor) {
    bunnyActor = await window.ic.plug.createActor({
      canisterId: bunnyCanisterId,
      interfaceFactory: bunnyFactory,
    });
  } else {
    const Agent = new HttpAgent({
      host,
    });
    bunnyActor = Actor.createActor(bunnyFactory, {
      agent: Agent,
      canisterId: bunnyCanisterId,
    });
  }
  return bunnyActor;
};

export const carrotAgent = async (isPlugActor) => {
  let carrotActor;
  if (isPlugActor) {
    carrotActor = await window.ic.plug.createActor({
      canisterId: carrotCanisterId,
      interfaceFactory: carrotFactory,
    });
  } else {
    const Agent = new HttpAgent({
      host,
    });
    carrotActor = Actor.createActor(carrotFactory, {
      agent: Agent,
      canisterId: carrotCanisterId,
    });
  }
  return carrotActor;
};

export const daoAgent = async (isPlugActor) => {
  let daoActor;
  if (isPlugActor) {
    daoActor = await window.ic.plug.createActor({
      canisterId: daoCanisterId,
      interfaceFactory: daoFactory,
    });
  } else {
    const Agent = new HttpAgent({
      host,
    });

    daoActor = Actor.createActor(daoFactory, {
      agent: Agent,
      canisterId: daoCanisterId,
    });
  }
  return daoActor;
};

export const agentCreator = async (factory, canisterId, isPlugActor) => {
  let daoActor;
  if (isPlugActor) {
    daoActor = await window.ic.plug.createActor({
      canisterId: canisterId,
      interfaceFactory: factory,
    });
  } else {
    const Agent = new HttpAgent({
      host,
    });

    daoActor = Actor.createActor(factory, {
      agent: Agent,
      canisterId: canisterId,
    });
  }
  return daoActor;
};
