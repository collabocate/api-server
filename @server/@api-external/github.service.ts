import { badRequestErr, notFoundErr, unAuthorizedErr } from '@lib/errors/Errors';
import { UserModel as User } from '@server/@api-user/user.model';
import { TokenModel as Token, TokenIssuer, TokenType } from '@server/api-token/token.model';
import { ReqUser } from '@ts-types/index';

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
  
export const createIssueService =  async (req: ReqUser) => {
  const user = await User.findById(req.user._id).exec();
  if(!user){
    notFoundErr('User not found');
  }
  const token = await Token.findOne({user:user, issuer: TokenIssuer.Github, type: TokenType.Access}).exec();

    const { title, body } = req.body;
    const response = await fetch(`${process.env.REPO_API_URL}/issues`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token.token}` : `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
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
  const templates = await getIssueTemplatesService();

  const data = await Promise.all(
    templates.map(async (req: { name: string; download_url: string }) => {
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

  return data;
};

export const revokeGithubAccessToken = async (github_access_token: string) => {
  
  const response = await fetch(`https://api.github.com/applications/${process.env.GITHUB_CLIENT_ID as string}/token`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': 'Basic ' + Buffer.from(`${process.env.GITHUB_CLIENT_ID as string}:${process.env.GITHUB_CLIENT_SECRET as string}`).toString('base64'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      access_token: github_access_token,
    }),
  });

  if (response.status === 401) {
    unAuthorizedErr("Unauthorized: Can't access this resource");
  }
  if (!response.ok) {
    badRequestErr("Failed to Revoke Token")
  }
}

export const revokeGithubAccessTokenService = async (user_id: string) => {
  const user = await User.findById(user_id).exec();
  if(!user){
    notFoundErr('User not found');
  }
  const token = await Token.findOne({user:user, issuer: TokenIssuer.Github, type: TokenType.Access}).exec();

  if (!token){
    badRequestErr("user has no github access token to revoke");
  }

  revokeGithubAccessToken(token.token);

  await Token.deleteOne({user:user, issuer: TokenIssuer.Github, type: TokenType.Access});
}