import { BrowserRouter, Routes, Route } from "react-router-dom";


import Home from "./Components/Home";
import Layout from "./Components/Layout";
import "./App.css"; // Global styling
import Dashboard from "./Components/Dashboard";
import WorkerDetails from "./Components/WorkerDetails";
import PendingRequests from "./Components/PendingRequests";
import CompletedRequests from "./Components/CompletedRequests";
import CustomerQueries from "./Components/CustomerQueries";
import Map from './Components/Map';


import SignupComponent from "./Components/SignupComponent";
import LoginComponent from "./Components/LoginComponent";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Layout />}> 
          <Route index element={<Home />} />
          {/*<Route index element={<Dashboard />} />*/}
          <Route path="/dashboard" element={<Dashboard/> }/> 
          {/*<Route path="/home" element={<Home/>} />*/}
          <Route path="/login"element={<LoginComponent/>}/>
          <Route path="/signup"element={<SignupComponent/>}/>
          <Route path="/customerqueries"element={<CustomerQueries/>}/>
          <Route path="/track/:workerId"element={<Map/>}/>
          <Route path="/workerdetails/:workerId" element={<WorkerDetails/> }/> 
          <Route path="/worker/:workerId/pending-requests" element={<PendingRequests/>} />
          <Route path="/worker/:workerId/completed-requests" element={<CompletedRequests/>} />
         
          {/* <Route path="blogs" element={<Blogs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="add" element={<Services />} />
          <Route path="items" element={<Items />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="*" element={<NoPage />} />  */}
         </Route>  
      </Routes>
    </BrowserRouter>
  );
}
