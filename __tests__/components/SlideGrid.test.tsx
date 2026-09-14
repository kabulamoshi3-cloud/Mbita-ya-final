import React from 'react';
import { render, screen } from '@testing-library/react';
import SlideGrid from '@/components/SlideGrid';

describe('SlideGrid Component', () => {
  const mockItems = [
    {
      id: '1',
      title: 'Item 1',
      description: 'Description 1',
      date: '2024-01-01',
      link: '/item-1',
    },
    {
      id: '2',
      title: 'Item 2',
      description: 'Description 2',
      date: '2024-01-02',
      link: '/item-2',
    },
    {
      id: '3',
      title: 'Item 3',
      description: 'Description 3',
      date: '2024-01-03',
      link: '/item-3',
    },
  ];

  it('renders without crashing', () => {
    render(<SlideGrid items={mockItems} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  it('renders all items', () => {
    render(<SlideGrid items={mockItems} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('renders empty state when no items provided', () => {
    const { container } = render(<SlideGrid items={[]} />);
    expect(container.querySelector('.grid')).toBeEmptyDOMElement();
  });

  it('alternates direction by default', () => {
    const { container } = render(<SlideGrid items={mockItems} />);
    const cards = container.querySelectorAll('.slide-card');
    
    // First card should be left, second right, third left
    expect(cards[0]).toHaveClass('slide-left');
    expect(cards[1]).toHaveClass('slide-right');
    expect(cards[2]).toHaveClass('slide-left');
  });

  it('applies left direction to all cards when specified', () => {
    const { container } = render(<SlideGrid items={mockItems} direction="left" />);
    const cards = container.querySelectorAll('.slide-card');
    
    cards.forEach(card => {
      expect(card).toHaveClass('slide-left');
    });
  });

  it('applies right direction to all cards when specified', () => {
    const { container } = render(<SlideGrid items={mockItems} direction="right" />);
    const cards = container.querySelectorAll('.slide-card');
    
    cards.forEach(card => {
      expect(card).toHaveClass('slide-right');
    });
  });

  it('renders with custom className', () => {
    const { container } = render(<SlideGrid items={mockItems} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
