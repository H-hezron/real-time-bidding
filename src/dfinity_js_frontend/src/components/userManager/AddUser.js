import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddUser = ({ save }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("");

  const isFormFilled = () => name && userType && email;

  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button onClick={handleShow} className="btn btn-success-outline">
        <i className="bi bi-plus "></i> Create User profile
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create User profile</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputName"
              label="User name"
              className="mb-3"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder="Enter name of user"
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="inputEmail"
              label="Email"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="userType"
              label="User Type"
              className="mb-3"
            >
              <select
                onChange={(e) => {
                  setUserType(e.target.value);
                }}
                className="form-select"
                aria-label="Default"
              >
                <option defaultValue="">select</option>
                <option value={"publisher"}>Publisher</option>
                <option value={"advertiser"}>Advertiser</option>
              </select>
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
                userType,
                name,
                email,
              });
              handleClose();
            }}
          >
            Save user
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

AddUser.propTypes = {
  save: PropTypes.func.isRequired,
};

export default AddUser;
