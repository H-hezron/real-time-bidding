import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddBid = ({ advertId, save }) => {
  const [amount, setAmount] = useState([]);
  const [details, setDetails] = useState("");
  const [adSlots, setAdSlots] = useState(0);

  const isFormFilled = () => details && amount;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        onClick={handleShow}
        className="btn btn-outline-success text-white"
      >
        <i className="bi bi-plus "></i> Bid
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Bid</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputAmount"
              label="Amount"
              className="mb-3"
            >
              <Form.Control
                type="number"
                placeholder=" amount"
                onChange={(e) => {
                  setAmount(e.target.value.split(","));
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputAdSlots"
              label="AdSlots"
              className="mb-3"
            >
              <Form.Control
                type="number"
                placeholder="AdSlots"
                onChange={(e) => {
                  setAdSlots(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputDetails"
              label="Details"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Details"
                onChange={(e) => {
                  setDetails(e.target.value);
                }}
              />
            </FloatingLabel>
          </Modal.Body>
        </Form>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="dark"
            disabled={!isFormFilled()}
            onClick={() => {
              save({ advertId, details, amount, adSlots });
              handleClose();
            }}
          >
            Save bid
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

AddBid.propTypes = {
  save: PropTypes.func.isRequired,
};

export default AddBid;
