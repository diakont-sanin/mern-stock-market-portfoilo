import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Modal,
  Form,
  ToggleButtonGroup,
  ToggleButton,
  Row,Col
} from "react-bootstrap";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";
import { AuthContext } from "../context/AuthContext";
import { Briefcase } from "react-bootstrap-icons";
import {Typeahead} from 'react-bootstrap-typeahead';
import {options} from '../tickerbase/symbol.tickerbase'
import { useHistory } from "react-router-dom";
import {AddCash} from '../components/AddCash'

export const AddHold = () => {
  const auth = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    ticker: "",
    price: "",
    quantity: "",
    side: "Buy"
  });

  const message = useMessage();
  const history = useHistory()
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const changeHandler = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const { error, request, clearError } = useHttp();
  
  //console.log(form);
  useEffect(() => {
    if (error) {
      console.log(error);
      message(error);
      clearError();
    }
    
  }, [error, message, clearError])

  const handleSubmit = async event => {
    try {
        const data = await request(
          "api/holdings/add",
          "POST",
          { ...form },
          {
            Authorization: `Bearer ${auth.token}`
          }
        )
        
        message(data.message)
        history.push('/')
        setShow(false)
        
      }
      catch (err) {}
  };
 
  const filterByCallback = (options, props) => (
     String(options.label).toLowerCase().indexOf(props.text.toLowerCase()) !== -1 ||
     String(options.fullname).toLowerCase().indexOf(props.text.toLowerCase()) !== -1 
  )
  
  return (
    <>
      <Button variant="link" onClick={handleShow}>
        <Briefcase size={25}/>
      </Button>

      <Modal show={show} onHide={handleClose} animation={true}>
        <Modal.Header closeButton>
          <Modal.Title>Добавить в портфель</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicAdd" >
              <Typeahead
                onKeyDown={(e)=>setForm({...form,ticker:e.target.value})}  
                selectHintOnEnter={true}
                filterBy={filterByCallback}
                id='ticker'
                type="text"
                placeholder="Тикер"
                /*console.log(e.length? e:[{label:''}])*/
                onChange={e => e.length ? setForm({ ...form, ticker: e[0].label }) : setForm({ ...form, ticker:[{label:''}] }) }
                name="ticker"
                options={options}
                renderMenuItemChildren={(option) => (
                  <div>
              {option.fullname}
            <div>
              <small>{option.label}</small>
            </div>
          </div>
                )}
              />
            </Form.Group>
            <Form.Group controlId="formBasicAdd">
              <Form.Control
              required
                type="number"
                placeholder="Цена"
                onChange={changeHandler}
                name="price"
              />
            </Form.Group>
            <Form.Group controlId="formBasicAdd">
              <Form.Control
              required
                type="number"
                placeholder="Количество"
                onChange={changeHandler}
                name="quantity"
              />
            </Form.Group>
           
            <Form.Group controlId="formBasicAdd">
            <Row>
              <Col xs={4} md={4}>
              <ToggleButtonGroup
              required
                type="radio"
                name="radio"
                defaultValue={"Buy"}
                onChange={e => setForm({ ...form, side: e })}
              >
                <ToggleButton value={"Buy"}>Buy</ToggleButton>
                <ToggleButton value={"Sell"}>Sell</ToggleButton>
              </ToggleButtonGroup>
              </Col>
              <Col xs={8} md={8}>
              <AddCash />
            </Col>
            </Row>
            </Form.Group>
            
            <Button variant="secondary" onClick={handleClose}>Закрыть</Button>
            <Button variant="primary" onClick={handleSubmit} style={{marginLeft:"1rem"}} >Сохранить</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
