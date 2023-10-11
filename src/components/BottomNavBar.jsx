import React, { useState, useContext } from 'react'
import { Badge, BottomNavigation, BottomNavigationAction } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person';
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';
import ShareIcon from '@mui/icons-material/Share';
import { useNavigate } from 'react-router-dom'
import StyleIcon from '@mui/icons-material/Style';
import { AuthContext } from '../contexts/AuthContext'
import GroupsIcon from '@mui/icons-material/Groups';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { CommonContext } from '../contexts/CommonContext';
import Paper from '@mui/material/Paper';

// import CartIcon from '../assets/nav-cart.png'
import CatIcon from '../assets/nav-categories.png'
import HomeIcon from '../assets/nav-home.png'
import HomeActIcon from '../assets/nav-home-act.png'
import ProfileIcon from '../assets/nav-profile.png'
import ProfileActIcon from '../assets/nav-profile-act.png'
import CatActIcon from '../assets/nav-cat-act.png'
// import CartActIcon from '../assets/cart-act.png'


function BottomNavBar() {
  const [activeIndex, setActiveIndex] = useState(0)
  const {showPopup} = useContext(CommonContext)
  const {getUserId, isUserLoggedIn} = useContext(AuthContext)
  const ref = React.useRef(null)
  const { updateCart, cartData, isDesktop } = useContext(CommonContext)

  const navigate    = useNavigate()

  async function goToProfile() {
    if (await isUserLoggedIn()) {
      navigate('/profile')
    } else {
      navigate('/auth')
    }
  }

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, height:'7vh', zIndex:'444' }} elevation={3}>
    <BottomNavigation
      onChange={(event, newIndex) => {
        setActiveIndex(newIndex)
        switch (newIndex) {
          case 0:
            navigate("/")
            break;
          case 1:
            navigate("/allCategories")
            break;
          // case 2:
          //   navigate("/cart")
          //   break;
          case 2:
            goToProfile()
            break;
          default:
            break;
        }
      }}
      showLabels>
      <BottomNavigationAction label="Home" sx={{color:window.location.pathname == '/' ? '#a4243d' : '#bfbfbf'}}
       icon={<img className='nav-ic' src={window.location.pathname == '/' ? HomeActIcon : HomeIcon} />}/> 
      <BottomNavigationAction label="Categories" sx={{color:window.location.pathname == '/allCategories' ? '#a4243d' : '#bfbfbf'}}
       icon={<img className='nav-ic' src={window.location.pathname == '/allCategories' ? CatActIcon : CatIcon} />}/> 


      {/* <BottomNavigationAction label="Cart" sx={{color:window.location.pathname == '/cart' ? '#a4243d' : '#bfbfbf'}}
       icon={<Badge showZero={false} badgeContent={cartData?.totalCount} sx={{
        "& .MuiBadge-badge": {
          color:'white',
          backgroundColor:'#a4243d',
          top:'4px'
        }
      }}>
        <img className='nav-ic' src={window.location.pathname == '/cart' ? CartActIcon : CartIcon} />
     </Badge>} /> */}
     
      <BottomNavigationAction label="Profile" sx={{color:window.location.pathname == '/profile' ? '#a4243d' : '#bfbfbf'}}
      icon={ <img className='nav-ic' src={window.location.pathname == '/profile' ? ProfileActIcon : ProfileIcon} />} />
    </BottomNavigation>
    </Paper>
  )
}

export default BottomNavBar
