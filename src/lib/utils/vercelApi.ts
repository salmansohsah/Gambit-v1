export async function getLatestDeployment() {
  const token = process.env.VERCEL_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  
  if (!token || !projectId) return null;

  try {
    const res = await fetch(`https://api.vercel.com/v6/deployments?projectId=${projectId}&limit=1`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 60 }
    });

    if (!res.ok) return null;
    
    const data = await res.json();
    if (!data.deployments || data.deployments.length === 0) return null;

    const deploy = data.deployments[0];
    return {
      id: deploy.uid,
      url: `https://${deploy.url}`,
      state: deploy.state, // e.g. READY, BUILDING, ERROR
      created: new Date(deploy.created).toISOString(),
    };
  } catch (e) {
    return null;
  }
}
