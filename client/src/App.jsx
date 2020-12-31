import {useRoutes} from 'react-router-dom'

//import styles
import './App.scss';


//import views
import Home from './views/home/Home'
import Login from './views/login/Login'
import Profile from './views/profile/Profile'
import TodoForm from './components/todoForm/TodoForm';
import TodoList from './components/todoList/TodoList';
import ProfileForm from './components/profileForm/ProfileForm'
import Signup from './views/signup/Signup';
import ErrorPage from './views/errorPage/ErrorPage';

const App = ()=>{
  let element = useRoutes([
    // A route object has the same properties as a <Route>
    // element. The `children` is just an array of child routes.
    { 
      path: '/', 
      element: <Home />, 
      children: [
        {path: '/', element: <TodoList/>},
        {path: '/todo/new', element: <TodoForm/>},
        {path: '/todo/update', element: <TodoForm/>},
        { path: '/profile', element: <Profile /> },
        { path: '/profile/edit', element: <ProfileForm /> },
      ]
    },
    { path: '/login', element: <Login /> },
    { path: '/signup', element: <Signup /> },
    { path: '*', element: <ErrorPage /> },
  ]);

  return element;
}

export default App;
