import React from "react";
import { GithubReposResponse } from "../api/GitubAPI";
import "./GithubCard.css";

type Props = {
  cardData: GithubReposResponse["items"][0];
};

export default function GithubCard(props: Props) {
  const { cardData } = props;

  return (
    <article>
      <a
        href={cardData.htmlUrl}
        target="_blank"
        className="card-wrapper"
        rel="noreferrer"
      >
        <img
          className="card-img"
          src={cardData.owner.avatarUrl}
          alt={cardData.owner.login}
        />
        <div>
          <h2 className="card-title">{cardData.fullName}</h2>
          <p className="card-description">{cardData.description}</p>
        </div>
      </a>
    </article>
  );
}
