import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddAdvert = ({ save }) => {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [adSlots, setAdSlots] = useState(0);
  const [audienceType, setAudienceType] = useState("");
  const isFormFilled = () => title && adSlots && audienceType && details;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        onClick={handleShow}
        className="btn btn-outline-success text-white"
      >
        <i className="bi bi-plus"></i> Add Advert
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Advert</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputTitle"
              label="Advert title"
              className="mb-3"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                placeholder="Enter title of advert"
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputAudienceType"
              label="audienceType"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="audienceType"
                onChange={(e) => {
                  setAudienceType(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel controlId="adSlots" label="AdSlots" className="mb-3">
              <Form.Control
                type="number"
                onChange={(e) => {
                  setAdSlots(e.target.value);
                }}
                placeholder="Enter available slots"
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputDetails"
              label="Details"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder="details"
                style={{ height: "80px" }}
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
              save({
                title,
                details,
                adSlots,
                audienceType,
              });
              handleClose();
            }}
          >
            Save advert
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

AddAdvert.propTypes = {
  save: PropTypes.func.isRequired,
};

export default AddAdvert;
