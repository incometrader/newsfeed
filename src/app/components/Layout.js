import React from 'react';
import { Link } from 'react-router';
import firebase from '../firebaseConfig';
import Nav from './layouts/Nav';
import Home from './Home';
import Newstore from '../stores/Newstore';
import * as NewsActions from '../actions/NewsActions';
import './Layout.scss';

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.getAll = this.getAll.bind(this);
    this.signOut = this.signOut.bind(this);
    this.state = {
      name: '',
      sort: [],
      id: '',
      news: [],
      sources: [],
      sortedNews: [],
      user: {},
    };
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log('User is signed in');
        const displayName = user.displayName;
        const email = user.email;
        const photoURL = user.photoURL;
        const uid = user.uid;
        user.getToken().then((accessToken) => {
          console.log('Layout User', user)
        });
      } else {
        console.log('User is signed out');
      }
    }, (error) => {
      console.log(error);
    });
  }

  signOut() {
    firebase.auth().signOut().then(function() {
      localStorage.removeItem('user');
      localStorage.removeItem('email');
      localStorage.removeItem('username');
			console.log('Signed Out');      
			window.location = "/login";
		}, function(error) {
			console.error('Sign Out Error', error);
		});
  }

  componentDidMount() {
    Newstore.on('change', this.getAll);
  }

  displayHeadlines(id, sort, name) {
    NewsActions.displayNews(id, sort, name);
  }

  getAll() {
    this.setState({
      news: Newstore.getNews().news,
      sortedNews: Newstore.getSortedNews(),
      id: Newstore.getNews().id,
      sort: Newstore.getNews().sort,
      name: Newstore.getNews().name,
      sources: Newstore.getSources(),
    });
  }

  render() {
    const { location } = this.props;
    return (
      <div>
        <Nav sources={this.state.sources} headlines={this.displayHeadlines.bind(this)} location={location} signOut={this.signOut}/>
        <div class="container-fluid">
          <Home {...this.state} headlines={this.displayHeadlines.bind(this)}/>
        </div>
      </div>
    );
  }
}

export default Layout;
