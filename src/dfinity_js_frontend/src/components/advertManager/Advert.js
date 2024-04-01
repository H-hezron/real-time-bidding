import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Badge, Stack, Button } from "react-bootstrap";
import { Principal } from "@dfinity/principal";
import UpdateAdvert from "./UpdateAdvert";
import AddBid from "./AddBid";
import SelectBid from "./AdvertBids";
import Pay from "./Pay";

const Advert = ({ advert, user, update, selectBid, addBid }) => {
  const {
    id,
    title,
    details,
    audienceType,
    createdAt,
    adSlots,
    publisher,
    advertiser,
    budget,
  } = advert;

  const intBudget = Number(budget / BigInt(10 ** 8));

  const principal = window.auth.principalText;
  const isUsersAdvert = Principal.from(publisher).toText() === principal;

  return (
    <Col key={id}>
      <Card className=" h-100">
        <Card.Header>
          <span className="font-monospace text-secondary">
            {Principal.from(publisher).toText()}
          </span>
          {advertiser.length > 0 && user.id === advertiser[0] && (
            <Pay advert={advert} />
          )}
          <div className="d-flex align-items-center justify-content-between mt-2 gap-2">
            {advertiser.length > 0 && (
              <Badge bg="secondary" className="ms-auto">
                Budget: {intBudget} ICP
              </Badge>
            )}
            <Badge bg="secondary" className="ms-auto">
              {Number(adSlots)} Slots
            </Badge>
            {isUsersAdvert ? (
              <UpdateAdvert advert={advert} save={update} />
            ) : (
              <AddBid advertId={id} save={addBid} />
            )}
          </div>
        </Card.Header>
        <Card.Body className="d-flex  flex-column ">
          <Card.Title>{title}</Card.Title>
          <Card.Text className="flex-grow-1 ">details: {details}</Card.Text>
          <Card.Text className="flex-grow-1 ">Type: {audienceType}</Card.Text>
          {advertiser.length > 0 && (
            <Card.Text className="flex-grow-1 ">
              Advertiser: {advertiser}
            </Card.Text>
          )}
          <Card.Text className="flex-grow-1 ">
            Created At: {createdAt}
          </Card.Text>
          <Card.Text className="flex-grow-1">Id: {id}</Card.Text>
        </Card.Body>
        <Card.Footer>
          <SelectBid advert={advert} save={selectBid} />
        </Card.Footer>
      </Card>
    </Col>
  );
};

Advert.propTypes = {
  advert: PropTypes.instanceOf(Object).isRequired,
};

export default Advert;
