import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock para listar materiais
  http.get('http://localhost:8080/materials', () => {
    return HttpResponse.json([
      { id: 1, name: 'Wood', stockQuantity: 50 },
      { id: 2, name: 'Metal', stockQuantity: 10 }
    ]);
  }),

  // Mock para criar material
  http.post('http://localhost:8080/materials', async ({ request }) => {
    const newMaterial = await request.json();
    return HttpResponse.json({ id: 3, ...newMaterial }, { status: 201 });
  }),
];