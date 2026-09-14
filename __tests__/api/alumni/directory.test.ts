import { GET } from '@/app/api/alumni/directory/route';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

// Mock Prisma
jest.mock('@/lib/prisma');

describe('Alumni Directory API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockAlumniData = [
    {
      id: '1',
      name: 'John Doe',
      degreeLevel: 'PhD',
      researchTopic: 'Machine Learning',
      status: 'alumni',
      thesisTitle: 'AI Research',
      graduationYear: 2023,
      currentPosition: 'Data Scientist',
      profileUrl: 'https://example.com/profile',
      photoUrl: '/photo.jpg',
      achievements: [],
    },
    {
      id: '2',
      name: 'Jane Smith',
      degreeLevel: 'Masters',
      researchTopic: 'Computer Vision',
      status: 'alumni',
      thesisTitle: 'Vision Systems',
      graduationYear: 2022,
      currentPosition: 'ML Engineer',
      profileUrl: 'https://example.com/profile2',
      photoUrl: '/photo2.jpg',
      achievements: [],
    },
  ];

  it('should return all alumni when no filters applied', async () => {
    (prisma.student.findMany as jest.Mock).mockResolvedValue(mockAlumniData);

    const request = new NextRequest('http://localhost:3000/api/alumni/directory');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.alumni).toEqual(mockAlumniData);
    expect(prisma.student.findMany).toHaveBeenCalledWith({
      where: { status: 'alumni' },
      select: expect.any(Object),
      orderBy: { graduationYear: 'desc' },
    });
  });

  it('should filter by search query', async () => {
    (prisma.student.findMany as jest.Mock).mockResolvedValue([mockAlumniData[0]]);

    const request = new NextRequest('http://localhost:3000/api/alumni/directory?search=John');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.alumni).toHaveLength(1);
    expect(prisma.student.findMany).toHaveBeenCalledWith({
      where: {
        status: 'alumni',
        OR: [
          { name: { contains: 'John', mode: 'insensitive' } },
          { researchTopic: { contains: 'John', mode: 'insensitive' } },
          { currentPosition: { contains: 'John', mode: 'insensitive' } },
        ],
      },
      select: expect.any(Object),
      orderBy: { graduationYear: 'desc' },
    });
  });

  it('should filter by graduation year', async () => {
    (prisma.student.findMany as jest.Mock).mockResolvedValue([mockAlumniData[0]]);

    const request = new NextRequest('http://localhost:3000/api/alumni/directory?graduationYear=2023');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(prisma.student.findMany).toHaveBeenCalledWith({
      where: {
        status: 'alumni',
        graduationYear: 2023,
      },
      select: expect.any(Object),
      orderBy: { graduationYear: 'desc' },
    });
  });

  it('should handle errors gracefully', async () => {
    (prisma.student.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost:3000/api/alumni/directory');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to load alumni');
  });

  it('should return empty array when no alumni found', async () => {
    (prisma.student.findMany as jest.Mock).mockResolvedValue([]);

    const request = new NextRequest('http://localhost:3000/api/alumni/directory');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.alumni).toEqual([]);
  });
});
