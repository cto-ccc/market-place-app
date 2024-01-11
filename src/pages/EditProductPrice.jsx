import React, { useEffect, useState } from 'react';
import {Box , Button , TextField} from "@mui/material"
import {useParams} from "react-router-dom"

const EditProductPrice = () => {
    const params = useParams();
  const [newPrice, setNewPrice] = useState(0);

  useEffect(async ()=>{
    const newPrice = await fetch(`/${params.produtId}`)
    const data = await newPrice.json();
    setNewPrice(data)
  },[params.produtId])

  const handleUpdate = () => {
    
  };

  return (
    <Box  sx={{display : "flex" , flexDirection: "column" , gap : "4px" , maxWidth : "500px" , margin : "auto" , marginTop : "50px"}}>
      <h2 className='margin : 50px'>Edit Product Price</h2>
      <TextField id="outlined-basic" label="New Price:" variant="outlined"  type='number' value={newPrice}  onChange={(e) => setNewPrice(e.target.value)}/>
      <Button sx={{mt : "10px"}} variant='contained' onClick={handleUpdate}>Update Price</Button>
    </Box>
  );
};

export default EditProductPrice;
