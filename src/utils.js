const isDebug = true;

export function log(message, state) {
  if (isDebug) {
    console.log(message, state);
  }
}

export const sliceAddress = (address, slicePoint = 4) => (
  <>
    {address?.slice(0, slicePoint)}
    ...
    {address?.slice(address.length - slicePoint, address.length)}
  </>
);

export const sliceSentence = (address, slicePoint = 38) => (
  <>
    {address?.slice(0, slicePoint)}
    {address.length > slicePoint ? "..." : ""}
  </>
);

export const getDate_Time = (timestamp) => {
  const date = new Date(Number(timestamp));

  // Get the date components
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);

  // Get the time components
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);

  // Format the date and time
  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDateTime
}

export const getProposalStatus = (start, end, curr) => {
  if (start <= curr && curr <= end) {
    return "VOTING";
  } else if (start <= curr && end < curr) {
    return "SUCCESS";
  } else if (start > curr && end > curr) {
    return "CREATED";
  }
}
export const PRODUCTION = "PRODUCTION";
export const STAGING = "STAGING";
export const MYORDINALS = "MYORDINALS";
export const ROOTSTOCK = "ROOTSTOCK";

export const bunnyCanisterId = "xkbqi-2qaaa-aaaah-qbpqq-cai";
export const carrotCanisterId = "2qrsq-uiaaa-aaaai-aa3zq-cai";
export const daoCanisterId = "putek-zaaaa-aaaam-acfma-cai";
export const liquidifyCanisterId = "ibuvb-6aaaa-aaaam-ab6ea-cai";
export const liquidifyStagingCanisterId = "qv72z-diaaa-aaaam-adccq-cai";
export const myordinalsCanisterId = "hufzj-kyaaa-aaaam-abuqa-cai";
export const rootstockCanisterId = "rcx6h-gqaaa-aaaam-actwa-cai";
export const foundaryId = 5871;

export const principals = ["ifqqv-jwals-j3lfl-luoqi-gv6uf-vnvj3-ebenl-xap3u-qptsg-5puik-oae","3fz5m-ngf2v-kyozv-wsvxn-3duso-g6avx-nufx7-jbbqe-mrgzn-lavn3-sae","o2lff-sae6t-dvphr-tzeqm-uhynr-fnt5q-tks35-dh32k-rjapn-pedje-oae", "pjdcz-7l7yj-u4hoo-rmmp4-x64lt-u5oxc-vyu7n-af4oj-nxnv3-xjxqn-rae", "s2eqw-qdam5-z7usz-ncwba-aqcpe-z55wd-xegin-hrnof-puc5v-jhpad-pae", "gv5f4-dxfbq-hwrfa-rxiks-bjbtd-mjggm-mwgnx-xbzvy-oapr2-tkeuv-tae", "pjdcz-7l7yj-u4hoo-rmmp4-x64lt-u5oxc-vyu7n-af4oj-nxnv3-xjxqn-rae"]