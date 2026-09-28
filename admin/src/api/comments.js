import { baseUrl } from "./config.js";


//get comment method
export async function getComments() {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${baseUrl}/admin/comments`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    alert("Failed do get comments");
    return;
  }

  const data = await response.json();

  return data.data;
}


//delete comment method
export async function deleteComment(movieId, commentId) {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(
    `${baseUrl}/admin/movies/${movieId}/comment/${commentId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    alert("Failed to delete comment");
    return;
  }

  return await response.json();
}
