import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const UpdateUser = ({ user, save }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [usertype, setUserType] = useState("");
  const [bio, setBio] = useState("");

  const isFormFilled = () => name && bio && usertype && email;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <button
        onClick={handleShow}
        className="btn btn-outline-warning rounded-pill"
        style={{ width: "11rem" }}
      >
        <i className="bi bi-pencil-square "></i> Update Profile
      </button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New User</Modal.Title>
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
              controlId="inputUserType"
              label="UserType"
              className="mb-3"
            >
              <Form.Control
                type="number"
                placeholder="UserType"
                onChange={(e) => {
                  setUserType(e.target.value);
                }}
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
            <FloatingLabel controlId="inputBio" label="Bio" className="mb-3">
              <Form.Control
                as="textarea"
                style={{ height: "80px" }}
                onChange={(e) => {
                  setBio(e.target.value);
                }}
                placeholder="Bio"
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
                id: user.id,
                name,
                usertype,
                email,
                bio,
              });
              handleClose();
            }}
          >
            Save Updates
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

UpdateUser.propTypes = {
  save: PropTypes.func.isRequired,
};

export default UpdateUser;
