import React, { useContext, useState, useEffect } from 'react'
import { TextField, Button, Box, createMuiTheme, useTheme, FormControl, Paper, Grid } from '@mui/material'
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import ComponentLoader from '../components/ComponentLoader';
import { getClients, getOrders, getRecepieVideos } from '../services/api';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { CommonContext } from '../contexts/CommonContext';
import NavHeader from '../components/NavHeader';



function AllFarmers() {

  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedClient, setSelectedClient] = useState('')
  const { showLoader, hideLoader, showAlert, showSnackbar } = useContext(CommonContext)
  
  useEffect(() => {
    getAllClients()
  }, [])
  
  const getAllClients = () => {
    getClients().then((response => {
      console.log("===========", response)
      setClients(response)
      setLoading(false)
    }))
  }

  return (
    <>
    {
      loading ? 
      <Box sx={{padding:'4vw'}}> <ComponentLoader /> </Box>
       :
      <Box sx={{padding:'10vh 4vw'}}>
      <NavHeader />
      {
        clients.map((client, index) => {
          return <Paper sx={{display:'flex', flexDirection:'column', margin:'10px 0', padding:'10px'}}
             key={index}>
            <Box mb={1} sx={{fontWeight:'bold'}}
              onClick={() => navigate('/client', {state : client})}>
              {client.name}
            </Box>
            <Box mb={1} sx={{fontWeight:'bold'}}
              onClick={() => navigate('/client', {state : client})}>
              {client.mobileNo}
            </Box>

          </Paper>
        })
      }
      </Box>
    }
  </>
  )
}

export default AllFarmers