import objectToQueryString from "../utils/objectToQueryString";
import { transformAPIKeyToCamel } from "../utils/transformAPIKeyToCamel";

export interface GithubReposParams {
  q: string;
  per_page: number;
  page: number;
}
export interface GithubReposResponse {
  incompleteResults: boolean;
  totalCount: number;
  items: {
    id: number;
    nodeId: string;
    name: string;
    fullName: string;
    private: boolean;
    owner: {
      login: string;
      id: number;
      nodeId: string;
      avatarUrl: string;
      gravatarId: string;
      url: string;
      htmlUrl: string;
      followersUrl: string;
      followingUrl: string;
      gistsUrl: string;
      starredUrl: string;
      subscriptionsUrl: string;
      organizationsUrl: string;
      reposUrl: string;
      eventsUrl: string;
      receivedEventsUrl: string;
      type: string;
      siteAdmin: boolean;
    };
    htmlUrl: string;
    description: string;
    fork: boolean;
    url: string;
    forksUrl: string;
    keysUrl: string;
    collaboratorsUrl: string;
    teamsUrl: string;
    hooksUrl: string;
    issue_eventsUrl: string;
    eventsUrl: string;
    assigneesUrl: string;
    branchesUrl: string;
    tagsUrl: string;
    blobsUrl: string;
    git_tagsUrl: string;
    git_refsUrl: string;
    treesUrl: string;
    statusesUrl: string;
    languagesUrl: string;
    stargazersUrl: string;
    contributorsUrl: string;
    subscribersUrl: string;
    subscriptionUrl: string;
    commitsUrl: string;
    git_commitsUrl: string;
    commentsUrl: string;
    issue_commentUrl: string;
    contentsUrl: string;
    compareUrl: string;
    mergesUrl: string;
    archiveUrl: string;
    downloadsUrl: string;
    issuesUrl: string;
    pullsUrl: string;
    milestonesUrl: string;
    notificationsUrl: string;
    labelsUrl: string;
    releasesUrl: string;
    deploymentsUrl: string;
    createdAt: string;
    updatedAt: string;
    pushedAt: string;
    gitUrl: string;
    sshUrl: string;
    cloneUrl: string;
    svnUrl: string;
    homepage: string;
    size: number;
    stargazersCount: number;
    watchersCount: number;
    language: string;
    hasIssues: boolean;
    hasProjects: boolean;
    hasDownloads: boolean;
    hasWiki: boolean;
    hasPages: boolean;
    forksCount: number;
    mirrorUrl: string | null;
    archived: boolean;
    disabled: boolean;
    openIssuesCount: number;
    license: string | null;
    allowForking: boolean;
    isTemplate: boolean;
    topics: any[];
    visibility: string;
    forks: number;
    openIssues: number;
    watchers: number;
    defaultBranch: string;
    score: number;
  }[];
}

interface GitHubAPIType {
  fetchGithubRepos: (params: GithubReposParams) => Promise<GithubReposResponse>;
}

const GithubAPI: GitHubAPIType = {
  fetchGithubRepos: async (params) => {
    const responseFetch = await fetch(
      `https://api.github.com/search/repositories?${objectToQueryString(
        params
      )}`
    );
    const response = await responseFetch.json();
    return transformAPIKeyToCamel(response);
  },
};

export default GithubAPI;
