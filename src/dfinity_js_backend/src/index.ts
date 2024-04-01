// Importing necessary libraries
import {
  query,
  update,
  text,
  Record,
  StableBTreeMap,
  Variant,
  Vec,
  Ok,
  Err,
  ic,
  Opt,
  None,
  Some,
  Principal,
  Duration,
  nat64,
  bool,
  Result,
  Canister,
} from "azle";
import {
  Ledger,
  binaryAddressFromPrincipal,
  hexAddressFromPrincipal,
} from "azle/canisters/ledger";
//@ts-ignore
import { hashCode } from "hashcode";
// Importing UUID v4 for generating unique identifiers
// @ts-ignore
import { v4 as uuidv4 } from "uuid";

// Define Advert record
const Advert = Record({
  id: text,
  title: text,
  details: text,
  audienceType: text,
  publisher: Principal,
  advertiser: Opt(text),
  budget: nat64,
  adSlots: nat64,
  createdAt: text,
});

// Define payload structure for creating an advert
const AdvertPayload = Record({
  title: text,
  details: text,
  audienceType: text,
  adSlots: nat64,
});

// Define payload structure for updating an advert
const UpdateAdvertPayload = Record({
  id: text,
  details: text,
});

// Define User record
const User = Record({
  id: text,
  principal: Principal,
  name: text,
  email: text,
  userType: text,
  adverts: Vec(text),
});

// Define payload structure for creating a user
const UserPayload = Record({
  name: text,
  email: text,
  userType: text,
});

// Define payload structure for updating a user
const UpdateUserPayload = Record({
  id: text,
  name: text,
  email: text,
  userType: text,
});

// Define ReservePurchase record
const ReservePurchase = Record({
  price: nat64,
  status: text,
  publisher: Principal,
  paid_at_block: Opt(nat64),
  memo: nat64,
});

// Define Bid record
const Bid = Record({
  id: text,
  advertId: text,
  amount: nat64,
  adSlots: nat64,
  details: text,
  advertiserId: text,
  status: text,
});

// Define payload structure for creating a bid
const BidPayload = Record({
  advertId: text,
  amount: nat64,
  adSlots: nat64,
  details: text,
});

// Define variant representing different error types
const ErrorType = Variant({
  NotFound: text,
  InvalidPayload: text,
  PurchaseFailed: text,
  PurchaseCompleted: text,
});

// Define advertsStorage
const advertsStorage = StableBTreeMap(0, text, Advert);
const bidsStorage = StableBTreeMap(2, text, Bid);
const usersStorage = StableBTreeMap(3, text, User);
const pendingPurchases = StableBTreeMap(4, nat64, ReservePurchase);
const persistedPurchases = StableBTreeMap(5, Principal, ReservePurchase);

const PURCHASE_RESERVATION_PERIOD = 120n; // reservation period in seconds

