import { TextField, Button, Box, createMuiTheme, useTheme, FormControl, Paper } from '@mui/material'
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from 'react-router-dom';
import ComponentLoader from '../components/ComponentLoader';
import { useEffect, useState } from 'react';
import CallIcon from '@mui/icons-material/Call';
import { getOrders } from '../services/api';
import NavHeader from '../components/NavHeader';


const styles = {
  circleIcon : {
    borderRadius:'10px',
    padding:'8px',
    // background:'#a4243d',
    color:'#a4243d',
    border:'1px solid #a4243d'
  }
}


function Client() {

  const location = useLocation()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [client, setClient]   = useState({})
  const [orders, setOrders]   = useState([])

  useEffect(() => {
    setClient(location.state)
    getClientOrders()
  }, [])

  const getClientOrders = async() =>{

    let today = new Date()
    today.setHours(0,0,0,0)

    const queryData = {
      dateStamp : today.getTime(),
      clientId  : location.state.clientId
    }

    getOrders(queryData).then((response) => {
      setOrders(response)
      setLoading(false)
    })
  }

  function callMe(number) {
    window.open(`tel:${number}`, '_self');
  }

  return (
    <Box sx={{padding:'10vh 4vw'}}>
      <NavHeader />
      <h4>Farmer Details</h4>
      <Paper>
        <Box sx={{display:'flex', flexDirection:'column', padding:'10px'}}>
          <Box sx={{marginBottom:'5px', fontSize:'20px', fontWeight:'bold'}}>
            {location.state.name}
          </Box>
          <Box sx={{marginBottom:'5px'}}>
            {location.state.mobileNo}
          </Box>
          <Box sx={{marginBottom:'5px'}}>
            {location.state.email}
          </Box>
          <Box sx={{marginBottom:'20px'}}>
            {location.state.address}
          </Box>

          <Box sx={{paddingBottom:'5px', borderBottom:'1px solid #eaeaea', fontSize:'17px', fontWeight:'500'}}>
            Orders Summary
          </Box>
          <Box sx={{marginBottom:'20px', marginTop:'10px'}}>
            <Box sx={{display:'flex'}}>
              <Box sx={{width:'50%'}}>
                Total Orders 
              </Box>
              : {location.state.totalOrdersCount || 0}
            </Box>
            <Box sx={{mb:1, display:'flex'}}>
              <Box sx={{width:'50%'}}>
                Total Order Amount 
              </Box>
               : ₹ {location.state.totalOrdersAmount || 0}
            </Box>
            <Box sx={{display:'flex'}}>
              <Box sx={{width:'50%'}}>
                Paid Amount
              </Box>
              : ₹ {location.state.paymentPaidAmount || 0}
            </Box>
            <Box sx={{display:'flex'}}>
              <Box sx={{width:'50%'}}>
                Pending Amount
              </Box>
               : ₹ {(location.state.totalOrdersAmount - location.state.paymentPaidAmount) || 0}
            </Box>
          </Box>

          <Box sx={{paddingBottom:'5px', borderBottom:'1px solid #eaeaea', fontSize:'17px', fontWeight:'500'}}>
            Staff Details
          </Box>
          <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <Box sx={{display:'flex', flexDirection:'column'}}>
              <Box sx={{margin:'5px 0'}}>
                {location.state.staffName}
              </Box>
              <Box>
                {location.state.staffMobile}
              </Box>
            </Box>
            <Box sx={{marginTop:'10px'}}>
              <CallIcon style={styles.circleIcon} onClick={() => callMe(location.state.staffMobile)}/>
            </Box>
          </Box>
          
          <Box sx={{paddingBottom:'5px', borderBottom:'1px solid #eaeaea', marginTop:'15px', fontSize:'17px', fontWeight:'500'}}>
            Delivery Contact Details
          </Box>
          <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <Box sx={{display:'flex', flexDirection:'column'}}>
              <Box sx={{margin:'5px 0'}}>
                {location.state.deliveryContactName}
              </Box>
              <Box>
                {location.state.deliveryContactNo}
              </Box>
            </Box>
            <Box sx={{marginTop:'10px'}}>
              <CallIcon style={styles.circleIcon} onClick={() => callMe(location.state.deliveryContactNo)}/>
            </Box>
          </Box>
         
        </Box>
      </Paper>
      <Box sx={{mt:2}}>
        <Box>        
          <Button variant="contained" sx={{mr:1}} onClick={() => navigate('/newOrder', {state : location.state, replace:true})}>New Order</Button>
          <Button variant="outlined" sx={{mr:2}}
            onClick={() => navigate('/viewOrders', {state : {clientId : location.state.clientId}})}>View Past Orders</Button>
          {/* <Button variant="contained" sx={{mr:1}} onClick={() => navigate('/addPayment', {state : location.state, replace:true})}>New Payment</Button> */}
        </Box>
        <Box>
        
          {/* <Button variant="outlined" sx={{mt:2}}
            onClick={() => navigate('/viewPayments', {state : {clientId : location.state.clientId}})}>View Payments</Button> */}
        </Box>
        
      </Box>
      <Box sx={{mt:2}}>
        <Box>
          Today's Orders
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
            <Paper sx={{padding:'20PX 0', textAlign:'center', marginTop:'10px'}}>
              No orders found for today
            </Paper>
          }
        </Box>
      </Box>

    </Box>
  )
}

export default Client
