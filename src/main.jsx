import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import Layout from './layouts/Layout'
import CommView from './routes/CommView'
import CreatePost from './routes/CreatePost'
import UpdatePost from './routes/UpdatePost'
import ViewMore from './routes/ViewMore'
import Profile from './routes/Profile'
import NotFound from './routes/NotFound'
import Intro from './routes/Intro'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Layout />}>
          <Route index path="/" element={<Intro />}/>
          <Route path="/comm-view" element={<CommView />}/>
          <Route path="/create" element={<CreatePost />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/update/:id" element={<UpdatePost />} />
          <Route path="/view_more/:id" element={<ViewMore />} />
        </Route>
        <Route path="*" element={<NotFound />} />

      </Routes>

    </BrowserRouter>

  </StrictMode>,
)
