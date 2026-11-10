# Optimize 0/1 to bounded knapsack DP
> Google · Onsite · medium · Pattern: Dynamic Programming
> Source: https://prachub.com/interview-questions/optimize-0-1-to-bounded-knapsack-dp

4.7朋友内推投递的early career, 4.20 收到aha, 5.1 HR reach out ， 5.13hr call， no OA, no phone screen,直接on-site，3 coding+1bq. 很幸运的是3 coding都是国人，
第1轮是前缀树， 问题给的就不是很明白，然后做的时候很紧张，所以忘记储存结果，我直接返回的是最新的答案，她让d ry run 的时候，我发现了但是时间不只完成了coding，没有解释就没了， feel normal

第2轮 国人大，让我给所有的电影进行分类， 很顺利用BFS/dfs处理，然后d r y run, 我们之后再有讨论如果这道题还可以不同的方式解决，然后讨论如果用深搜的话有点在哪 ，或者别的方式，feel positive
第3轮是背包问题，非常经典，写的非常顺，但这个面试官就对我的dry run 要求很高，我dry run 了每一个结果，然后他将题目改为有限背包，但是我写下来后dry run的时候时间不够，但是跟面试官聊了其他的问很开心。feel postive
第4轮bq，一个信仰伊斯兰教的姐妹, 跟我在讨论如何boss的日常交流和跨组的日常交流，因为本人之前的工作经验，需要作为tech直接面见客户，同时要与一些营销团队ux/UI团队合作比较有心得所以就一直在交流。feel positive
reject ，after 一周，人力跟我说现在有一个人给你的result不好就行，所以冷冻1年
🔥

<details><summary>Hints (spoiler)</summary>

1. Define dp[i][w] = best value using the first i items at capacity w. Transition: skip item i-1 (dp[i-1][w]) or take it if it fits (dp[i-1][w-weight[i-1]] + value[i-1]).
2. To reconstruct, walk i from n down to 1: if dp[i][w] differs from dp[i-1][w], item i-1 was taken — subtract its weight from w and record the index.
3. For O(W) space you can collapse to one row iterated w from W down to weight[i-1], but you lose the per-step history needed to reconstruct unless you save decision bits.
</details>
