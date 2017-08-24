import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

import GetNews from './components/GetNews';
import SourcesInput from './components/SourcesInput';
import SelectSources from './components/SelectSources';
import Home from './components/Home';
import DefaultHome from './components/DefaultHome';

import Login from './components/Login';
import Register from './components/Register';
import Header from './components/Header'

class App extends Component {
   constructor() {
    super();
    this.state = {
      auth: false,
      user: null,
      currentPage: 'home',
      userSourcesApp:null,
      userSourcesAppLoaded:false
    }
    this.setPage = this.setPage.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
    this.logOut = this.logOut.bind(this);

    this.retrieveUserSources=this.retrieveUserSources.bind(this);
   }

  // PAGINATION

  setPage(page) {
    console.log('click');
    this.setState({
      currentPage: page,
    })
  }

  decideWhichPage() {
    switch(this.state.currentPage) {
      case 'home':
      if (this.state.auth){
          console.log ("testing auth ++"+ this.state.auth)
          console.log ("testing id ++"+ this.state.user)
          console.log ("testing sources ++"+ this.state.userSourcesApp)
          //return <p className="defualtTag">you are logged in</p>
          return <Home auth={this.state.auth} userSources={this.state.userSourcesApp}
          userID={this.state.user} />;
      }
      else return <DefaultHome/>
        break;
      case 'login':
        return <Login handleLoginSubmit={this.handleLoginSubmit} />;
        break;
      case 'register':
        return <Register handleRegisterSubmit={this.handleRegisterSubmit} />;
      default:
        break;
      case 'selectSources': 
        return  <SelectSources  auth={this.state.auth} userInfo={this.state.user} 
        retrieveUserSources={this.retrieveUserSources}/>

    }
  }

  

  // AUTH
  handleLoginSubmit(e, username, password) {
    e.preventDefault();
    axios.post('/auth/login', {
      username,
      password,
    }).then(res => {
      console.log ("55"+ res.data.user.id); 
      console.log ("55"+ res.data.user.username); 
      console.log ("55"+res.data.auth);

       this.setState({
          user: res.data.user.id
          
       });

      axios.post('/news/userSources',{user_id:res.data.user.id})
        .then(response => {
         
          console.log ("upon login, got the users sources successfully");
          console.log(response);
          console.log("array "+response.data.data);
          console.log("user id" +response.data.user_id);
          this.setState({//this retieves the current users homepage data(sources)
            auth: res.data.auth,
            userSourcesApp:response.data.data,//user resources array
            userSourcesAppLoaded:true,
           
            currentPage: 'home'
      });

        })
        .catch(function (error) {
          console.log(error);
        });



      
      console.log(this.state.auth)

    }).catch(err => console.log(err));
  }

  handleRegisterSubmit(e, username, password) {
    e.preventDefault();
    axios.post('/auth/register', {
      username,
      password,
    }).then(res => {
    
      this.setState({  
        auth: res.data.auth,
        user: res.data.user,
        currentPage: 'selectSources',
      });
    }).catch(err => console.log(err));
  }

  logOut() {
  axios.get('/auth/logout')
    .then(res => {
      console.log(res);
      this.setState({
        auth: false,
        userSourcesApp:null,//user resources array
        userSourcesAppLoaded:false,
        user: null,
        currentPage: 'home'
      });
      console.log ("logged out");
    }).catch(err => console.log(err));
} 

//GETTING user sources
 retrieveUserSources(sources_input_from_Back){
      //checking if the data was retieved
        if (sources_input_from_Back){
          console.log("sources are in-see below");
          console.log(sources_input_from_Back);
        }

        
       //setting the state of parent component-App.js
         this.setState({
           userSourcesApp:sources_input_from_Back.data,//user resources array
           userSourcesAppLoaded:true,
           userID: sources_input_from_Back.user_id,
            currentPage: 'home'
        })

        console.log("***************" +this.state.userID);
        console.log("%%%%%%%%%%%%%%%" +this.state.userSourcesApp);

    }



  render() {
    return (
      <div className="App">
        <Header setPage={this.setPage} logOut={this.logOut}/>
        {this.decideWhichPage()}
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
