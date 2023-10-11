import { TextField, Button, Box, createMuiTheme, useTheme, FormControl, Paper } from '@mui/material'
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from 'react-router-dom';
import ComponentLoader from '../components/ComponentLoader';
import { useContext, useEffect, useState } from 'react';
import CallIcon from '@mui/icons-material/Call';
import { getOrders } from '../services/api';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import InputAdornment from '@mui/material/InputAdornment';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { CommonContext } from '../contexts/CommonContext';


function ViewOrders() {

  const navigate = useNavigate()
  const location = useLocation()

  const { showLoader, hideLoader, showAlert, showSnackbar } = useContext(CommonContext)

  const [orders, setOrders] = useState([])
  const [dateTime, setDateTime]         = useState()

  useEffect(() => {
    console.log(location.state)
  }, [])

  const getProductOrders = async() => {

    if (!dateTime) {
      showSnackbar("Please select date and time", "error")
      return
    }

    showLoader()
    let selectedDate = new Date(dateTime)
    selectedDate.setHours(0,0,0,0)
    let data = {
      dateStamp : selectedDate.getTime()
    }
    if (location?.state?.clientId) data.clientId = location.state.clientId

    getOrders(data).then((response) => {
      console.log(response)
      setOrders(response)
      hideLoader()
    })

  }

  return (
    <Box sx={{padding:'4vw'}}>
      <Box mb={2} mt={4} sx={{fontSize:'20px', fontWeight:'bold'}}>
        Past Orders
      </Box>
      <Box mb={3} mt={2}>
          <Box mb={1}>
            Select delivery date and time
          </Box>
          
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              renderInput={(props) => <TextField sx={{width:'100%'}} {...props} />}
              inputFormat="DD/MM/YYYY hh:mm A"
              value={dateTime}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="end">
                    <InsertInvitationIcon />
                  </InputAdornment>
                )
              }}
              
              onChange={(newValue) => {
                setDateTime(newValue)
              }}
            />
          </LocalizationProvider>
          <Box mt={1}>
            <Button variant="contained" onClick={() => getProductOrders()}>
              Search
            </Button>
          </Box>
        </Box>
        <Box>
          {
            orders.length ? 
            <Box>
              {
                orders.map((item, index) => {
                  return <Paper sx={{display:'flex', flexDirection:'column', margin:'10px 0', padding:'10px'}}
                  onClick={() => navigate('/orderDetail', {state : item})} key={index}>
                  <Box mb={1} sx={{fontWeight:'bold'}}>
                    {item.clientName}
                  </Box>
                  <Box mb={1}>
                    {new Date(item.deliveryTime).toLocaleString()}
                  </Box>
                  <Box mb={1}>
                    {item.status}
                  </Box>             
                </Paper>
                })
              }
            </Box> : 
            <Box>
              <Paper sx={{padding:'20PX 0', textAlign:'center', marginTop:'10px'}}>
                No orders found
              </Paper> 
            </Box>
            
          }
        </Box>
    </Box>
  )
}

export default ViewOrders
