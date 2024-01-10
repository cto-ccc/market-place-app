import logo from './logo.svg';
import './App.css';
import Authentication from './pages/Authentication';
import { CommonProvider } from './contexts/CommonContext';
import { Routes, Route, useNavigate } from 'react-router-dom';
import FullPageLoader from './components/FullPageLoader';
import AlertBox from './components/AlertBox';
import RequireAuth from './components/RequireAuth';
import { AuthContextProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import AddClient from './pages/AddClient';
import Client from './pages/Client';
import NewOrder from './pages/NewOrder';
import OrderDetails from './pages/OrderDetails';
import ViewOrders from './pages/ViewOrders';
import AddPayment from './pages/AddPayment';
import ViewPayments from './pages/ViewPayments';
import AllCategories from './pages/AllCategories';
import Profile from './pages/Profile';
import AllFarmers from './pages/AllFarmers';
import ViewTransactions from './pages/ViewTransactions';
import ViewCustomerOrders from './pages/ViewCustomerOrders';
import Header from './components/Header';
import ViewEnquiries from './pages/ViewEnquiries';
import SendNotification from './pages/SendNotification';

function App() {
  return (
    <CommonProvider>
      <AuthContextProvider>
      <Routes>
        <Route element={<FullPageLoader />} >
          <Route element={<AlertBox />} >
          <Route element={<Header />}>
            <Route path="/auth" element={<Authentication  />}/>

            {/* <Route element={<RequireAuth />} > */}
              <Route path="/" element={<HomePage />}/>
              <Route path="/addClient" element={<AddClient />}/>
              <Route path="/client" element={<Client />}/>
              <Route path="/newOrder" element={<NewOrder />}/>
              <Route path="/orderDetail" element={<OrderDetails />}/>
              <Route path="/viewOrders" element={<ViewOrders />}/>
              <Route path="/addPayment" element={<AddPayment />}/>
              <Route path="/viewPayments" element={<ViewPayments />}/>

              <Route path="/profile" element={<Profile />}/>
              <Route path="/allCategories" element={<AllCategories />}/>
              <Route path="/allFarmers" element={<AllFarmers />}/>
              <Route path="/viewTransactions" element={<ViewTransactions />}/>
              <Route path="/viewCustomerOrders" element={<ViewCustomerOrders />}/>
              <Route path="/viewEnquiries" element={<ViewEnquiries />}/>
              <Route path="/sendNotification" element={<SendNotification />}/>
            {/* </Route> */}


          </Route>
        </Route>
        </Route>
      </Routes>
      </AuthContextProvider>
    </CommonProvider>
  );
}

export default App;
