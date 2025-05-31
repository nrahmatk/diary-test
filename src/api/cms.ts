import { apiClient } from "./client";

/**
 * Fetch paginated list of diary content for infinite scroll
 */
export async function getDiaryFeed({ offset = 0, limit = 6 } = {}) {
  return apiClient.get("/cms/diary", {
    offset,
    limit,
    status: "posted",
  });
}

/**
 * Fetch specific diary content by IDs
 */
export async function getDiaryFeedByIds() {
  const ids = [
    359007, 358317, 343275, 342861, 342723, 342240, 341343, 296907, 253782,
    177123,
  ];

  return apiClient.get("/cms/diary", {
    id: ids,
    status: "posted",
  });
}

/**
 * Fetch diary content by specific id for detail page
 */
export async function getDiaryContentById(id: string) {
  if (!id) {
    throw new Error("ID is required");
  }

  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new Error("Invalid ID format");
  }

  const response = await apiClient.get("/cms/diary", {
    id: [numericId],
    status: "posted",
  });

  return response.content?.[0] || null;
}
