import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router} from 'react-router-dom'
import {useRoutes} from './routes'
import { useAuth } from './hooks/auth.hook';
import { AuthContext } from './context/AuthContext';
import { Header } from './pages/Header';




function App() {
  const {token,login,logout,userId,ready} = useAuth()
  const isAuthenticated = !!token
  const routes = useRoutes(isAuthenticated)
  if (!ready) {
    return <div>Loading...</div>;
  }
  return (
    <AuthContext.Provider value={{logout,login,token,userId,isAuthenticated}}>
    <Router>
      {isAuthenticated && <Header />}
    <div>
      {routes}
    </div>
    </Router>
    </AuthContext.Provider>
  )
}

export default App;
