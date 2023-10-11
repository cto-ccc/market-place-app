import { useLocation, useNavigate } from 'react-router-dom';
import React, { useContext, useState, useEffect } from 'react'
import { TextField, Button, Box, createMuiTheme, InputLabel, useTheme, FormControl, Paper } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import InputAdornment from '@mui/material/InputAdornment';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { CommonContext } from '../contexts/CommonContext';
import { AuthContext } from '../contexts/AuthContext';
import { createNewPayment } from '../services/api';


function AddPayment() {

  const location = useLocation()
  const [dateTime, setDateTime]         = useState(null)
  const [paymentAmount, setPaymentAmount] = useState('')
  const {getUserId, getUserProfile} = useContext(AuthContext)
  const { showLoader, hideLoader, showAlert, showSnackbar } = useContext(CommonContext)


  useEffect(() => {

  }, [])

  const addPayment = async() => {

    let dateStamp = new Date(dateTime.$d.getTime())
    dateStamp.setHours(0,0,0,0)

    const paymentData = {
      paymentAmount : paymentAmount,
      clientId : location.state.clientId,
      receivedBy : await getUserId(),
      paymentDate : dateTime.$d.getTime(),
      dateStamp : dateStamp.getTime(),
      clientName : location.state.name
    }
    showLoader()
    createNewPayment(paymentData, await getUserProfile()).then((resp) => {
      hideLoader()
      setPaymentAmount('')
      setDateTime('')
      showSnackbar("Payment added successfully")
    }).catch((err) => {
      hideLoader()
      showSnackbar("Failed to add payment", "error")
    })
  }

  return (
    <Box sx={{padding:'4vw'}}>

      <Box mb={2} mt={4} sx={{fontSize:'20px'}}>
        Adding new payment for : <Box sx={{fontWeight:'bold'}}>{location.state.name}</Box> 
      </Box>

      <Box mb={3} mt={4}>
        <TextField
          placeholder="Enter Payment Amount"
          label="Payment Amount"
          variant="outlined"
          fullWidth
          value={paymentAmount}
          type='number'
          onChange={(e) => setPaymentAmount(e.target.value)}
          autoComplete='off'
        />
      </Box>

      <Box mb={3} mt={2}>
          <Box mb={1}>
            Select payment date and time
          </Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              renderInput={(props) => <TextField sx={{width:'100vw'}} {...props} />}
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
        </Box>
        <Box>
          <Button variant='contained' fullWidth onClick={() => addPayment()}>Submit</Button>
        </Box>
    </Box>
  )
}

export default AddPayment