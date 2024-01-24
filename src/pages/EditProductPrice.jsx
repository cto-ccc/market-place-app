import React, { useEffect, useState } from 'react';
import { Box , Button } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));




const EditProductPrice = () => {
  const [productDetails, setProductDetails] = useState([]);
  const [selectedproduct , setSelectedProduct] = useState('')
  const [editId , setEditId] = useState(-1)
  const [price , setPrice] = useState(0)
  const [mrp , setMrp] = useState(0)

  
  const handleChangeTitle = (e)=>{
    const selectedProductId = e.target.value
    const selectedProductsData = productDetails.find(product => product.id === selectedProductId)
    
    setSelectedProduct(selectedProductsData);
    
  }

  const handleProductDetails = async()=>{
    const newDetails = await fetch(`https://api.countrychickenco.in/v2/getLanding` , {
      method : "POST",
      headers : {
        "Content-Type" : "application/json",

      },
      body : JSON.stringify({"userData" : {
        "packageVersion": "6.0.0",
        "platform": "web",
        "userMobile" : null
      }})
    })
    const data = await newDetails.json();
    setProductDetails(data.productsData)
  }

  useEffect( ()=>{
    handleProductDetails()
  },[])


  
  const handleEdit = (id)=>{
    setEditId(id)
    
  }


  const handleUpdate = (e)=>{
    e.preventDefault()
  }
  return (
    <>

        <Box style={{ maxWidth : "700px" , margin: "auto"}}>
              <Box  sx={{fontSize:'20px' , pt:15, pb:-10, borderBottom:'1px solid #eaeaea' , fontWeight : "600"}}>
                Product Details
              </Box>
              <Box key={productDetails.id} mt={"80px"}  flex flexDirection={"column"}>
                  <Box  mb={3} sx={{display : "flex" , flexDirection : "column" , gap : "10px"}}>
                    <FormControl sx={{ m: 1, minWidth: 80 }}>
                      <InputLabel id="demo-simple-select-autowidth-label">Select a category product:</InputLabel>
                      <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={selectedproduct.title}
                        onChange={handleChangeTitle}
                        autoWidth
                        label='Select a category product:'
                      >
                      {productDetails && productDetails.map((eachdetail)=>{
                        return <MenuItem key={eachdetail.id} value={eachdetail.id}>{eachdetail.title}</MenuItem>})}
                       
                   
                      </Select><br/>
                    </FormControl> 
                  </Box>
              </Box>
              <TableContainer component={Paper} sx={{maxWidth : "1000px"}}>
                          <Table  aria-label="customized table">
                            <TableHead>
                              <TableRow>
                                <StyledTableCell>NAME</StyledTableCell>
                                <StyledTableCell >MRP</StyledTableCell>
                                <StyledTableCell>PRICE</StyledTableCell>
                                <StyledTableCell align='center'>ACTION</StyledTableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                            {selectedproduct && selectedproduct.data.map((eachValue) => {
                              return (
                                eachValue.id === editId ? (
                                  <StyledTableRow key={eachValue.id} >
                                  <StyledTableCell >
                                      {eachValue.name}
                                    </StyledTableCell>
                                    <StyledTableCell >
                                      <input
                                        type="number"
                                        style={{ width: "70px", padding: "5px"}}
                                        value={mrp || eachValue.mrp}
                                        onChange={(e) => setMrp(e.target.value)}
                                      />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                      <input
                                        type="number"
                                        style={{ width: "70px", padding: "5px" }}
                                        value={price || eachValue.price}
                                        onChange={(e) => setPrice(e.target.value)}
                                      />
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                      <Button onClick={handleUpdate}>Update</Button>
                                    </StyledTableCell>
                                  </StyledTableRow>
                                ) : (
                                  <StyledTableRow key={eachValue.id}>
                                    <StyledTableCell component="th" scope="row">
                                      {eachValue.name}
                                    </StyledTableCell>
                                    <StyledTableCell >{eachValue.mrp}</StyledTableCell>
                                    <StyledTableCell >{eachValue.price}</StyledTableCell>
                                    <StyledTableCell align="right">
                                      <Button onClick={() => handleEdit(eachValue.id)}>Edit</Button>
                                    </StyledTableCell>
                                  </StyledTableRow>
                                )
                              );
                            })}
                          </TableBody>
                          </Table>
              </TableContainer>
        
        </Box>
    </>
  );
};

export default EditProductPrice;