const icpCanister = Ledger(Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"));

// Exporting default Canister module
export default Canister({
  // Function to add an advert
  addAdvert: update([AdvertPayload], Result(Advert, ErrorType), (payload) => {
    // Check if the payload is a valid object
    if (typeof payload !== "object" || Object.keys(payload).length === 0) {
      return Err({ InvalidPayload: "invalid payload" });
    }
    // Create an advert with a unique id generated using UUID v4
    const advert = {
      id: uuidv4(),
      status: "pending",
      publisher: ic.caller(),
      createdAt: new Date().toISOString(),
      advertiser: None,
      budget: 0n,
      updatedAt: None,
      ...payload,
    };

    // add advert to the user
    // get user with the same principal
    const userOpt = usersStorage.values().filter((user) => {
      return user.principal.toText() === ic.caller().toText();
    });

    // add advert to the user
    const user = userOpt[0];
    const updatedUser = {
      ...user,
      adverts: [...user.adverts, advert.id],
    };
    usersStorage.insert(user.id, updatedUser);

    // Insert the advert into the advertsStorage
    advertsStorage.insert(advert.id, advert);
    return Ok(advert);
  }),

  // get all adverts
  getAdverts: query([], Vec(Advert), () => {
    const adverts = advertsStorage.values();
    // remove advert with 0 adSlots
    return adverts.filter((advert) => {
      return advert.adSlots > 0;
    });
  }),

  // Function get advert by id
  getAdvert: query([text], Result(Advert, ErrorType), (id) => {
    const advertOpt = advertsStorage.get(id);
    if ("None" in advertOpt) {
      return Err({ NotFound: `advert with id=${id} not found` });
    }
    return Ok(advertOpt.Some);
  }),

  // Function to update an advert
  updateAdvert: update(
    [UpdateAdvertPayload],
    Result(Advert, ErrorType),
    (payload) => {
      const advertOpt = advertsStorage.get(payload.id);
      if ("None" in advertOpt) {
        return Err({ NotFound: `advert with id=${payload.id} not found` });
      }
      const advert = advertOpt.Some;
      const updatedAdvert = {
        ...advert,
        ...payload,
      };
      advertsStorage.insert(advert.id, updatedAdvert);
      return Ok(updatedAdvert);
    }
  ),

  // Function to add a bid
  addBid: update([BidPayload], Result(Bid, ErrorType), (payload) => {
    // Check if the payload is a valid object
    if (typeof payload !== "object" || Object.keys(payload).length === 0) {
      return Err({ InvalidPayload: "invalid payload" });
    }
    const advertisers = usersStorage.values().filter((user) => {
      return user.principal.toText() === ic.caller().toText();
    });

    const advertiser = advertisers[0];
    // Create a bid with a unique id generated using UUID v4
    const bid = {
      id: uuidv4(),
      advertiserId: advertiser.id,
      status: "pending",
      ...payload,
    };
    // Insert the bid into the bidsStorage
    bidsStorage.insert(bid.id, bid);
    return Ok(bid);
  }),

  // get all bids
  getBids: query([], Vec(Bid), () => {
    return bidsStorage.values();
  }),

  // getOrderBids
  getAdvertBids: query([text], Vec(Bid), (advertId) => {
    return bidsStorage.values().filter((bid) => {
      return bid.advertId === advertId;
    });
  }),

  // Function get bid for function
  getBid: query([text], Result(Bid, ErrorType), (id) => {
    const bidOpt = bidsStorage.get(id);
    if ("None" in bidOpt) {
      return Err({ NotFound: `bid with id=${id} not found` });
    }
    return Ok(bidOpt.Some);
  }),

  // Function to update advert with selected advertiserId and status and budget
  selectBid: update([text], Result(Advert, ErrorType), (bidId) => {
    const bidOpt = bidsStorage.get(bidId);
    if ("None" in bidOpt) {
      return Err({ NotFound: `bid with id=${bidId} not found` });
    }
    const bid = bidOpt.Some;

    const advertOpt = advertsStorage.get(bid.advertId);
    if ("None" in advertOpt) {
      return Err({ NotFound: `advert with id=${bid.advertId} not found` });
    }

    bid.status = "selected";

    bidsStorage.insert(bid.id, bid);

    const advert = advertOpt.Some;
    advert.advertiser = Some(bid.advertiserId);
    advert.budget = bid.amount;
    advertsStorage.insert(advert.id, advert);
    return Ok(advert);
  }),

  // Function to add a user
  addUser: update([UserPayload], Result(User, ErrorType), (payload) => {
    // Check if the payload is a valid object
    if (typeof payload !== "object" || Object.keys(payload).length === 0) {
      return Err({ NotFound: "invalid payload" });
    }
    // Create a user with a unique id generated using UUID v4
    const user = {
      id: uuidv4(),
      principal: ic.caller(),
      adverts: [],
      ...payload,
    };
    // Insert the user into the usersStorage
    usersStorage.insert(user.id, user);
    return Ok(user);
  }),

  // get all users
  getUsers: query([], Vec(User), () => {
    return usersStorage.values();
  }),

  // Function get user by id
  getUser: query([text], Result(User, ErrorType), (id) => {
    const userOpt = usersStorage.get(id);
    if ("None" in userOpt) {
      return Err({ NotFound: `user with id=${id} not found` });
    }
    const user = userOpt.Some;
    return Ok(user);
  }),

  // get user by owner
  getUserByOwner: query([], Result(User, ErrorType), () => {
    const principal = ic.caller();
    const userOpt = usersStorage.values().filter((user) => {
      return user.principal.toText() === principal.toText();
    });
    if (userOpt.length === 0) {
      return Err({ NotFound: `user with principal=${principal} not found` });
    }
    return Ok(userOpt[0]);
  }),

  // get adverts reserved by a user
  getUserAdverts: query([], Vec(Advert), () => {
    const userOpt = usersStorage.values().filter((user) => {
      return user.principal.toText() === ic.caller().toText();
    });
    if ("None" in userOpt) {
      return [];
    }
    const user = userOpt[0];
    return advertsStorage.values().filter((advert) => {
      return user.adverts.includes(advert.id);
    });
  }),

  // Function to update a user
  updateUser: update(
    [UpdateUserPayload],
    Result(User, ErrorType),
    (payload) => {
      const userOpt = usersStorage.get(payload.id);
      if ("None" in userOpt) {
        return Err({ NotFound: `user with id=${payload.id} not found` });
      }
      const user = userOpt.Some;
      const updatedUser = {
        ...user,
        ...payload,
      };
      usersStorage.insert(user.id, updatedUser);
      return Ok(updatedUser);
    }
  ),

  // Function to create a purchase pay
  createPurchasePay: update(
    [text],
    Result(ReservePurchase, ErrorType),
    (advertId) => {
      const advertOpt = advertsStorage.get(advertId);
      const bidOpt = bidsStorage.values().filter((bid) => {
        return bid.advertId === advertId && bid.status === "selected";
      });
      if ("None" in advertOpt) {
        return Err({
          NotFound: `cannot reserve Purchase: Advert  with id=${advertId} not available`,
        });
      }
      const advert = advertOpt.Some;
      const bid = bidOpt[0];

      const publisherPrincipal = advert.publisher;
      // get publisher
      const publisherOpt = usersStorage.values().filter((user) => {
        return user.principal.toText() === publisherPrincipal.toText();
      });

      const publisher = publisherOpt[0].principal;

      const reservePurchase = {
        price: advert.budget,
        status: "pending",
        publisher: publisher,
        paid_at_block: None,
        memo: generateCorrelationId(advertId),
      };

      // reduce the available units
      const updatedAdvert = {
        ...advert,
        status: "completed",
        advertiser: None,
        budget: 0n,
        adSlots: advert.adSlots - bid.adSlots,
      };

      const soldAdvert = {
        ...advert,
        id: uuidv4(),
        status: "pending",
        adSlots: bid.adSlots,
        publisher: ic.caller(),
        advertiser: None,
        budget: 0n,
        createdAt: new Date().toISOString(),
      };

      // add advert to the user
      // get user with the same principal
      const userOpt = usersStorage.values().filter((user) => {
        return user.principal.toText() === ic.caller().toText();
      });

      // add advert to the user
      const user = userOpt[0];
      const updatedUser = {
        ...user,
        adverts: [...user.adverts, soldAdvert.id],
      };

      advert.updatedAt = Some(new Date().toISOString());

      advertsStorage.insert(advert.id, updatedAdvert);
      advertsStorage.insert(soldAdvert.id, soldAdvert);

      usersStorage.insert(user.id, updatedUser);

      pendingPurchases.insert(reservePurchase.memo, reservePurchase);
      discardByTimeout(reservePurchase.memo, PURCHASE_RESERVATION_PERIOD);
      return Ok(reservePurchase);
    }
  ),

  // Function to complete a purchase
  completePurchase: update(
    [Principal, text, nat64, nat64, nat64],
    Result(ReservePurchase, ErrorType),
    async (reservor, advertId, reservePrice, block, memo) => {
      const purchaseVerified = await verifyPurchaseInternal(
        reservor,
        reservePrice,
        block,
        memo
      );
      if (!purchaseVerified) {
        return Err({
          NotFound: `cannot complete the reserve: cannot verify the purchase, memo=${memo}`,
        });
      }
      const pendingReservePayOpt = pendingPurchases.remove(memo);
      if ("None" in pendingReservePayOpt) {
        return Err({
          NotFound: `cannot complete the reserve: there is no pending reserve with id=${advertId}`,
        });
      }
      const reservedPay = pendingReservePayOpt.Some;
      const updatedReservePurchase = {
        ...reservedPay,
        status: "completed",
        paid_at_block: Some(block),
      };
      const advertOpt = advertsStorage.get(advertId);
      if ("None" in advertOpt) {
        throw Error(`Book with id=${advertId} not found`);
      }
      const advert = advertOpt.Some;
      advertsStorage.insert(advert.id, advert);
      persistedPurchases.insert(ic.caller(), updatedReservePurchase);
      return Ok(updatedReservePurchase);
    }
  ),

  // Function to verify a purchase
  verifyPurchase: query(
    [Principal, nat64, nat64, nat64],
    bool,
    async (receiver, amount, block, memo) => {
      return await verifyPurchaseInternal(receiver, amount, block, memo);
    }
  ),

  /*
        a helper function to get address from the principal
        the address is later used in the transfer method
    */
  getAddressFromPrincipal: query([Principal], text, (principal) => {
    return hexAddressFromPrincipal(principal, 0);
  }),
});

/*
    a hash function that is used to generate correlation ids for adverts.
    also, we use that in the verifyPurchase function where we check if the used has actually paid the advert
*/
function hash(input: any): nat64 {
  return BigInt(Math.abs(hashCode().value(input)));
}

// A workaround to make the uuid package work with Azle
globalThis.crypto = {
  // @ts-ignore
  getRandomValues: () => {
    let array = new Uint8Array(32);
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  },
};

// Helper function to generate correlation id for a purchase
function generateCorrelationId(advertId: text): nat64 {
  const correlationId = `${advertId}_${ic.caller().toText()}_${ic.time()}`;
  return hash(correlationId);
}

// Helper function to discard purchase by timeout
function discardByTimeout(memo: nat64, delay: Duration) {
  ic.setTimer(delay, () => {
    const advert = pendingPurchases.remove(memo);
    console.log(`Reserve discarded ${advert}`);
  });
}

// Internal function to verify a purchase
async function verifyPurchaseInternal(
  receiver: Principal,
  amount: nat64,
  block: nat64,
  memo: nat64
): Promise<bool> {
  const blockData = await ic.call(icpCanister.query_blocks, {
    args: [{ start: block, length: 1n }],
  });
  const tx = blockData.blocks.find((block) => {
    if ("None" in block.transaction.operation) {
      return false;
    }
    const operation = block.transaction.operation.Some;
    const senderAddress = binaryAddressFromPrincipal(ic.caller(), 0);
    const receiverAddress = binaryAddressFromPrincipal(receiver, 0);
    return (
      block.transaction.memo === memo &&
      hash(senderAddress) === hash(operation.Transfer?.from) &&
      hash(receiverAddress) === hash(operation.Transfer?.to) &&
      amount === operation.Transfer?.amount.e8s
    );
  });
  return tx ? true : false;
}
