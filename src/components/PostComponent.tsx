import { supabase } from "@/lib/supabase";

export default function PostComponent({ post, onClick, index, visibleDescriptions }: { post: any, onClick: () => void, index: number, visibleDescriptions: boolean[] }) {
    console.log(supabase.storage.from("images"))
    return (
        <div
            className="masonry-box"
            key={"masonry"}
            onClick={onClick}
        >
            <img
                src={post.image_url}
                onError={(e)=>{
                    console.log(e.target)
                    e.target.onerror=null;
                    e.target.src=post.image_url
                }}
                alt={`Gallery`}
                className="caffee-image"
                style={{ height: `${150 + (index % 3) * 40}px` }}
            />
            <h2>{post.title}</h2>
            <p className={`description-text ${visibleDescriptions[index] ? "show" : ""}`}>
                {post.description}
            </p>
        </div>
    );
}
