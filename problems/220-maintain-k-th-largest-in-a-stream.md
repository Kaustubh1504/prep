# Maintain k-th largest in a stream
> Google · Onsite · medium · Pattern: Heap / Top-K, Design / Data Structure, Simulation
> Source: https://prachub.com/interview-questions/maintain-k-th-largest-in-a-stream

面经如下：
Round 1: 难度medium左右的string + hashmap题，lz基本直接找到思路交流没问题之后就开始写了，最后followup问了要如何让这些代码更production ready
Round 2: 难度easy的heap题，基本想出用heap这题就解决了，面试官是印姐但人还蛮好的，最后也没问什么followup，留了十分钟q&a
Round 3: 难度medium-hard的ooo题，给了一个scenario需要自己搭建class/objects然后写method。lz一开始没太理解问题所以问了很久clarification，不过完全理解之后很快就设计出来了，最后五分钟才写完代码。面试官还蛮年轻的在texas所以整体感觉比较chill
Round 4: 华人大哥的behavioral，基本前50%简历后50%假设问题，简历挖的比较深但后面的问题我俩更像在讨论而不是问答，体验感比较好

<details><summary>Hints (spoiler)</summary>

1. Choose a representation that makes the core operation simple.
2. Handle empty and boundary inputs before the main algorithm.
</details>
