# Count user sessions from logs
> Google · Onsite · medium · Pattern: Simulation, Sorting
> Source: https://prachub.com/interview-questions/count-user-sessions-from-logs

前几天刚面了 Google 的 SRE 岗位，整体难度不算特别偏算法，而是偏 系统设计 + 实际 troubleshooting + coding。

面试内容
        1.        Coding（LeetCode 风格）
        •        考了一道关于字符串处理的题目：给一个 log 文件，每一行是 “timestamp, user, action”，要求统计每个用户的 session 数。
        •        类似变形的 “grouping + sliding window”，我用了 Python 写，面试官还追问了时间复杂度和如何优化。
        2.        Linux & Networking

        •        问了几个排查问题：
        •        一台机器 CPU 占用飙高怎么处理？
        •        如果服务延迟高，怎么用 netstat / tcpdump / traceroute 来排查？
        •        问了 DNS 解析流程，以及 dig 和 nslookup 的区别。
        3.        SRE 概念
        •        解释 SLI / SLO / SLA 的区别，并给了一个场景让我设定合理的 error budget。
        •        问了怎么设计一个监控报警系统，如何避免告警风暴（alert fatigue）。
        4.        Distributed System Trouble Shooting
        •        问了一个经典问题：一个分布式数据库出现数据不一致，可能的原因和排查思路？
        •        我答了：replication lag、leader election、clock skew、network partition 等。
        5.        设计一个简单的 rate limiter（限流器），保证 API 调用不超过 QPS。
        •        我答了两种方案：
        •        令牌桶算法 (token bucket)
        •        滑动窗口 (sliding window)
        •        面试官继续追问如何做成分布式环境下的一致性方案等

<details><summary>Hints (spoiler)</summary>

1. Group events by user first (a hash map of user -> list of timestamps), then sort each user's timestamps. Don't assume the input is sorted.
2. Count starts at 1 for any user with at least one valid event; increment only when consecutive sorted timestamps differ by MORE than T minutes.
3. Be careful with the boundary: a gap of exactly T minutes must stay in the same session, so use a strict `>` comparison on the gap in seconds.
4. For data that does not fit in memory, external-sort the lines by (user, timestamp) and stream them — the per-user counting logic is identical to the in-memory version.
</details>
