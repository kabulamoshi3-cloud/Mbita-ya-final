import { GET, POST } from '@/app/api/alumni/jobs/route';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

// Mock Prisma
jest.mock('@/lib/prisma');

describe('Alumni Jobs API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockJobsData = [
    {
      id: '1',
      postedBy: 'user1',
      title: 'Software Engineer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      type: 'full-time',
      description: 'Full-time software engineering position',
      requirements: 'BS in CS',
      salary: '$100k - $150k',
      applyUrl: 'https://example.com/apply',
      active: true,
      expiresAt: new Date('2024-12-31'),
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      postedBy: 'user2',
      title: 'Data Scientist',
      company: 'AI Labs',
      location: 'Remote',
      type: 'contract',
      description: 'Contract data science role',
      requirements: 'MS in Statistics',
      salary: '$120k - $180k',
      applyUrl: 'https://example.com/apply2',
      active: true,
      expiresAt: null,
      createdAt: new Date('2024-01-15'),
    },
  ];

  describe('GET /api/alumni/jobs', () => {
    it('should return all active jobs', async () => {
      (prisma.jobPosting.findMany as jest.Mock).mockResolvedValue(mockJobsData);

      const request = new NextRequest('http://localhost:3000/api/alumni/jobs');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.jobs).toEqual(mockJobsData);
      expect(prisma.jobPosting.findMany).toHaveBeenCalledWith({
        where: { active: true },
        select: expect.any(Object),
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter by job type', async () => {
      (prisma.jobPosting.findMany as jest.Mock).mockResolvedValue([mockJobsData[0]]);

      const request = new NextRequest('http://localhost:3000/api/alumni/jobs?type=full-time');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.jobs).toHaveLength(1);
      expect(prisma.jobPosting.findMany).toHaveBeenCalledWith({
        where: {
          active: true,
          type: 'full-time',
        },
        select: expect.any(Object),
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter by search query', async () => {
      (prisma.jobPosting.findMany as jest.Mock).mockResolvedValue([mockJobsData[0]]);

      const request = new NextRequest('http://localhost:3000/api/alumni/jobs?search=Software');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(prisma.jobPosting.findMany).toHaveBeenCalledWith({
        where: {
          active: true,
          OR: [
            { title: { contains: 'Software', mode: 'insensitive' } },
            { company: { contains: 'Software', mode: 'insensitive' } },
            { location: { contains: 'Software', mode: 'insensitive' } },
          ],
        },
        select: expect.any(Object),
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should handle errors gracefully', async () => {
      (prisma.jobPosting.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/alumni/jobs');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to load jobs');
    });
  });

  describe('POST /api/alumni/jobs', () => {
    const validJobData = {
      title: 'New Position',
      company: 'New Company',
      location: 'New York, NY',
      description: 'A new job opportunity',
      jobType: 'full_time',
      salary: '$90k - $120k',
      applyUrl: 'https://example.com/new-job',
      postedBy: 'user123',
    };

    it('should create a new job posting with valid data', async () => {
      const createdJob = {
        id: '3',
        ...validJobData,
        type: validJobData.jobType,
        active: true,
        createdAt: new Date(),
      };

      (prisma.jobPosting.create as jest.Mock).mockResolvedValue(createdJob);

      const request = new NextRequest('http://localhost:3000/api/alumni/jobs', {
        method: 'POST',
        body: JSON.stringify(validJobData),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.message).toBe('Job posted');
      expect(data.job).toEqual(createdJob);
    });

    it('should reject invalid data', async () => {
      const invalidData = {
        title: '', // Invalid: empty title
        company: 'Company',
        location: 'Location',
        description: 'Description',
        jobType: 'full_time',
        applyUrl: 'not-a-url', // Invalid URL
      };

      const request = new NextRequest('http://localhost:3000/api/alumni/jobs', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
      expect(data.fields).toBeDefined();
    });

    it('should handle database errors', async () => {
      (prisma.jobPosting.create as jest.Mock).mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/alumni/jobs', {
        method: 'POST',
        body: JSON.stringify(validJobData),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to post job');
    });
  });
});
