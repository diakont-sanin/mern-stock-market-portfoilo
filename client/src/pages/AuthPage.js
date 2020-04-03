import React, { useState, useEffect, useContext } from "react";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";
import { AuthContext } from "../context/AuthContext";

export const AuthPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { loading, error, request, clearError } = useHttp();
  const auth = useContext(AuthContext);
  const message = useMessage();
  useEffect(() => {
    if (error) {
      console.log(error);
      message(error);
      clearError();
    }
  }, [error, message, clearError]);

  const changeHandler = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registerHandler = async () => {
    try {
      const data = await request("/api/auth/register", "POST", { ...form });
      message(data.message);
    } catch (err) {}
  };
  const loginHandler = async () => {
    try {
      const data = await request("/api/auth/login", "POST", { ...form });
      auth.login(data.token, data.userId);
    } catch (err) {}
  };

  return (
    <Row className="justify-content-md-center" style={{marginRight:"5px",marginLeft:"5px"}}>
      <Col xs={12} md={3}>
    <Form >
      <Form.Label><h3>Мои инвестиции</h3></Form.Label>
      <Form.Group controlId="formBasicEmail">
        <Form.Control placeholder="Введите email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={changeHandler} />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Control placeholder="Введите пароль"
                    type="password"
                    name="password"
                    onChange={changeHandler}
                    value={form.password} />
      </Form.Group>

      <Button type="submit"
              onClick={loginHandler}
              disabled={loading}>
        Вход
      </Button>
      <Button
                type="submit"
                variant="secondary"
                style={{ marginLeft: "10px" }}
                onClick={registerHandler}
                disabled={loading}
              >
                Регистрация
              </Button>
    </Form>
    </Col>
    </Row>
  );
};
