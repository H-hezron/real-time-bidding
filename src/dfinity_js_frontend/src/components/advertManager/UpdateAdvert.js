import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const UpdateAdvert = ({ advert, save }) => {
  const [details, setDetails] = useState("");

  const isFormFilled = () => details;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <button
        onClick={handleShow}
        className="btn btn-outline-info rounded-pill"
        style={{ width: "8rem" }}
      >
        Update
      </button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Advert</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
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
                id: advert.id,
                details,
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

UpdateAdvert.propTypes = {
  save: PropTypes.func.isRequired,
};

export default UpdateAdvert;
