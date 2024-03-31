import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import Advert from "./Advert";
import Loader from "../utils/Loader";
import { Row, Button } from "react-bootstrap";

import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import {
  getAdverts as getAdvertList,
  createAdvert,
  payBid,
  updateAdvert,
  getUserAdverts,
  selectBid,
  addBid,
} from "../../utils/advertManager";
import AddAdvert from "./AddAdvert";
import { createUser, getUserByOwner } from "../../utils/userManager";
import AddUser from "../userManager/AddUser";

const Adverts = () => {
  const [adverts, setAdverts] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  // function to get the list of adverts
  const getAdverts = useCallback(async () => {
    try {
      console.log("geter");
      setLoading(true);
      setAdverts(await getAdvertList());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  // function to get user  advert
  const getOwnAdverts = useCallback(async () => {
    try {
      console.log("geter");
      setLoading(true);
      setAdverts(await getUserAdverts());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  // function to get the list of users
  const getUserOwner = useCallback(async () => {
    try {
      setLoading(true);
      getUserByOwner().then((resp) => {
        setUser(resp.Ok);
      });
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  const addAdvert = async (data) => {
    console.log("adder");
    try {
      setLoading(true);
      data.adSlots = parseInt(data.adSlots, 10);
      createAdvert(data).then((resp) => {
        getAdverts();
        toast(<NotificationSuccess text="Advert added successfully." />);
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a advert." />);
    } finally {
      setLoading(false);
    }
  };

  //  function to payBid book
  const bidPayment = async (advertId, bidId) => {
    try {
      setLoading(true);
      payBid(advertId, bidId).then((resp) => {
        getAdverts();
        toast(
          <NotificationSuccess text="Advert payBid successfull, refresh to see new balance" />
        );
      });
    } catch (error) {
      console.log(
        "failed to payBid advert, check that you have enough ICP tokens"
      );
      console.log(error);
      toast(
        <NotificationError text="Failed to payBid advert. plese check that you have enough ICP tokens" />
      );
    } finally {
      setLoading(false);
    }
  };

  // addBid
  const newBid = async (data) => {
    try {
      setLoading(true);
      data.amount = parseInt(data.amount, 10) * 10 ** 8;
      data.adSlots = parseInt(data.adSlots, 10);
      addBid(data).then((resp) => {
        getAdverts();
        toast(<NotificationSuccess text="Bid added successfully." />);
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to add a bid." />);
    } finally {
      setLoading(false);
    }
  };

  // selectBid
  const bidSelect = async (bidId) => {
    try {
      setLoading(true);
      selectBid(bidId).then((resp) => {
        getAdverts();
        console.log(resp.Ok);
        bidPayment(resp.Ok.id, bidId);
        toast(<NotificationSuccess text="Bid selected successfully." />);
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to select a bid." />);
    } finally {
      setLoading(false);
    }
  };

  const update = async (data) => {
    try {
      setLoading(true);
      data.budget = parseInt(data.budget, 10) * 10 ** 8;
      updateAdvert(data).then((resp) => {
        getAdverts();
        toast(<NotificationSuccess text="Advert update successfull." />);
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to update a advert." />);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (data) => {
    try {
      setLoading(true);
      createUser(data).then((resp) => {
        getUserOwner();
      });
      toast(<NotificationSuccess text="User added successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a user." />);
    } finally {
      setLoading(false);
    }
  };

  console.log(adverts);

  useEffect(() => {
    getAdverts();
    getUserOwner();
  }, []);

  console.log(user);

  return (
    <>
      {!loading ? (
        !user?.name ? (
          <AddUser save={addUser} />
        ) : (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="fs-4 fw-bold mb-0">Adverts Listings</h1>
              {/* get user payBidd advert */}
              <Button
                onClick={getOwnAdverts}
                className="btn btn-primary-outline text"
              >
                My Adverts
              </Button>
              <AddAdvert save={addAdvert} />
            </div>
            <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
              {adverts.map((_advert, index) => (
                <Advert
                  key={index}
                  advert={{
                    ..._advert,
                  }}
                  update={update}
                  selectBid={bidSelect}
                  addBid={newBid}
                />
              ))}
            </Row>
          </div>
        )
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Adverts;
