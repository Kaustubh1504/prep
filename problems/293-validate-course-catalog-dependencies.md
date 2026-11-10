# Validate course catalog dependencies
> Google · Technical Screen · medium · Pattern: Topological Sort, Graph BFS / DFS
> Source: https://prachub.com/interview-questions/validate-course-catalog-dependencies

第一轮：技术面
面试官是一个印度小哥，说话口音非常重，语速也快，理解起来很费力。全程我基本靠连蒙带猜他在问什么。 这轮提出的是一道二叉树遍历的题目（Leetcode 原题或相似变种）。题目核心是给定一个二叉树的根节点root，要求实现Zigzag (锯齿形) 层序遍历。这其实就是 Leetcode 103. Binary Tree Zigzag Level Order Traversal的原题。面试官问思路时，我的第一反应是中序遍历。 在意识到中序不对的瞬间，我又改口到应该用后序遍历 (Postorder)。面试官苦笑着表示其实一开始的中序遍历思路，如果能改成按层处理，勉强算个起点，但更直接的标准解法是用队列进行BFS)。在面试官提示了BFS/队列这个核心关键词后，我才终于回到正轨。虽然磕磕绊绊写完了代码（加入了方向切换），但时间浪费太多，肯定不是最优表现。
第二轮：电面
面试官给的是一道课程依赖验证题，要求设计函数检测e-learning平台的课程目录合法性。我的思路是通过双维度检测算法对缺失课程进行检测。 然后通过循环依赖检测（拓扑排序）来构建图和入度字典。建图方向按照被依赖课 → 依赖课进行设计。最后进行整合验证就可以啦。

第三轮：Coding
题目是一道数组/字符串处理 + 滑动窗口 (Sliding Window) 变种。给定一个字符串s和一个整数 k，要求找到包含至多k个不同字符的最长子串 (substring)的长度。这道题非常适合使用滑动窗口 (Sliding Window)配合哈希表 (HashMap)来解决。目标是维护一个窗口[left, right]，确保窗口内不同字符的数量不超过k，并在此约束下找到最大窗口长度。面试官全程认真听，在我提到“滑动窗口”和“哈希表”时表示赞同，并在关键步骤（收缩条件、更新maxLen时机）进行点头确认。他说“Good, you are on the right track.”
第四轮：电面
题目是一道delete log的题。面试官要求设计日志管理类，核心需求是：
1.所有文件日志总数不超过total_max
2.添加日志需自动清理旧数据
3.决策删除“最不重要”的日志
首先我做的是控制容量，让单文件日志≤X，全局日志≤max_length（双阈值触发清理）。做到高效决策也是很重要的，如何在O(1)时间定位待删日志？首先是要确认关键边界，区分日志优先级，引入权重因子。然后是双维度数据结构设计，时间序双向队列进行文件级存储。删除策略在里同样适用，单文件超限时直接踢队首，全局超限时，进行堆顶删除和级联更新。

<details><summary>Hints (spoiler)</summary>

1. Separate the two failure modes: a missing reference (an ID in some pair that is not in the catalog) and a cycle (a circular dependency). Scan all pairs once to collect missing IDs before touching the graph.
2. Build the dependency graph only over courses that actually exist, with edge u -> v for each pair (u, v). Track in-degree per node.
3. Use Kahn's algorithm (BFS on in-degree-zero nodes). If the produced ordering contains every catalog course, the graph is acyclic; if it is shorter, a cycle exists among the nodes that never reached in-degree zero.
4. To report one concrete cycle, run a DFS restricted to the nodes that still have positive in-degree after Kahn's sort; the first gray (on-stack) node you revisit closes a cycle — slice it out of the current DFS path.
5. For deterministic output, break ties in lexicographic order whenever multiple nodes are simultaneously ready.
</details>
