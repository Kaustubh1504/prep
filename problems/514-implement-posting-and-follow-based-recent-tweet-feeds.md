# Implement Posting and Follow-Based Recent Tweet Feeds
> Google · Other · medium · Pattern: Design / Data Structure, Heap / Top-K
> Source: https://prachub.com/interview-questions/implement-posting-and-follow-based-recent-tweet-feeds

### Problem

Implement Twitter with postTweet, getNewsFeed, follow and unfollow. A feed contains at most ten most recent tweet IDs posted by the user or their currently followed users, newest first. Tweet IDs are unique identifiers, not chronological values. Follow/unfollow alter whose stored tweets are eligible; preserve all constructor and method signatures.

```cpp
class Twitter {
public:
    Twitter();
    void postTweet(int userId, int tweetId);
    vector<int> getNewsFeed(int userId);
    void follow(int followerId, int followeeId);
    void unfollow(int followerId, int followeeId);
};
```

### Examples

```text
Twitter(); postTweet(1,8); follow(1,2); postTweet(2,3); getNewsFeed(1) -> [3,8]; unfollow(1,2); getNewsFeed(1) -> [8]
Twitter(); getNewsFeed(4) -> []
```

### Constraints

- User/follower/followee IDs lie in [1,500].
- Tweet IDs lie in [0,10000] and all posted IDs are unique.
- At most 30000 total method calls occur.
- A user cannot follow themself.
