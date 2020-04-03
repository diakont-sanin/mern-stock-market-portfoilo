import React from "react";
import { Row, Col, Badge, Container } from "react-bootstrap";

export const TotalProfit = ({ total, overAll, todayProfit }) => {
  const totalSum =
    total &&
    total.reduce((sum, current) => {
      return sum + current;
    }, 0);

  const totalSumOverAll =
    overAll &&
    overAll.reduce((sum, current) => {
      return sum + current;
    }, 0);

  const overAllProfit = totalSum - totalSumOverAll;

  const profit =
    todayProfit &&
    todayProfit.reduce((sum, current) => {
      return sum + current;
    }, 0);
  return (
    <Container style={{ textAlign: "center",fontSize:"1.5rem" }}>
      <Row>
        <Col>Сегодня</Col>
        <Col>Всего</Col>
      </Row>
      <Row>
      <Col><Badge variant={profit > 0 ? "success" : "danger"}>{profit>0?'+'+profit:profit} ₽</Badge></Col>
        <Col><Badge variant={overAllProfit < 0 ? "danger" : "success"}>{overAllProfit>0?'+'+overAllProfit:overAllProfit} ₽</Badge></Col>
      </Row>
    </Container>
  );
};
