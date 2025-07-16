import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import StartPage from '../components/StartPage';

vi.mock('@/lib/supabase', () => {
    const mockPostsData = [
        {
            id: 1,
            title: 'Mock Post',
            description: 'Mock Description',
            image_url: 'https://mock.image/post.jpg',
            created_at: new Date().toISOString(),
        }
    ];

    const mockLimit = vi.fn(() => ({
        data: mockPostsData,
        error: null,
    }));

    const mockSelect = vi.fn(() => ({
        limit: mockLimit,
    }));

    const mockFrom = vi.fn(() => ({
        select: mockSelect,
    }));

    return {
        supabase: {
            from: mockFrom,
        }
    };
});

describe('StartPage component', () => {
    it('renders posts fetched from Supabase', async () => {
        render(<StartPage />);

        await waitFor(() => {
            expect(screen.getByText('Mock Post')).toBeInTheDocument();
            expect(screen.getByText('Mock Description')).toBeInTheDocument();
            const imageElement = document.querySelector('img[src="https://mock.image/post.jpg"]');
            expect(imageElement).toBeInTheDocument();
            expect(imageElement).toHaveAttribute('src', 'https://mock.image/post.jpg');  });
    });
});