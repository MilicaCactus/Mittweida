import './App.css';
import { Router, Route, useLocation } from "wouter";
import Visiting from "./components/Visiting";
import Header from "./components/Header.tsx";
import StartPage from "./components/StartPage.tsx";
import Footer from "./components/Footer.tsx";
import Saved from "@/components/saved.tsx";
import { Profile } from "@/components/profile.tsx";
import Auth from "@/components/LoginComponent.tsx";
import { useAuth } from './components/hooks/LoginProvider.tsx';

function App() {
    const [location] = useLocation();
    const hideHeaderOn: string[] = ['/profile'];
    const shouldShowHeader: boolean = !hideHeaderOn.includes(location);
    const { authReady, isLoggedIn, guard } = useAuth();
    if (!authReady) return <></>;
    return (
        <Router>
            <div className="App">
                {shouldShowHeader && <Header />}
                <Auth />
                <Route path="/" component={StartPage} />
                <Route path="/visiting" component={Visiting} />
                <Route path="/saved" component={Saved} />
                <Route path="/profile" component={Profile} />

                <Footer />
            </div>
        </Router>
    );
}

export default App;
