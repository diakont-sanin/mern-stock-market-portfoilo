import React, { useContext, useState, useEffect, useCallback } from "react";
import {
  Jumbotron,
  Container,
  Button,
  Row,
  Col,
  Badge,
  Spinner
} from "react-bootstrap";
import { BoxArrowRight, Search } from "react-bootstrap-icons";
import { AddHold } from "./AddHold";
import { AuthContext } from "../context/AuthContext";
import { useHistory } from "react-router-dom";
import { useHttp } from "../hooks/http.hook";
import { NavHeader } from "../components/NavHeader";
import { SearchTicker } from "../components/SearchTicker";
import { AddWatch } from "./AddWatch";

export const Header = () => {
  const { token } = useContext(AuthContext);
  const { request, loading } = useHttp();
  const [ticker, setTicker] = useState(null);
  const [display, setDisplay] = useState(false)
  const auth = useContext(AuthContext);
  const history = useHistory();
  const pathname = history.location.pathname;
  const getHolding = useCallback(async () => {
    try {
      const fetched = await request(`/api/watchlist/indexes`, "GET", null, {
        Authorization: `Bearer ${token}`
      })
        setTicker(fetched);
    } catch (e) {}
  }, [token, request]);

  useEffect(() => {
    getHolding()
   
  }, [getHolding,pathname]);

  const logoutHandler = event => {
    event.preventDefault();
    auth.logout();
    history.push("/");
  };

  const checkVariant = profitPercent => {
    return String(profitPercent).indexOf("-") === 0 ? "danger" : "success";
  };

  if (loading) {
    return (
      <Jumbotron fluid style={{ margin: "0", padding: "0" }}>
      <Container fluid>
        <Row>
          <Col style={{ fontSize: "1.5rem" }}>
            Мои инвестиции
          </Col>
        </Row>
          <div style={{ textAlign: "center" }}>
            <Spinner animation="border" />
          </div>
        </Container>
        <NavHeader />
      </Jumbotron>
    );
  }
  const formatName = name => {
    switch (name) {
      case "Нефть Brent":
        return "Brent";
      case "Инд. МосБиржи":
        return "ММВБ";
      case "USD/RUB TOM":
        return "Рубль";
      case "S&P 500":
        return "S&P500";
      default:
        return "Unknown";
    }
  };
  
  let str = pathname;

  let hasAddWatch = str.match(/\/watchlist\/(.*?)[A-Z]/);
  
  return (
    <Jumbotron fluid style={{ margin: "0", padding: "0" }}>
      <Container fluid>
        <Row>
          <Col style={{ fontSize: "1.5rem" }}>
            Мои инвестиции
            <Button variant="link" onClick={logoutHandler}>
              <BoxArrowRight size={25} />
            </Button>
            {pathname === "/holdings" && <AddHold />}
            {hasAddWatch && <AddWatch />}
            <Search size={25} onClick={()=>setDisplay(!display)}/>
            {display && <SearchTicker />}
            
          </Col>
        </Row>
        <Row style={{marginBottom:"1rem"}}>
          {!loading &&
            ticker &&
            pathname &&
            ticker.map((item, index) => {
              return (
                <Col
                  xs={6}
                  md={6}
                  key={index}
                  style={{ padding: "0", textAlign: "center" }}
                >
                  {formatName(item.shortName)}{" "}
                  <Badge pill variant={checkVariant(item.profitPercent)}>
                    {item.close} {item.profitPercent}
                  </Badge>
                </Col>
              );
            })}
        </Row>
      </Container>
      <NavHeader />
    </Jumbotron>
  );
};
