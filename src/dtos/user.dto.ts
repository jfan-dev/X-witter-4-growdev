export function mapUserProfile(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    profileImage: user.profileImage,
    createdAt: user.createdAt,

    tweets: user.tweets.map(tweet => ({
      id: tweet.id,
      content: tweet.content,
      createdAt: tweet.createdAt,
    })),

    followers: user.followers.map(f => ({
      id: f.follower.id,
      name: f.follower.name,
      profileImage: f.follower.profileImage,
    })),

    following: user.following.map(f => ({
      id: f.following.id,
      name: f.following.name,
      profileImage: f.following.profileImage,
    })),
  };
}