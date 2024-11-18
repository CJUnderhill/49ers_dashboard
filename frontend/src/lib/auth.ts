const getAuthToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL! + "/auth", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: process.env.NEXT_PUBLIC_USERNAME,
        password: process.env.NEXT_PUBLIC_PASSWORD,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to authenticate');
    }

    const data = await response.json();
    return data.jwt || null;
  } catch (error) {
    console.error('Error fetching token:', error);
    return null;
  }
};

export default getAuthToken;
