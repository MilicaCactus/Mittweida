import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase.ts";
import "./Visiting.css";

const Visiting = () => {
    const [posts, setPosts] = useState([]);
    const [visibleDescriptions, setVisibleDescriptions] = useState<boolean[]>([]);

    useEffect(() => {
        async function getPosts() {
            const { data } = await supabase.from("posts").select("*").limit(50);
            if (data) {
                setPosts(data);
                setVisibleDescriptions(Array(data.length).fill(false));
            }
        }
        getPosts();
    }, []);

    const toggleDescription = (index: number) => {
        const updated = [...visibleDescriptions];
        updated[index] = !updated[index];
        setVisibleDescriptions(updated);
    };

    return (
        <div className="visiting-container">
            {posts.map((post, index) => (
                <div className="visiting-card" key={index}>
                    <div className="image-container">
                        <img
                            src={post.image_url}
                            alt={post.title}
                            className="visiting-image"
                            onClick={() => toggleDescription(index)}
                        />
                        <div className="visiting-icon top-right">
                            <div className="icon map-pin">📍</div>
                        </div>
                        <div className="visiting-icon bottom-right">
                            <div className="icon bookmark">🔖</div>
                        </div>
                    </div>
                    <p className={`description-text ${visibleDescriptions[index] ? "show" : ""}`}>
                        {post.description}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default Visiting;