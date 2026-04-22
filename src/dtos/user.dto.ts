export function mapUserProfile(user: any) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    profileImage: user.profileImage,
    createdAt: user.createdAt,

    xweets: user.xweets.map((xweet: any) => ({
      id: xweet.id,
      content: xweet.content,
      createdAt: xweet.createdAt,
    })),

    followers: user.followers.map((f: any) => ({
      id: f.follower.id,
      name: f.follower.name,
      profileImage: f.follower.profileImage,
    })),

    following: user.following.map((f: any) => ({
      id: f.following.id,
      name: f.following.name,
      profileImage: f.following.profileImage,
    })),
  };
}