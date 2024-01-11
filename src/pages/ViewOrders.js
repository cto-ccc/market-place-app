import { TextField, Button, Box, createMuiTheme, useTheme, FormControl, Paper } from '@mui/material'
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from 'react-router-dom';
import ComponentLoader from '../components/ComponentLoader';
import { useContext, useEffect, useState } from 'react';
import CallIcon from '@mui/icons-material/Call';
import { getOrders, getUsersByTime } from '../services/api';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import InputAdornment from '@mui/material/InputAdornment';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { CommonContext } from '../contexts/CommonContext';
import { margin } from '@mui/system';
import {CSVLink} from "react-csv"





  




function ViewOrders() {

  const navigate = useNavigate()
  const location = useLocation()

  const { showLoader, hideLoader, showAlert, showSnackbar } = useContext(CommonContext)

  const [dateTime, setDateTime]         = useState()
  const [toDateTime, setToDateTime]         = useState()
  const [users, setUsers] = useState([])
  const [excelData , setExcelData] = useState([])

  useEffect(() => {
    console.log(location.state)
  }, [])

  useEffect(()=>{

    const extractedExcelData = users.map(({f_name , mobileNo , customerId})=>({f_name , mobileNo , customerId}))
    setExcelData(extractedExcelData)

  },[users])

  const getProductOrders = async() => {

    if (!dateTime || !toDateTime) {
      showSnackbar("Please select date and time", "error")
      return
    }

    showLoader()
    let selectedFromDate = new Date(dateTime)
    selectedFromDate.setHours(0,0,0,0)

    let selectedToDate = new Date(toDateTime)
    selectedToDate.setHours(0,0,0,0)
    let data = {
      fromTs : selectedFromDate.getTime(),
      toTs   : selectedToDate.getTime()
    }
    getUsersByTime(data).then((response) => {
      console.log(response)
      setUsers(response.usersData)
      hideLoader()
    })


  }


  

  
   
  return (
    <Box sx={{padding:'4vw'}}>
      <Box mb={2} mt={4} sx={{fontSize:'20px', fontWeight:'bold'}}>
        Customer Signup Data
      </Box>
      <Box mb={3} mt={2}>
          <Box mb={1}>
            Select from date and to date
          </Box>
          
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              renderInput={(props) => <TextField sx={{width:'100%'}} {...props} />}
              inputFormat="DD/MM/YYYY hh:mm A"
              value={dateTime}
              sx={{marginRight:'20px', marginBottom:'10px'}}
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
                setToDateTime(newValue)
              }}
            />
          </LocalizationProvider>

          <Box mt={1} >
            <Button variant="contained" onClick={() => getProductOrders()}>
              Search
            </Button>
            
            <Button variant='contained' sx={{marginX : "5px" , color : "white"}}><CSVLink data={excelData} filename='SignupExcelData.csv' className='download'>Download As Excel</CSVLink></Button>

          </Box>
        </Box>
        <Box>
          Total Count : {users.length}
          {
            users.length ? 
            <Box>
              {
                users.map((item, index) => {
                  return <Paper sx={{display:'flex', flexDirection:'column', margin:'10px 0', padding:'10px'}}
                  onClick={() => navigate('/orderDetail', {state : item})} key={index}>
                  <Box mb={1} sx={{fontWeight:'bold'}}>
                    {item.f_name}
                  </Box>
                  <Box mb={1} sx={{fontWeight:'bold'}}>
                    {item.mobileNo}
                  </Box>    
                  <Box mb={1}>
                    {new Date(item.timeStamp).toLocaleString()}
                  </Box>   
                  <Box mb={1}>
                    {item.deviceToken ? 'App' : 'Website'}
                  </Box>             
                </Paper>
                })
              }
            </Box> : 
            <Box>
              <Paper sx={{padding:'20PX 0', textAlign:'center', marginTop:'10px'}}>
                No data found
              </Paper> 
            </Box>
          }
        </Box>
    </Box>
  )
}



export default ViewOrders;
