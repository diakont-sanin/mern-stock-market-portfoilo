import React, { useState, useContext, useEffect } from "react";
import {
  Accordion,
  Card,
  InputGroup,
  FormControl,
  Button
} from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { useMessage } from "../hooks/message.hook";
import { useHttp } from "../hooks/http.hook";

export const AddCash = () => {
  const auth = useContext(AuthContext);
  const message = useMessage();
  const [form, setForm] = useState({
    rub: null,
    usd: null
  });
  const changeHandler = e => {
    setForm({ ...form, [e.target.name]: Number(e.target.value) });
  };
  const handleSubmit = async event => {
    try {
      const data = await request(
        "api/holdings/cash",
        "POST",
        { ...form },
        {
          Authorization: `Bearer ${auth.token}`
        }
      );
      setForm(form);
      message(data.message);
      
    } catch (err) {}
  };
  const { error, request, clearError } = useHttp();

  //console.log(form);
  useEffect(() => {
    if (error) {
      
      message(error);
      clearError();
    }
  }, [error, message, clearError]);
  
  return (
    <Accordion>
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey="0">
          + Деньги
        </Accordion.Toggle>

        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroup-sizing-sm">₽</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                required
                aria-label="Small"
                aria-describedby="inputGroup-sizing-sm"
                type="number"
                onChange={changeHandler}
                name="rub"
              />
            </InputGroup>
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroup-sizing-sm">$</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                required
                aria-label="Small"
                aria-describedby="inputGroup-sizing-sm"
                type="number"
                onChange={changeHandler}
                name="usd"
              />
            </InputGroup>
            <Button onClick={handleSubmit} size="sm" variant="outline-info">
              Добавить
            </Button>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
};
