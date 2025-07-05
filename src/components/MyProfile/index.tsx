import React, { useEffect, useState } from "react";
import Spinner from "../Spinners";

type Props = {};



const MyProfile = (props: Props) => {
  const [myData, setMyData] = useState<any[]>();

  useEffect(() => {

  }, []);
  return (
    <>
      {myData ? (
        <>
          my profile
        </>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default MyProfile;
