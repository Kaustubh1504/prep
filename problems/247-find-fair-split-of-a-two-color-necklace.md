# Find fair split of a two-color necklace
> Google · Onsite · medium · Pattern: Sliding Window, Two Pointers
> Source: https://prachub.com/interview-questions/find-fair-split-of-a-two-color-necklace

05/13 phone screen 的 phone interview 过了 但是感觉过的比较勉强吧 但题目还挺有趣的 想分享一下 求米
题目：

就是说有有两种gem （a, b) 在一根项链上，他们的个数分别都是基数  => aabbababb
请问 怎么用最多两刀分成三份 把这三分分给两个人 这两个人得到的gem的每种的数量是一样的
我的思路：
就先 暴力解法 然后优化的时候 就用sliding window （size == 项链size/2）这样的话 遍历的时候记录sliding window里面的各种gem的个数 看是不是总个数的一半
follow up：
要是有三种gem呢，我可以切三刀分成4份 分给2个人 这两个人得到的gem的每种的数量是一样的
