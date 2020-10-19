import React, { useContext, useEffect } from "react";
import TransactionForm from "../transactions/TransactionForm";
import AuthContext from "../../context/auth/authContext";

const Home = () => {
  const { loadUser } = useContext(AuthContext);
  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <TransactionForm />
    </div>
  );
};

export default Home;
