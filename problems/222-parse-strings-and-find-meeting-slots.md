# Parse strings and find meeting slots
> Google · Onsite · medium · Pattern: Stack / Parsing, Intervals / Sweep Line
> Source: https://prachub.com/interview-questions/parse-strings-and-find-meeting-slots

{"blocks": [{"key": "1178bfe7", "text": "Question", "type": "header-two", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {}}, {"key": "ec06e9a6", "text": "Given a text file where each line contains raw information, extract the user identifier and the numeric quantity on that line and store the results efficiently.", "type": "unordered-list-item", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {}}, {"key": "dcd24e48", "text": "Given multiple people's calendars (each as a list of available days), return the days when everyone is available for a meeting. Follow-ups: (a) return the days when at least P people are available; (b) given an integer X, return time periods of consecutive days of length X when the availability condition holds.", "type": "unordered-list-item", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {}}], "entityMap": {}}

<details><summary>Hints (spoiler)</summary>

1. Use a regular expression to extract '@username' and the (signed) integer from each line; strip the leading '@' from the username.
2. Aggregate per-user sums in a dictionary for O(1) average updates.
3. Convert each user's availability list to a set to remove duplicates before counting days.
4. Count availability per day across users, then collect days with count >= p and sort them.
5. Scan the sorted valid days to find consecutive runs and emit all length-x windows within each run.
</details>

<details><summary>Approach (spoiler)</summary>

Parse each line using two regular expressions: one to capture '@username' and one for the signed integer. Aggregate per-user sums in a dictionary. For calendars, treat each user's list as a set to avoid counting duplicate days. Build a count map from day to number of users available, then collect days with count >= p and sort them. To produce periods of length x, scan the sorted valid days to find maximal consecutive runs. For a run of length L, there are L - x + 1 windows of size x; emit each as [start, start + x - 1].

**Time:** O(L + T + D log D + W), where L = number of lines, T = total day entries across calendars, D = number of distinct days with at least one available user, and W = number of output windows · **Space:** O(U + D), where U = number of distinct users seen in lines and D = number of distinct days across calendars
</details>
