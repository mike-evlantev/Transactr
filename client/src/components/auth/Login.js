import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../../context/auth/authContext";
import AlertContext from "../../context/alert/alertContext";

const Login = props => {
  const [user, setUser] = useState({
    email: "",
    password: ""
  });
  const { setAlert } = useContext(AlertContext);
  const { login, error, clearErrors, isAuthenticated } = useContext(
    AuthContext
  );
  useEffect(() => {
    if (isAuthenticated) {
      props.history.push("/");
    }
    if (error === "Invalid credentials") {
      setAlert(error, "danger");
      clearErrors();
    }
    // eslint-disable-next-line
  }, [error, isAuthenticated, props.history]);

  const { email, password } = user;
  const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });
  const onSubmit = e => {
    e.preventDefault();
    if (email === "" || password === "") {
      setAlert("Please fill in all fields", "danger");
    } else {
      login({ email, password });
    }
  };

  return (
    <div className="row">
      <div className="col-md"></div>
      <div className="col-md">
        <div className="form-container">
          <h5 className="text-center">
            Account <span className="text-primary">Login</span>
          </h5>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="Email"
                value={email}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="Password"
                value={password}
                onChange={onChange}
              />
            </div>
            <input
              type="submit"
              value="Login"
              className="btn btn-outline-primary float-right"
            />
          </form>
        </div>
      </div>
      <div className="col-md"></div>
    </div>
  );
};

export default Login;
