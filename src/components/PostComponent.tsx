
type Post = {
    image_url: string;
    title: string;
    description: string;
};

export default function PostComponent({ post, onClick, index, visibleDescriptions }: { post: Post, onClick: () => void, index: number, visibleDescriptions: boolean[] }) {
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
