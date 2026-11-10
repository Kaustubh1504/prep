# Design server allocation for multi-type nodes
> Google · Technical Screen · medium · Pattern: Design / Data Structure
> Source: https://prachub.com/interview-questions/design-server-allocation-for-multi-type-nodes

job/task scheduling system 设计 Task scheduler infra, 着重task dependency，task storage, task schedule, long running task
sd 是设计一个分布式的 消息队列系统，支持大的输入输出。先从 api 入手 crud 做deployment，之后考查了 handle 各种failure case，防止数据丢失，以及怎么恢复。我主要按照alex xu 答的，很顺畅。 设计一个mq的service, in-memory MQ, how to design class and API, in memory mq会怎么设计class还有api。大概问一问了之后看怎么设计mq的cloud service. 后面聊了一下storage怎么搞，毕竟是一个cloud service肯定有不同的user来用这个service创建他们的mq，这种情况下resources怎么分配
Event subscription system

Design 一个可以edit的code notebook, how to design the execute service then use a proxy to fetch the result and  return to browser.
1）user可以上传自定义function的jar file with full qualified name，function method 2）user可以提交request to run function with arguments. 是在coding pad里描述系统设计，面试官应该是比较注重API design，定义要endpoint和具体的request和response。 面完复盘觉得应该是比较像design leetcode吧。 面试官很注重API design，如何设计RESTFul考得比较细，遗憾的是准备的时候没有花很多时间在API所以花了很多时间也没怎么讲清楚。
| design leetcode
从传统数据库导入NonSql数据库的系统，其中导入部分（其实就是个监听CDC的queue）和NonSql的数据库（这个是设计的主要部分）都需要设计. 假设了每一条数据库记录可以转换成 主键:其他值形成的json的这种模式，简化了问题.  create a snaptshot on relational db. CDC应该只是包括当前WAL里面被update的数据。没有snapshot旧的数据无法导入到新的key value store. 第二部是从wal里面导入cdc数据
Design a cloud based detection and response system
A startup company has an AI based anomaly detection package. The input of the algorithm is a snapshot of the operating system. The output is Normal or Abnormal. If it is abnormal, response includes:
Shut down the machine
Quarantine the machine
Send warning emails
Client can query and see the history of warning message
Design the detection service.

设计题是设计一个data pipeline，输入文件表单，在很多不同的文件里，大小不同，都是一行一行的，要求输出成每个100MB的文件，输出和输入的行完全一样，不能多也不能少。
design quota enforcement system.  Quota Enforcement System, 优先解决高并发问题
比如api quota / storage quota 我system design准备的不多。。。所以在讨论non functional requirement的时候 没有理清楚就去解决consistency的问题了 我当时觉得quota跟收费有关 所以必须保证当前的usage有两个request进来的时候按顺序增加 保证consistency 但现在回想面试官当时强调了2遍这个quota enforcement service是给多个service用的 会有很多request 所以其实应该是优先解决高并发的问题 所以这一轮其实可以按照标准的一个高并发的系统去回答 最后我现在也想问下大家 这个quota的consistency怎么解决呢 如果eventual consistency去解决的话 那usage比quota高了一点的部分 怎么去收钱呢
用户能不能上传文件
设计一个系统可以让学校里面的老师或者员工给学生的家长或者监护人发信息，家长或者监护人需要ackowledge这个信息, 重点 系统架构设计， 消息传递可靠性， 家长确认机制
event subscription system. 某些客户端发送 events in fire and forget manner, 1000k/s. 某些客户可以注册 subscritption rules for events they are interested in, register webhook, and get notified.

notification system，at least once delivery
A/B testing platform
给一个文件service，不同的用户可以上传不同的文件，如果文件一模一样我们需要去重后存储，用户可以get和delete，不同用户彼此不影响. 类似AWS S3, 需要get, delete, 重复的文件需要去重. design file storage system, cannot use database, only use os file system api
怎么样存分布式数据日志
设计亚麻KMS. 功能: 用户给个key id, 返回key就行了
设计一个KV store
设计电梯系统
Distributed transactions协议
云上服务application 的monitor and action监控服务，需要收集数据，调用ai的监控服务，然后根据结果take actions（shut down或者网络隔离）
Design netflix的小变种，只需要get user viewed video list + resume from last viewed timestamp这部分
design quota enforcement system 比如api quota / storage quota 我system design准备的不多。。。所以在讨论non functional requirement的时候 没有理清楚就去解决consistency的问题了 我当时觉得quota跟收费有关 所以必须保证当前的usage有两个request进来的时候按顺序增加 保证consistency 但现在回想面试官当时强调了2遍这个quota enforcement service是给多个service用的 会有很多request 所以其实应该是优先解决高并发的问题 所以这一轮其实可以按照标准的一个高并发的系统去回答 最后我现在也想问下大家 这个quota的consistency怎么解决呢 如果eventual consistency去解决的话 那usage比quota高了一点的部分 怎么去收钱呢
SD: 雪花有很多个可以供用户租赁的server 每个server有node id， status， instance type。 这里的instance type和EC2不太一样，个人的理解如下： 比如instance type有s1, s2, s3, m1, m2, m3, L1, L2, L3, XL1, ... 一共一百种， server A可以当作m1,m2,L1,L2。 server B可以当作s1, m1, L1。当用户发request说我要两个(m1, L1)的server的时候， 我们可以return A和B。如果用户说我要两个(m1, m2)的server的话， 我们就不能return B。 让你设计一个manage server node 的service， API如下： getServer(int reqNumOfServer, String[] instance_types); returnServer(int[] serverNodeIds); 个人觉得难点在于快速查找满足用户需求的available server。 面试官问如果有10w个server node， 怎么快速的给用户response。我当时答的比较naive，基本是就是partition了一下， 再加个status的index。 如果有人有其他解决方法的话，欢迎留言！
