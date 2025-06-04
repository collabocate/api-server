import { Request } from 'express';
import { unAuthorizedErr } from '@lib/errors/Errors';

export const getIssuesService =  async () => {
    const response = await fetch(`${process.env.REPO_API_URL}/issues`, {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
        },
    });
    if (response.status === 401) {
      unAuthorizedErr("Unauthorized: Can't access this resource");
  }
    const data = await response.json();
    return data;
}
  
export const createIssueService =  async (req: Request) => {
    const { title, body } = req.body;
    const response = await fetch(`${process.env.REPO_API_URL}/issues`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({ 
          title: `[GitHubSync] ${title}`,
          body: body + '\n\n' + '#' + '\n' + '> Submitted via **Collabocate** [[GitHubSync]](https://github.com/collabo-community/collabocate)',
        }),
    });

    if (response.status === 401) {
     unAuthorizedErr("Unauthorized: Can't access this resource");
  }

    const data = await response.json();
    return data;
}
  
export const getPullRequestsService =  async () => {
    const response = await fetch(`${process.env.REPO_API_URL}/pulls`, {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
        },
    });

    if (response.status === 401) {
      unAuthorizedErr("Unauthorized: Can't access this resource");
  }

    const data = await response.json();
    return data;
}

export const getRepositoriesService =  async () => {
    const response = await fetch(`${process.env.GITHUB_API_BASE_URL}/user/repos`, {
        headers: {
            Authorization: `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
          },
        }
    );

    if (response.status === 401) {
      unAuthorizedErr("Unauthorized: Can't access this resource");
  }

    const data = await response.json();
    return data;
}

export const getIssueTemplatesService = async () => {

  const response = await fetch(`${process.env.REPO_API_URL}/contents/.github/ISSUE_TEMPLATE`, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
    },
  });

  if (response.status === 401) {
    unAuthorizedErr("Unauthorized: Can't access this resource");
  }

  const data = await response.json();
  return data;
}

export const getIssueTemplatesContentService = async () => {
  const template = await getIssueTemplatesService();

  const templateContents = await Promise.all(
    template.map(async (req: { name: string; download_url: string }) => {
      const contentResponse = await fetch(req.download_url);
      if (contentResponse.status === 401) {
        unAuthorizedErr(`Unauthorized: Can't access ${req.download_url}`);
      }
      const content = await contentResponse.text();
      let contentText;
      let contentMetadata;
      const findIndex = content.indexOf('<!-- Issue template by Collabo Community -->');
      if (findIndex !== -1) {
        contentMetadata = content.slice(0, findIndex).trim(); 
        contentText = content.slice(findIndex + 46).trim();
      }

      const formatTitle =req.name.replace('.md', '').split('-').join(' ').replace(/^./, char => char.toUpperCase());
      return { title: formatTitle, metadata:contentMetadata, content: contentText};
    })
  );

  return templateContents;
};