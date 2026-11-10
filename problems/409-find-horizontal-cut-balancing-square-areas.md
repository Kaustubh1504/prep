# Find horizontal cut balancing square areas
> Google · Onsite · medium · Pattern: Binary Search, Math / Number Theory
> Source: https://prachub.com/interview-questions/find-horizontal-cut-balancing-square-areas

面试一题目：
就是 在一个桌子上 桌子的左上角为原点（0，0）有无数个不重叠的 正方形蛋糕且大小不一
问 如何横着切一刀 （与x轴平行）切完之后被分开的两边的蛋糕面积之和相等

有趣的点是 左边上所有的数都是float 但是蛋糕的边长一定是整数（exp 1.0）但蛋糕的位置可能左上角在（1.2，2.1）这种位置 所以下刀的位置可能是float（exp y = 2.3）
我的思路：
二分法 在原点和最下边的那个蛋糕的最下边 之间搜索下刀位置 时间复杂度取决于我们要多精确 比如有些情况下刀的位置可能是1.1 或者 1.11 或者 1.111... 取决于我们想要小数点后几位停止二分法。

<details><summary>Hints (spoiler)</summary>

1. Let F(y) be the total area of all squares above the cut. What shape does F(y) have as y moves downward?
2. A valid search interval is from the smallest square top to the largest square bottom.
</details>
