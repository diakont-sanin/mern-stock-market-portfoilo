import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {Spinner} from "react-bootstrap";
import { WatchCard } from '../pages/WatchCard';

export const DetailWatch = () => {
  const {token} = useContext(AuthContext)
  const {request, loading} = useHttp()
  const [link, setLink] = useState(null)
  const linkId = useParams().id
  const getLink = useCallback(async () => {
    try {
      const fetched = await request(`/api/watchlist/get/${linkId}`, 'GET', null, {
        Authorization: `Bearer ${token}`
      })
      setLink(fetched)
    } catch (e) {}
  }, [token, linkId, request])

  useEffect(() => {
    getLink()
  }, [getLink])
  
  if (loading) {
    return <Spinner />
  }
  
  return (
    <>
      { !loading && link && <WatchCard link={link} /> }
    </>
  )
}