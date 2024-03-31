import React from "react";
import { login } from "../utils/auth";
import Adverts from "../components/advertManager/Adverts";
import Cover from "../components/utils/Cover";
import coverImg from "../assets/img/cover.jpg";
import { Notification } from "../components/utils/Notifications";

const AdvertsPage = () => {
  const isAuthenticated = window.auth.isAuthenticated;

  return (
    <>
      <Notification />
      {isAuthenticated ? (
        <div fluid="md" className="bg-grey-800">
          <main>
            <Adverts />
          </main>
        </div>
      ) : (
        <Cover name="Street Food" login={login} coverImg={coverImg} />
      )}
    </>
  );
};

export default AdvertsPage;
