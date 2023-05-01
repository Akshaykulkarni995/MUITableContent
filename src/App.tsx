import React from 'react';
import './App.css';
import UserTable from "./component/UserTable/userTableApi"
import MultiFunTable from "./component/MultiFunctionTable/multiFunTable"
function App() {
  return (
    <div className="App">
    <MultiFunTable/>
    {/* <UserTable/> */}
    </div>
  );
}

export default App;
