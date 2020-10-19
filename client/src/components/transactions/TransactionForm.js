import React, { useState, useContext, useEffect } from "react";
import TransactionContext from "../../context/transaction/transactionContext";

const TransactionForm = () => {
  const transactionContext = useContext(TransactionContext);

  const { addTransaction, current } = transactionContext;

  useEffect(() => {
    setTransaction({
      company: "",
      firstName: "",
      lastName: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
      email: "",    
      detail1: "",
      detail2: "",
      detail3: "",
      detail4: "",
      detail5: "",
      documentName: "",
      documentDescription: "",
    });
  }, [transactionContext, current]);

  const [transaction, setTransaction] = useState({
    company: "",
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",    
    detail1: "",
    detail2: "",
    detail3: "",
    detail4: "",
    detail5: "",
    documentName: "",
    documentDescription: "",
  });

  const { 
    company, 
    firstName,
    lastName,
    address1,
    address2,
    city,
    state,
    zip,
    phone,
    email,
    detail1,
    detail2,
    detail3,
    detail4,
    detail5,
    documentName,
    documentDescription
  } = transaction;

  const onChange = e =>
    setTransaction({ ...transaction, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    addTransaction(transaction);
    clearAll();
  };

  const clearAll = () => {
    setTransaction({
      company: "",
      firstName: "",
      lastName: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
      email: "",    
      detail1: "",
      detail2: "",
      detail3: "",
      detail4: "",
      detail5: "",
      documentName: "",
      documentDescription: "",
    });
  };

  return (
    <div className="card border-dark mb-3">
      <div className="card-header">{current ? "Edit" : "Add"} Transaction (All Fields Required)</div>
      <div className="card-body">
        <form onSubmit={onSubmit}>
          <label>Customer Information</label>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Company"
              name="company"
              value={company}
              onChange={onChange}
            />
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="First Name"
                name="firstName"
                value={firstName}
                onChange={onChange}
              />
            </div>
            <div className="form-group col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Last Name"
                name="lastName"
                value={lastName}
                onChange={onChange}
              />
            </div>
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Address 1"
              name="address1"
              value={address1}
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Address 2"
              name="address2"
              value={address2}
              onChange={onChange}
            />
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="City"
                name="city"
                value={city}
                onChange={onChange}
              />
            </div>
            <div className="form-group col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="State"
                name="state"
                value={state}
                onChange={onChange}
              />
            </div>
            <div className="form-group col-md-2">
              <input
                type="text"
                className="form-control"
                placeholder="Zip"
                name="zip"
                value={zip}
                onChange={onChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Phone"
                name="phone"
                value={phone}
                onChange={onChange}
              />
            </div>
            <div className="form-group col-md-6">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                name="email"
                value={email}
                onChange={onChange}
              />
            </div>
          </div>          
          <label>Transaction Details</label>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Detail 1"
              name="detail1"
              value={detail1}
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Detail 2"
              name="detail2"
              value={detail2}
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Detail 3"
              name="detail3"
              value={detail3}
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Detail 4"
              name="detail4"
              value={detail4}
              onChange={onChange}
            />
          </div><div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Detail 5"
            name="detail5"
            value={detail5}
            onChange={onChange}
          />
        </div>
        <label>Document</label>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              name="documentName"
              value={documentName}
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Description"
              name="documentDescription"
              value={documentDescription}
              onChange={onChange}
            />
          </div>
          <div>
            <input
              type="submit"
              value="Send PDF"
              className="btn btn-outline-primary float-right"
            />
          </div>
          {current && (
            <div>
              <button className="btn btn-outline-secondary" onClick={clearAll}>
                Clear
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
