import React from 'react'
import { Nav } from 'react-bootstrap'
import { useHistory } from 'react-router-dom';

export const NavHeader = ()=>{
  const history = useHistory();
  const pathname = history.location.pathname;
    return(
        <Nav variant="tabs" defaultActiveKey={pathname}>
          <Nav.Item>
            <Nav.Link href="/watchlist">Вочлист</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/holdings">Портфель</Nav.Link>
          </Nav.Item>
          <Nav.Item>
          <Nav.Link href="/total">Обзор</Nav.Link>
        </Nav.Item>
        
        </Nav>
        
    )
}