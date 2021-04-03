---
layout: default
---

# Limitations and Roadmap

As an open source project is not only important to document what the project can but also the things you currently cannot achieve and where the project is heading that way you can save time and use another project if this one does not suits you, and that is the purpose of this page.

## Current Limitations

| Limitation                      | Description                               | Example | Current Workaound |
| ------------------------------- | ----------------------------------------- | ------- | ----------------- |
| Unary Plus (+)                  | Not Supported                             | X++5    | X+5               |
| Unary Minus (-) before variable | This is supported X-5 but this is not 5-X | 5-X     | 5-X*-1            |

## Roadmap

### Native Function Support

Let's say you want to implement a function that takes 3 parameters and returns the max value something like this: "max(1,2,3)". Currently you cannot do this because you can only add Operators that are either binary or unary. So the idea is to implement something like that.

### Numeric Methods to solve Equations

The idea here is to add support for solving equations using well known algorithms.

## Learn More

You can learn more about the library in the [docs](../)
