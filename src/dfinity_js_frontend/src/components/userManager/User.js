import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Stack, Badge } from "react-bootstrap";
import { Principal } from "@dfinity/principal";

const User = ({ user }) => {
  const { id, name, adverts, email, usertype, principal } = user;

  console.log(user);

  return (
    <Col key={id}>
      <Card className=" h-100">
        <Card.Body className="d-flex  flex-column text-start">
          <Stack className="d-flex flex-row justify-content-between align-items-center gap-2">
            <Card.Title>Name: {name}</Card.Title>
          </Stack>
          <Card.Text>Id: {id}</Card.Text>
          <Card.Text className="flex-grow-1 ">Email: {email}</Card.Text>
          <Card.Text className="flex-grow-1 ">UserType: {usertype}</Card.Text>
          <Card.Text className="flex-grow-1 ">
            Principal: {Principal.from(principal).toText()}
          </Card.Text>
          <Card.Text className="flex-grow-1 ">
            AdvertIds:{" "}
            {adverts.map((skill, index) => {
              return (
                <Badge key={index} bg="secondary" className="ms-auto">
                  {skill}
                </Badge>
              );
            })}
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

User.propTypes = {
  user: PropTypes.instanceOf(Object).isRequired,
};

export default User;
