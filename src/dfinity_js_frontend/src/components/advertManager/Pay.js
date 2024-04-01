import React, { useState } from "react";
import { Card, Badge, Button, Modal } from "react-bootstrap";
import { payBid } from "../../utils/advertManager";
import Loader from "../utils/Loader";
import { toast } from "react-toastify";
import { NotificationSuccess, NotificationError } from "../utils/Notifications";

function Pay({ advert }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //  function to payBid book
  const bidPayment = async () => {
    try {
      setLoading(true);
      payBid(advert.id).then((resp) => {
        toast(
          <NotificationSuccess text="Bid pay successfull, refresh to see new balance" />
        );
      });
    } catch (error) {
      console.log("failed to pay bid, check your ICP tokens");
      console.log(error);
      toast(
        <NotificationError text="Failed to pay bid. plese check your ICP tokens" />
      );
    } finally {
      setLoading(false);
    }
  };

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
            Pay Bid
          </Button>
          <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>Pay Won Bid</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Card className=" h-100">
                <Card.Header>
                  <Badge bg="secondary" className="ms-auto">
                    Advert Id: {advert.id}
                  </Badge>
                </Card.Header>
                <Card.Body className="d-flex  flex-column ">
                  <Card.Title>Title: {advert.title}</Card.Title>
                  <Card.Text className="flex-grow-1 ">
                    details: {advert.details}
                  </Card.Text>
                  <Card.Text className="flex-grow-1 ">
                    amount: {Number(advert.budget / BigInt(10 ** 8))}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Modal.Body>
            <Modal.Footer>
              <Button
                onClick={() => {
                  bidPayment();
                  handleClose();
                }}
                variant="outline-dark"
                className="w-100 py-3"
              >
                Complete Payment
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
}

export default Pay;
