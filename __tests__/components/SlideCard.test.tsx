import React from 'react';
import { render, screen } from '@testing-library/react';
import SlideCard from '@/components/SlideCard';

describe('SlideCard Component', () => {
  const mockProps = {
    title: 'Test Title',
    description: 'Test Description',
    date: '2024-01-01',
    imageUrl: '/test-image.jpg',
    link: '/test-link',
  };

  it('renders without crashing', () => {
    render(<SlideCard {...mockProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('displays the title correctly', () => {
    render(<SlideCard {...mockProps} />);
    const title = screen.getByText('Test Title');
    expect(title).toBeInTheDocument();
  });

  it('displays the description correctly', () => {
    render(<SlideCard {...mockProps} />);
    const description = screen.getByText('Test Description');
    expect(description).toBeInTheDocument();
  });

  it('displays the date correctly', () => {
    render(<SlideCard {...mockProps} />);
    const date = screen.getByText('2024-01-01');
    expect(date).toBeInTheDocument();
  });

  it('renders with left direction', () => {
    const { container } = render(<SlideCard {...mockProps} direction="left" />);
    expect(container.firstChild).toHaveClass('slide-left');
  });

  it('renders with right direction', () => {
    const { container } = render(<SlideCard {...mockProps} direction="right" />);
    expect(container.firstChild).toHaveClass('slide-right');
  });

  it('renders image when imageUrl is provided', () => {
    render(<SlideCard {...mockProps} />);
    const image = screen.getByRole('img', { name: /Test Title/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', expect.stringContaining('test-image.jpg'));
  });

  it('renders without image when imageUrl is not provided', () => {
    const propsWithoutImage = { ...mockProps, imageUrl: undefined };
    render(<SlideCard {...propsWithoutImage} />);
    const images = screen.queryAllByRole('img');
    expect(images.length).toBe(0);
  });

  it('has correct link href', () => {
    render(<SlideCard {...mockProps} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/test-link');
  });
});
