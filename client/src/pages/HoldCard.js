import React from "react";
import { Card, Table, Accordion } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { HoldingChart } from "../components/HoldingChart";

export const HoldCard = ({ link }) => {
    
  const price =  link.map(item=>item.chart_re.W.c.pop())
    console.log(price)
    const chart_re =  link.map(item=>item.chart_re)
  const hasInPortfolio = link[0].item.length;
  const hasDividend = link[0].dividend.length !== 0;
  const redirect = useHistory();

  if (!hasInPortfolio) {
    redirect.push("/holdings");
    return <div>Такой страницы не существует</div>;
  }
  return (
    <div>
      <Card className="text-center" style={{ fontSize: "0.98rem" }}>
        <Accordion defaultActiveKey="0">
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="0">
              График
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
                <HoldingChart price={price} chart_re={chart_re}/>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="3">
            О компании
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="3">
              <Card.Header>
                <div
                  dangerouslySetInnerHTML={{
                    __html: link[0].item[0].description
                  }}
                />
              </Card.Header>
            </Accordion.Collapse>
          </Card>
          {hasDividend && (
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="1">
                Дивиденды
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="1">
                <Card.Body>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Дата отсечки</th>
                        <th>Дивиденд</th>
                        <th>Процент</th>
                      </tr>
                    </thead>
                    <tbody>
                      {link[0].dividend.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{item.lastDate}</td>
                            <td>{item.devidendSize}</td>
                            <td>{item.percent}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tbody>
                      {link[0].dividend.map(item =>
                        item.previousDividends.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>{item.lastDate}</td>
                              <td>{item.devidendSize}</td>
                              <td>{item.percent}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </Table>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          )}
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="2">
              Транзакции
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="2">
            <Card.Body>
              <Table responsive>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Сделка</th>
              <th>Кол-во</th>
              <th>Цена</th>
            </tr>
          </thead>
          <tbody>
            {link[0].item.map((item, index) => {
              //console.log(item)
              return (
                <tr key={index}>
                  <td>{new Date(item.date).toLocaleDateString("ru-RU")}</td>
                  <td
                    style={
                      item.side === "Buy"
                        ? { color: "green" }
                        : { color: "red" }
                    }
                  >
                    {item.side}
                  </td>
                  <td>{item.quantity}</td>
                  <td>
                    {item.price}
                    <p
                      style={
                        item.side === "Buy"
                          ? { color: "green", margin: "0" }
                          : { color: "red", margin: "0" }
                      }
                    >
                      {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
                        
       
      </Card>
    </div>
  );
};
