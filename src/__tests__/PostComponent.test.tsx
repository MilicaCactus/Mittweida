 
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PostComponent from "../components/PostComponent";

const mockPost = {
    image_url: "https://example.com/image.jpg",
    title: "Test Post",
    description: "This is a description.",
};

describe("PostComponent", () => {
    it("renders post image, title, and description", () => {
        render(
            <PostComponent
                post={mockPost}
                onClick={() => {}}
                index={0}
                visibleDescriptions={[true]}
            />
        );

        const img = screen.getByRole("img");
        expect(img).toHaveAttribute("src", mockPost.image_url);
        expect(screen.getByText("Test Post")).toBeInTheDocument();
        expect(screen.getByText("This is a description.")).toBeInTheDocument();
    });

    it('adds "show" class when visibleDescriptions[index] is true', () => {
        render(
            <PostComponent
                post={mockPost}
                onClick={() => {}}
                index={0}
                visibleDescriptions={[true]}
            />
        );

        const desc = screen.getByText(mockPost.description);
        expect(desc.className).toContain("show");
    });

    it('does NOT add "show" class when visibleDescriptions[index] is false', () => {
        render(
            <PostComponent
                post={mockPost}
                onClick={() => {}}
                index={0}
                visibleDescriptions={[false]}
            />
        );

        const desc = screen.getByText(mockPost.description);
        expect(desc.className).not.toContain("show");
    });

    it("calls onClick when post wrapper is clicked", () => {
        const handleClick = vi.fn();

        render(
            <PostComponent
                post={mockPost}
                onClick={handleClick}
                index={0}
                visibleDescriptions={[true]}
            />
        );

        fireEvent.click(screen.getByText(mockPost.title));
        expect(handleClick).toHaveBeenCalled();
    });

    it("handles image error fallback gracefully", () => {
        render(
            <PostComponent
                post={mockPost}
                onClick={() => {}}
                index={0}
                visibleDescriptions={[true]}
            />
        );

        const img = screen.getByRole("img");
        fireEvent.error(img);
        expect(img).toHaveAttribute("src", mockPost.image_url);
    });
});
