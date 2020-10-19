import React, { useReducer } from "react";
import axios from "axios";
import TransactionContext from "./transactionContext";
import transactionReducer from "./transactionReducer";
import {
  GET_TRANSACTIONS,
  GET_TRANSACTION,
  ADD_TRANSACTION,
  UPDATE_TRANSACTION,
  DELETE_TRANSACTION,
  // SET_CURRENT,
  // CLEAR_CURRENT,
  // CLEAR_TRANSACTIONS,
  TRANSACTION_ERROR
} from "../types";

const TransactionState = props => {
  const initialState = {
    // company: "",
    // firstName: "",
    // lastName: "",
    // address1: "",
    // address2: "",
    // city: "",
    // state: "",
    // zip: "",
    // phone: "",
    // email: "",    
    // detail1: "",
    // detail2: "",
    // detail3: "",
    // detail4: "",
    // detail5: "",
    //transactions: null,
    transaction: null,
    error: null
  };
  const [state, dispatch] = useReducer(transactionReducer, initialState);
  
  // Get transactions
  const getTransactions = async () => {
    try {
      const res = await axios.get("/api/transactions");
      dispatch({ type: GET_TRANSACTIONS, payload: res.data });
    } catch (error) {
      dispatch({ type: TRANSACTION_ERROR, payload: error.response.msg });
    }
  };

  // Get transaction
  const getTransaction = async id => {
    try {
      const res = await axios.get(`/api/transactions/${id}`);
      dispatch({ type: GET_TRANSACTION, payload: res.data });
    } catch (error) {
      dispatch({ type: TRANSACTION_ERROR, payload: error.response.msg });
    }
  };

  // Add transaction
  const addTransaction = async transaction => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    try {
      const res = await axios.post("/api/transactions", transaction, config);
      dispatch({ type: ADD_TRANSACTION, payload: res.data });
    } catch (error) {
      dispatch({ type: TRANSACTION_ERROR, payload: error.response.msg });
    }
  };

  // Update transaction
  const updateTransaction = async transaction => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    try {
      const res = await axios.put(
        `/api/transactions/${transaction._id}`,
        transaction,
        config
      );
      dispatch({ type: UPDATE_TRANSACTION, payload: res.data });
    } catch (error) {
      dispatch({ type: TRANSACTION_ERROR, payload: error.response.msg });
    }
  };

  // Delete transaction
  const deleteTransaction = async id => {
    try {
      await axios.delete(`/api/transactions/${id}`);
      dispatch({ type: DELETE_TRANSACTION, payload: id });
    } catch (error) {
      dispatch({ type: TRANSACTION_ERROR, payload: error.response.msg });
    }
  };

  // Set current transaction
  // const setCurrent = transaction => {
  //   dispatch({ type: SET_CURRENT, payload: transaction });
  // };

  // Clear current transaction
  // const clearCurrent = () => {
  //   dispatch({ type: CLEAR_CURRENT });
  // };

  // Clear transactions
  // const clearTransactions = () => {
  //   dispatch({ type: CLEAR_TRANSACTIONS });
  // };

  return (
    <TransactionContext.Provider
      value={{
        // company: state.company,
        // firstName: state.firstName,
        // lastName: state.lastName,
        // address1: state.address1,
        // address2: state.address2,
        // city: state.city,
        // state: state.state,
        // zip: state.zip,
        // phone: state.phone,
        // email: state.email,    
        // detail1: state.detail1,
        // detail2: state.detail2,
        // detail3: state.detail3,
        // detail4: state.detail4,
        // detail5: state.detail5,
        transaction: state.transaction,
        // current: state.current,
        error: state.error,
        getTransactions,
        getTransaction,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        // setCurrent,
        // clearCurrent,
        // clearTransactions
      }}
    >
      {props.children}
    </TransactionContext.Provider>
  );
};

export default TransactionState;