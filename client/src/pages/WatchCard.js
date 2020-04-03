import React from "react";
import { Card, Table, Accordion } from "react-bootstrap";
import { HoldingChart } from "../components/HoldingChart";

export const WatchCard = ({ link }) => {
    
    const price =  link.map(item=>item.chart_re.W.c.pop())
    const chart_re =  link.map(item=>item.chart_re)
    const hasDividend = link[0].dividend.length !== 0;
   


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
          {link[0].item.length !==0  && <Card>
            <Accordion.Toggle as={Card.Header} eventKey="1">
                О компании
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="1">
              <Card.Header>
                <div
                  dangerouslySetInnerHTML={{
                    __html: link[0].item[0].description
                  }}
                />
              </Card.Header>
            </Accordion.Collapse>
          </Card>}
          {hasDividend && (
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="2">
                Дивиденды
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="2">
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
        </Accordion>
      </Card>
    </div>
  );
};
