import DesignApp from './designApp';
import ManageWebsites from './manageWebsites/manageWebsites';
import PreviewPage from './previewPage/previewPage';
import WebPage from './web/webPage';
import Homepage from './Homepage/homepage';
import NotFound from './NotFound/notFound'
import LoginPage from './auth/LoginPage/loginPage';
import SignupPage from './auth/signupPage/signupPage';

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} exact>

        </Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/signup" element={<SignupPage />}></Route>
        <Route path="/web/:websiteId/:pageUri" element={<WebPage />} exact>

        </Route>
        <Route path="/my-websites" element={<ManageWebsites />}></Route>
        <Route path="/designer" element={<Navigate to="/my-websites" />}></Route>
        <Route path="/designer/:websiteId/" element={<Navigate to="/my-websites" />}></Route>
        <Route path="/designer/:websiteId/:pageId" element={<DesignApp />}></Route>
        <Route path="/preview/" element={<DesignApp />}></Route>
        <Route path="/preview/:websiteId/" element={<DesignApp />}></Route>
        <Route path="/preview/:websiteId/:pageId" element={<PreviewPage />}></Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
