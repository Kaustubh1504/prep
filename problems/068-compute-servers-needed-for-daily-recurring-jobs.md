# Compute servers needed for daily recurring jobs
> Google · Technical Screen · medium · Pattern: Intervals / Sweep Line
> Source: https://prachub.com/interview-questions/compute-servers-needed-for-daily-recurring-jobs

You operate a cluster of identical servers that run recurring **daily** jobs.

For a single day, you are given a list of job execution intervals. Each interval has:

- `job_id` (string or integer),
- `start_time` (timestamp within that day),
- `end_time` (timestamp within that day), with `start_time < end_time`.

Interpret each interval as a half-open time range `[start_time, end_time)` during which that job must be running on some server **on that day**.

Rules and constraints:

- Each physical server can execute at most **one job at a time**.
- However, if multiple intervals in the input correspond to the **same `job_id`**, they may overlap in time **on the same server** (they are considered parts or retries of the same job and do not consume extra capacity).
- If a job's true execution would extend past midnight into the next day, it is conceptually **truncated at the end of the current day** for scheduling purposes; for each day you only see the portion that falls within that day’s 24-hour window.

### Tasks

1. Given all job intervals for a single day (potentially with repeated `job_id`s and overlapping intervals), compute the **minimum number of servers** required to schedule all the jobs under the above rules.
2. Describe the time and space complexity of your algorithm in terms of the number of intervals \(m\).

### Follow-up

Some rare jobs are extremely long-running and conceptually span **multiple days** without restart. For such a multi-day job, you decide to reserve a **dedicated server** that is not shared with any other jobs, but which may still handle different intervals of that same `job_id`.

Explain how you would extend or adapt your solution to:

- Detect which jobs require a dedicated server based on their multi-day duration or configuration.
- Account for these dedicated servers when computing the total number of servers needed for the system.

<details><summary>Hints (spoiler)</summary>

1. At any moment, one server is needed for each distinct active job_id, not for each active interval.
2. Try merging all intervals belonging to the same job_id first, then run a sweep-line algorithm over the merged intervals.
</details>
