import { lazy } from "react";

export const routes = [
    {
        name: "Governance",
        path: "/",
        component: lazy(() => import("../pages/governance")),
    },
    {
        name: "Proposals",
        path: "/proposals",
        component: lazy(() => import("../pages/proposals")),
    },
    {
        name: "Proposal Details",
        path: "/proposal/:queId",
        component: lazy(() => import("../pages/proposalDetails")),
    },
    {
        name: "Create Proposal",
        path: "/proposal/create",
        component: lazy(() => import("../pages/createProposal")),
    },
    {
        name: "Cycles",
        path: "/cycles",
        component: lazy(() => import("../pages/cycles")),
    },
]
