import Signup from './pages/signup'
import Login from './pages/login'
import { Route } from "react-router-dom";

function App() {
  return (
    <div>
      <Route path="/" element={<Signup /> } />
      <Route path="/login" component={Login } />
    </div>
  );
}

export default App;
