import { Principal } from "@dfinity/principal";
import { transferICP } from "./ledger";

export async function createAdvert(advert) {
  return window.canister.advertManager.addAdvert(advert);
}

export async function updateAdvert(advert) {
  return window.canister.advertManager.updateAdvert(advert);
}

// advertstatus;
export async function advertstatus(advert) {
  return window.canister.advertManager.advertstatus(advert);
}

// selectBid
export async function selectBid(bidId) {
  return window.canister.advertManager.selectBid(bidId);
}

// getBids;
export async function getBids() {
  return window.canister.advertManager.getBids();
}

// getAdvertBids
export async function getAdvertBids(advertId) {
  return window.canister.advertManager.getAdvertBids(advertId);
}

// getBid;
export async function getBid(bidId) {
  return window.canister.advertManager.getBid(bidId);
}

// addBid
export async function addBid(data) {
  return window.canister.advertManager.addBid(data);
}

// getUserAdverts
export async function getUserAdverts() {
  try {
    return await window.canister.advertManager.getUserAdverts();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

export async function getAdverts() {
  try {
    return await window.canister.advertManager.getAdverts();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

// getAddressFromPrincipal
export async function getAddressFromPrincipal(principal) {
  return await window.canister.advertManager.getAddressFromPrincipal(principal);
}

export async function payBid(advertId) {
  const advertManagerCanister = window.canister.advertManager;
  const orderResponse = await advertManagerCanister.createPurchasePay(advertId);

  console.log(orderResponse);
  const publisherPrincipal = Principal.from(orderResponse.Ok.publisher);
  const publisherAddress = await advertManagerCanister.getAddressFromPrincipal(
    publisherPrincipal
  );
  const block = await transferICP(
    publisherAddress,
    orderResponse.Ok.price,
    orderResponse.Ok.memo
  );
  await advertManagerCanister.completePurchase(
    publisherPrincipal,
    advertId,
    orderResponse.Ok.price,
    block,
    orderResponse.Ok.memo
  );
}
