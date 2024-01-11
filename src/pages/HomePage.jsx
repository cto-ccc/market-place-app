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
import stockpolice from '../assets/stockpolice_white.png'
import Header from '../components/Header';

function HomePage() {

  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedClient, setSelectedClient] = useState('')
  const { showLoader, hideLoader, showAlert, showSnackbar } = useContext(CommonContext)
  const [orders, setOrders]   = useState([])


  useEffect(() => {
    getAllClients()
  }, [])
  
  const getAllClients = () => {
    getClients().then((response => {
      setClients(response)
      setLoading(false)
      // getTodaysOrders()
    }))
  }

  const getTodaysOrders = () => {

    let today = new Date()
    today.setHours(0,0,0,0)

    const data = {
      dateStamp : today.getTime()
    }
    getOrders(data).then((response) => {
      console.log(response)
      setOrders(response)
      setLoading(false)
    })
  }

  const handleChange = (event) => {
    setSelectedClient(event.target.value)
  }

  const openClientPage = () => {
    if (!selectedClient) {
      showSnackbar("Please select a Farmer", "error")
      return
    }
    const clientData = clients.filter((client) => client.clientId == selectedClient)[0]
    navigate('/client', {state : clientData})
  }


  return (
    <Box sx={{padding:'4vw'}}>
      {
        loading ? <ComponentLoader /> : 
        <Box mt={6}>
                 <Header /> 
          <h2>Welcome, CCC Admin</h2>
          {/* <Box sx={{marginLeft:'5vw', mb:1}}>Select a farmer</Box>
          <Box sx={{display:'flex', flexDirection:'column', mb:4, alignItems:'center'}}>
            
            {
              clients?.length ?
                <Box>
                  <FormControl sx={{ border:'1px solid white', borderRadius:'5px'}}>
                    <Select
                      sx={{width:'80vw'}}
                      IconComponent={() => (
                        <ArrowDropDownIcon />
                      )}
                      value={selectedClient}
                      onChange={handleChange}>
                      {
                        clients.map((client) => {
                          return (
                            <MenuItem key={client.clientId} value={client.clientId}>{client.name}</MenuItem>
                          )
                        })
                      }
                    </Select>
                    </FormControl>
                    <Box sx={{mt:2, display:'flex', justifyContent:'center'}}>
                      <Button onClick={() => openClientPage()} variant="contained">
                        Proceed
                      </Button>
                    </Box> 
                  </Box>
                :
                <Box>
                  No Clients Found
                </Box>
            }
          </Box>

          <Box>
            <Button onClick={() => navigate('/addClient')} variant="outlined">
              Add New Farmer
            </Button>
          </Box>   */}

          <Box mt={6}>
            <Button onClick={() => navigate('/viewCustomerOrders')} variant="contained">
              Customer Orders
            </Button>
          </Box>  

          <Box mt={2}>
            <Button onClick={() => navigate('/viewTransactions')} variant="contained">
              Customer Transactions
            </Button>
          </Box>  

          <Box mt={2}>
            <Button onClick={() => navigate('/viewOrders')} variant="contained">
              Signup Data
            </Button>
          </Box>  

          <Box mt={2}>
            <Button onClick={() => navigate('/sendNotification')} variant="contained">
              Push Notification
            </Button>
          </Box>  

          <Box mt={2}>
            <Button onClick={() => navigate('/viewEnquiries')} variant="contained">
              Contact Us Queries
            </Button>
          </Box>  

          <Box mt={2}>
            <Button onClick={() => navigate('/orderDetail')} variant="contained">
              Order Details
            </Button>
          </Box>  

          

          {/* <Box>
            <Box mt={2} sx={{fontSize:'20px'}}>
             Today Live Orders
            </Box>
            {
              orders.map((order, index) => {
                return <Paper sx={{display:'flex', flexDirection:'column', margin:'10px 0', padding:'10px'}}
                  onClick={() => navigate('/orderDetail', {state : order})} key={index}>
                  <Box mb={1} sx={{fontWeight:'bold'}}>
                    {order.clientName}
                  </Box>
                  <Box mb={1}>
                    {new Date(order.deliveryTime).toLocaleString()}
                  </Box>
                  <Box mb={1}>
                    {order.status}
                  </Box>             
                </Paper>
              })
            }
          </Box> */}
        </Box>
      }


        {/* <Box>
          <Box sx={{fontSize:'25px', marginTop:'20px', marginBottom:'20px', color:'#a4243d'}}>
            Farming Videos
          </Box>
          <Grid container>
            {
              getRecepieVideos().map((video, index) => {
                return(
                <Grid xs={12} sm={12} md={3} lg={3}  key={index}>
                    <Box key={index}>
                      <div class="itemdet-recipie-iframe">
                        <iframe
                          src={video.url}>
                        </iframe>
                      </div>
                    </Box>
                  </Grid>
                )
              })
            }
          </Grid>
        </Box> */}

    </Box>
  )
}

export default HomePage
