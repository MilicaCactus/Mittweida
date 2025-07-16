import GlobeImage from "../assets/globe.jpg";
//import CaffeeImage from "../assets/caffee.jpg";
//import Schule_mittweida from "../assets/schule_mittweida.jpg";
//import FlowersImage from "../assets/flowers.jpg";
//import Mittweida_marktplatz from "../assets/mittweida_marktplatz.jpg";
import {useEffect, useState} from "react";
import {supabase} from "@/lib/supabase.ts";
import PostComponent from "./PostComponent";


export default function StartPage() {
    //CaffeeImage,
    //Schule_mittweida,
    //FlowersImage,
    //Mittweida_marktplatz,
    //CaffeeImage,
    //FlowersImage,
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        async function getPosts(){
            const { data, error } = await supabase.from("posts").select("*").limit(50);
            if (error) throw error;
            if (data) {
                setPosts(data);
            }
        }
        getPosts();
    }, []);
    const [visibleDescriptions, setVisibleDescriptions] = useState<boolean[]>(
        Array(posts.length).fill(false)
    );

    const toggleDescription = (index: number) => {
        const updated = [...visibleDescriptions];
        updated[index] = !updated[index];
        setVisibleDescriptions(updated);
    };
    return (
        <>
            <div className="welcome-page">
                <img src={GlobeImage} alt="Globe" className="globe-image" />
            </div>

            <div className="info-section">
                <h1 className="main-heading">MITTWEIDA</h1>
                <div className="sub-options">
                    <span>Mitteilen</span>
                    <span>Mitmachen</span>
                    <span>Mitlaufen</span>
                </div>
                {/* <input
                    type="text"
                    className="search-input"
                    placeholder="Search Button..."
                    disabled

                /> */}
            </div>

            <div className="grid grid-cols-2 gap-1.5 p-5 w-full max-w-[1200px] mx-auto">
                {posts.sort((a,b)=>(new Date(b.created_at).getTime() - new Date(a.created_at).getTime())).map((post, index) => (
                    <PostComponent post={post} key={"post_"+index} index={index} visibleDescriptions={visibleDescriptions} onClick={() => toggleDescription(index)} />
                ))}
            </div>
        </>
)
}