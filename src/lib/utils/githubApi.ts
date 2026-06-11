export async function getLatestCommit() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO; // e.g. "salman/gambit-v1"
  
  if (!token || !repo) return null;

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/commits?per_page=1`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json'
      },
      next: { revalidate: 60 } // cache for 60 seconds
    });

    if (!res.ok) return null;
    
    const data = await res.json();
    if (!data || data.length === 0) return null;

    return {
      hash: data[0].sha.substring(0, 7),
      message: data[0].commit.message,
      author: data[0].commit.author.name,
      date: data[0].commit.author.date,
      url: data[0].html_url
    };
  } catch (e) {
    return null;
  }
}
