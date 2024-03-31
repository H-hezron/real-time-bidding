import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form } from "react-bootstrap";
import { getAdvertBids } from "../../utils/advertManager";
import Loader from "../utils/Loader";
import { getUserByOwner } from "../../utils/userManager";

function SelectBid({ advert, save }) {
  const [show, setShow] = useState(false);
  const [bids, setBids] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  const { id, title } = advert;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // function to get the list of users
  const getUserOwner = useCallback(async () => {
    try {
      setLoading(true);
      getUserByOwner().then((resp) => {
        setUser(resp.Ok);
        setLoading(false);
      });
    } catch (error) {
      console.log({ error });
      setLoading(false);
    }
  });

  // fetch all bids to bids
  const fetchBids = useCallback(async () => {
    try {
      setLoading(true);
      getAdvertBids(id).then((resp) => {
        const bids = resp;
        console.log("first", bids);
        const sortBids = bids?.sort(
          (a, b) => Number(b.amount) - Number(a.amount)
        );
        console.log("second", sortBids);
        setBids(sortBids);
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBids();
    getUserOwner();
  }, [fetchBids]);

  console.log(user, "user");

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Button
            onClick={handleShow}
            variant="outline-dark"
            className="w-100 py-3"
          >
            View Bids
          </Button>
          <Modal
            size="lg"
            className="w-[50%]"
            show={show}
            onHide={handleClose}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Bids for {title}</Modal.Title>
            </Modal.Header>
            <Form>
              <Modal.Body>
                <table className="table">
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col">Advertiser</th>
                      <th scope="col">Details</th>
                      <th scope="col">Ad Slots</th>
                      <th scope="col">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bids?.map((bid, index) => (
                      <tr key={index}>
                        <td>{bid.advertiserId}</td>
                        <td>{bid.details}</td>
                        <td>{Number(bid.adSlots)}</td>
                        <td>{Number(bid.amount) / 10 ** 8} ICP</td>
                        <td>
                          {user?.adverts &&
                            user?.adverts.includes(bid.advertId) && (
                              <Button
                                variant="dark"
                                onClick={() => {
                                  save(bid.id);
                                  handleClose();
                                }}
                              >
                                Select Bid
                              </Button>
                            )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Modal.Body>
            </Form>
            <Modal.Footer>
              <Button variant="outline-secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
}

SelectBid.propTypes = {
  advert: PropTypes.object.isRequired,
  save: PropTypes.func.isRequired,
};

export default SelectBid;
