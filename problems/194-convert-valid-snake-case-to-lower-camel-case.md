# Convert Valid Snake Case to Lower Camel Case
> Google · Technical Screen · hard · Pattern: String Processing
> Source: https://prachub.com/interview-questions/convert-valid-snake-case-to-lower-camel-case

# Convert Valid Snake Case to Lower Camel Case

Given a valid snake-case identifier, convert it to lower camel case.

The input consists of one or more lowercase ASCII words separated by single underscores. There is no leading underscore, trailing underscore, or pair of adjacent underscores. The output keeps the first word lowercase, removes each underscore, and capitalizes the first letter of every later word.

Implement:

```python
def solve(name: str) -> str:
    ...
```

## Constraints

- `1 <= len(name) <= 100_000`
- `name` matches `[a-z]+(?:_[a-z]+)*`

## Examples

```text
"foo_bar"       -> "fooBar"
"already"       -> "already"
"http_api_name" -> "httpApiName"
```

<details><summary>Hints (spoiler)</summary>

1. An underscore signals that the next letter should be capitalized.
2. The input validity guarantee removes empty-word edge cases.
</details>
