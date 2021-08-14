import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

//Components
import Home from '../Home/Home';
import Passwords from '../Passwords/Passwords';
import Password from '../Password/Password';
import Login from '../Login/Login';
import Register from '../Register/Register';
import User from '../User/User';
import NotFound from '../NotFound/NotFound';

function App() {
    return (
        <div>
            <Router>
                <div className="App">
                    <Switch>
                        <Route exact path="/">
                            <Home />
                        </Route>
                        <Route exact path="/vault">
                            <Passwords />
                        </Route>
                        <Route path="/vault/:id">
                            <Password />
                        </Route>
                        <Route path="/login">
                            <Login />
                        </Route>
                        <Route path="/register">
                            <Register />
                        </Route>
                        <Route path="/user/:username">
                            <User />
                        </Route>
                        <Route path="*">
                            <NotFound />
                        </Route>
                    </Switch>
                </div>
            </Router>
        </div>
    );
}

export default App;
