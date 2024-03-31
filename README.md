# Decentralized Advertiser

Created a decentralized RTB platform for digital advertising, where advertisers and publishers can buy and sell ad inventory directly using cryptocurrency, eliminating intermediaries and reducing fraud and inefficiencies.

## Data Structures

The canister uses several Azle data structures to store information:

* `StableBTreeMap`: This is a self-balancing tree used to store adverts by user ID, user information, bids, and user information.
* `Vec`: This is a vector data structure used to store lists of advert IDs, user IDs, and bid IDs within the corresponding data structures.
* `Option`: This is used to represent optional values, which can be either `Some(value)` or `None`.

## Canister Functions

The canister provides a variety of functions for managing adverts, users, bids, and purchases:

**Data Storage:**

* `advertsStorage`: Stores adverts mapped by their unique IDs (`id`).
* `bidsStorage`: Stores bids mapped by their unique IDs (`id`).
* `usersStorage`: Stores users mapped by their unique IDs (`id`).
* `pendingPurchases`: Stores temporary reservation details for purchases keyed by a correlation ID (`memo`).
* `persistedPurchases`: Stores completed purchase details for users keyed by their principal.

**Advert Management:**

* `addAdvert`: Creates a new advert with a unique ID, associating it with the caller and storing it.
* `getAdverts`: Retrieves all adverts currently stored.
* `getAdvert`: Retrieves an advert by its specific ID.
* `updateAdvert`: Updates an existing advert based on its ID.

**Bid Management:**

* `addBid`: Creates a new bid with a unique ID, associating it with the caller and storing it.
* `getBids`: Retrieves all bids currently stored.
* `getAdvertBids`: Retrieves all bids for a specific advert based on its ID.
* `getBid`: Retrieves a bid by its specific ID.
* `selectBid`: Updates an advert with the details of the selected bid (publisher, budget).

**User Management:**

* `addUser`: Creates a new user with a unique ID and stores it.
* `getUsers`: Retrieves all users currently stored.
* `getUser`: Retrieves a user by their specific ID.
* `getUserByOwner`: Retrieves a user based on the caller's principal.
* `getUserAdverts`: Retrieves all adverts associated with a specific user based on their ID.
* `updateUser`: Updates an existing user based on their ID.

**Purchase Management:**

* `createPurchasePay`: Initiates a purchase payment process for an advert, reserving it and creating a temporary record.
* `completePurchase`: Verifies and completes a reserved purchase, updating the advert and user data.
* `verifyPurchase`: Helper function to verify a purchase payment from the user's perspective.

**Utility Functions:**

* `getAddressFromPrincipal`: Retrieves the address associated with a principal (used for transfers).
* `generateCorrelationId`: Generates a unique ID for purchase reservations.
* `discardByTimeout`: Schedules a timer to discard a pending purchase if not completed within a set time.
* `verifyPurchaseInternal`: Verifies a purchase payment by checking transaction details on the blockchain.

## Additional Notes

* The code utilizes the `ic` object to interact with the Dfinity network, including calling other canisters and managing timers.
* The code implements a mechanism to discard pending purchases after a certain timeout period.
* The `uuid` package is used to generate unique IDs for adverts, users, and bids.

## Things to be explained in the course

1. What is Ledger? More details here: <https://internetcomputer.org/docs/current/developer-docs/integrations/ledger/>
2. What is Internet Identity? More details here: <https://internetcomputer.org/internet-identity>
3. What is Principal, Identity, Address? <https://internetcomputer.org/internet-identity> | <https://yumieventManager.medium.com/whats-the-difference-between-principal-id-and-account-id-3c908afdc1f9>
4. Canister-to-canister communication and how multi-canister development is done? <https://medium.com/icp-league/explore-backend-multi-canister-development-on-ic-680064b06320>

## How to deploy canisters implemented in the course

### Ledger canister

`./deploy-local-ledger.sh` - deploys a local Ledger canister. IC works differently when run locally so there is no default network token available and you have to deploy it yourself. Remember that it's not a token like ERC-20 in Ethereum, it's a native token for ICP, just deployed separately.
This canister is described in the `dfx.json`:

```markdown
 "ledger_canister": {
   "type": "custom",
   "candid": "https://raw.githubuseradvert.com/dfinity/ic/928caf66c35627efe407006230beee60ad38f090/rs/rosetta-api/icp_ledger/ledger.did",
   "wasm": "https://download.dfinity.systems/ic/928caf66c35627efe407006230beee60ad38f090/canisters/ledger-canister.wasm.gz",
   "remote": {
     "id": {
       "ic": "ryjl3-tyaaa-aaaaa-aaaba-cai"
     }
   }
 }
```

`remote.id.ic` - that is the principal of the Ledger canister and it will be available by this principal when you work with the ledger.

Also, in the scope of this script, a minter identity is created which can be used for minting tokens
for the testing purposes.
Additionally, the default identity is pre-populated with 1000_000_000_000 e8s which is equal to 10_000 * 10**8 ICP.
The decimals value for ICP is 10**8.

List identities:
`dfx identity list`

Switch to the minter identity:
`dfx identity use minter`

Transfer ICP:
`dfx ledger transfer <ADDRESS>  --memo 0 --icp 100 --fee 0`
where:

* `--memo` is some correlation id that can be set to identify some particular transactions (we use that in the eventManager canister).
* `--icp` is the transfer amount
* `--fee` is the transaction fee. In this case it's 0 because we make this transfer as the minter idenity thus this transaction is of type MINT, not TRANSFER.
* `<ADDRESS>` is the address of the recipient. To get the address from the principal, you can get it directly from the wallet icon top right or use the helper function from the eventManager canister - `getAddressFromPrincipal(principal: Principal)`, it can be called via the Candid UI.

### Internet identity canister

`dfx deploy internet_identity` - that is the canister that handles the authentication flow. Once it's deployed, the `js-agent` library will be talking to it to register identities. There is UI that acts as a wallet where you can select existing identities
or create a new one.

### eventManager canister

`dfx deploy dfinity_js_backend` - deploys the eventManager canister where the business logic is implemented.
Basically, it implements functions like add, view, update, delete, and buy events + a set of helper functions.

Do not forget to run `dfx generate dfinity_js_backend` anytime you add/remove functions in the canister or when you change the signatures.
Otherwise, these changes won't be reflected in IDL's and won't work when called using the JS agent.

### eventManager frontend canister

`dfx deploy dfinity_js_frontend` - deployes the frontend app for the `dfinity_js_backend` canister on IC.
