import React, { useEffect, useState } from "react";
import { User } from "@nextui-org/react";
import { fetchGitHubUser } from '../../utils/githubApi';
import { UserCard } from "../Cards/UserCard";
import TitlePopover from "../UI/TitlePopover";

export const Avatar = ({ username }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchGitHubUser(username);
        setUserData(data);
      } catch (error) {
        console.error('Error fetching GitHub user:', error);
      }
    };

    fetchData();
  }, [username]);

  if (!userData) {
    return null;
  }

  return (
    <TitlePopover
      open={<User
        name={userData.name || ''}
        description={userData.location || ''}
        classNames={{
          base: "cursor-pointer",
          name: "text-base font-semibold",
          description: "uppercase"
        }}
        avatarProps={{
          className: "bg-gray-200 dark:bg-gray-700",
          src: userData.avatar_url
        }}
      />}
      content={<UserCard username={username} />}
            />
  );
};
