import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {AuthPage} from './pages/AuthPage'
import { Portfolio } from './components/Portfolio'
import { WatchList } from './components/WatchList'
import { DetailHolds } from './components/DetailHolds'
import { TotalPieChart } from './pages/TotalPieChart'
import { DetailWatch } from './components/DetailWatch'

export const useRoutes = isAuthenticated =>{
    if(isAuthenticated){
        return(
            <Switch>
                <Route path ='/holdings' exact>
                    <Portfolio />
                </Route>
                <Route  path ='/holdings/:id' exact>
                    <DetailHolds />
                </Route>
                <Route path ='/watchlist' exact>
                    <WatchList />
                </Route>
                <Route path ='/watchlist/:id' exact>
                    <DetailWatch />
                </Route>
                <Route path ='/total' exact>
                    <TotalPieChart />
                </Route>
                <Redirect to ='/holdings' />
            </Switch>
        )
    }
    return(
        <Switch>
            <Route path ='/' exact>
                <AuthPage />
            </Route>
            <Redirect to ='/' />
        </Switch>
    )
}