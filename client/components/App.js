import React, { Component } from "react";
import { createStore, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import { Route, HashRouter, Link } from 'react-router-dom';


const TOGGLE = 'TOGGLE';

const toggle = (item)=> {
  return {
    type: TOGGLE,
    item
  };
};
const groceriesReducer = (state = [
  { id: 1, name: 'olives', bought: false},
  { id: 2, name: 'vodka', bought: true},
  { id: 3, name: 'shaker', bought: true},
  { id: 4, name: 'glass', bought: true}
], action) => {
  switch(action.type){
    case TOGGLE:
      return state.map( item => {
        if(item.id !== action.item.id){
          return item;
        }
        return { ...item, bought: !item.bought };
      })
  }
  return state;
}

const reducer = combineReducers({
  groceries: groceriesReducer
});

const store = createStore(reducer);

const _List = ({ groceries, toggle})=> {
  return (
    <div className="list">
      <ul>
        {
          groceries.map( item => <li onClick={ ()=> toggle(item)} style={{ textDecoration : item.bought ? 'line-through' : ''}} key={ item.id }>{ item.name }</li>)
        }
      </ul>
    </div>
  );
};

const List = connect(({ groceries }, { match })=> {
  let filtered = groceries;
  if(match.params.status){
    if(match.params.status === 'bought'){
      filtered = groceries.filter( item => item.bought);
    }
    else {
      filtered = groceries.filter( item => !item.bought);
    }
  }
  return {
    groceries: filtered
  };
}, (dispatch)=> {
  return {
    toggle: (item)=> dispatch(toggle(item))
  };
})(_List);

const App = () => (
  <Provider store={ store }>
    <HashRouter>
      <div className="app">
        <img src="groceries.png" alt="Groceries" width="500" />
        <Route path='/:status?' component={ List } /> 
        <div className="footer">
          <Link to='/bought'>Bought</Link>
          {' ' }
          <Link to='/not-bought'>Not Bought</Link>
          {' ' }
          <Link to='/'>All</Link>
        </div>
      </div>
    </HashRouter>
  </Provider>
);

export default App;
