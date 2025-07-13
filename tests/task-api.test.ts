import { describe, it, expect } from 'vitest';
import { GET } from '@/app/api/tasks/route';

describe('Task API', () => {
  it('fetches tasks', async () => {
    // Create a mock request
    const mockRequest = new Request('http://localhost:3000/api/tasks');
    const res = await GET(mockRequest);
    expect(res.status).toBe(401); // Expecting 401 because no auth session
  });
}); 