import './App.css';
import { Router, Route} from "wouter"
import Visiting from "./components/Visiting";
import Header from "./components/Header.tsx";
import StartPage from "./components/StartPage.tsx";
import Footer from "./components/Footer.tsx";
import Saved from "@/components/saved.tsx";


function App() {
  return (
    <Router>
        <div className="App">
            <Header />
            <Route path="/" component={StartPage}/>
            <Route path="/visiting" component={Visiting}/>
            <Route path="/saved" component={Saved}/>
            <Footer />
        </div>
    </Router>
  );
}

export default App;