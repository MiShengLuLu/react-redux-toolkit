
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Container from './components/Todos/Container'

// const Container = React.lazy(() => import('./components/Todos/Container'))

function App() {
  return (
    <Routes>
      <Route path="/" element={<Container />}>
        <Route path="active" element={<Container />}></Route>
        <Route path="completed" element={<Container />}></Route>
      </Route>
    </Routes>
  );
}

export default App;
